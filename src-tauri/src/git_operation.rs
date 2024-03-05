use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::{borrow::Borrow, collections::HashMap, error::Error, process::Command};

#[derive(Serialize, Debug)]
pub struct GitResponse {
    pub data: HashMap<String, Vec<StatusItem>>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct GitPayload {
    pub projects: Vec<String>,
    pub mode: Mode,
    pub config: Config,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub enum Mode {
    Commit,
    Merge,
    Rebase,
    CherryPick,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub execute_branch: Option<String>,
    pub merge_branch: Option<String>,
    pub commit_message: Option<String>,
    pub cherry_pick_commit: Option<String>,
    pub need_push: bool,
}

#[derive(Serialize, Clone, Debug)]
pub struct StatusItem {
    work_flow: WorkFlow,
    status: Status,
    message: String,
}
#[derive(Serialize, Clone, Debug)]
pub enum Status {
    Success,
    Failed,
    NotRunning,
}
#[derive(Serialize, Clone, Debug)]
pub enum WorkFlow {
    Add,
    Commit,
    CheckClean, // 查看是否有未提交 git status -s
    // Checkout to master -> CheckSubmodule(git submodule && git submodule update) -> Pull -> Checkout to branch
    // ok -> CheckSubmodule -> Pull
    // fail -> Checkout -b
    Checkout,
    Pull,
    Push,
    Merge,
    Rebase,
    CherryPick,
}

impl WorkFlow {
    pub fn run(&self, path: &str, config: &Config) -> StatusItem {
        match self {
            Self::Add => Self::cmd_add(path),
            Self::Commit => Self::cmd_commit(path, config.commit_message.as_deref()),
            Self::Push => Self::cmd_push(path, config.execute_branch.as_deref()),
            Self::CheckClean => Self::cmd_check_clean(path),
            Self::Checkout => Self::cmd_checkout(path, config),
            Self::Pull => Self::cmd_pull(path),
            Self::Merge | Self::Rebase | Self::CherryPick => {
                Self::cmd_merge(path, config, self.clone())
            }
        }
    }
    pub fn cmd_checkout(path: &str, config: &Config) -> StatusItem {
        let status = Command::new("git")
            .current_dir(path)
            .args(["checkout", "master"])
            .status()
            .expect("failed to execute process");
        if !status.success() {
            return StatusItem {
                work_flow: WorkFlow::Checkout,
                status: Status::Failed,
                message: "failed to checkout master".to_string(),
            };
        }
        // 有些项目是submodule架构
        if let Err(e) = Self::cmd_update_submodule(path) {
            return StatusItem {
                work_flow: WorkFlow::Checkout,
                status: Status::Failed,
                message: format!("failed to update submodule after checkout master: {}", e),
            };
        }

        let item = Self::cmd_pull(path);
        if let Status::Failed = item.status {
            return StatusItem {
                work_flow: WorkFlow::Checkout,
                status: Status::Failed,
                message: "failed to pull master".to_string(),
            };
        }
        // checkout to branch
        let the_branch = config.execute_branch.as_deref().unwrap();
        let status = Command::new("git")
            .current_dir(path)
            .args(["checkout", the_branch])
            .status()
            .expect("failed to execute process");
        if status.success() {
            if let Err(e) = Self::cmd_update_submodule(path) {
                return StatusItem {
                    work_flow: WorkFlow::Checkout,
                    status: Status::Failed,
                    message: format!(
                        "failed to update submodule after checkout execute branch: {}",
                        e
                    ),
                };
            }
            let item = Self::cmd_pull(path);
            if let Status::Failed = item.status {
                return StatusItem {
                    work_flow: WorkFlow::Checkout,
                    status: Status::Failed,
                    message: "failed to pull execute branch".to_string(),
                };
            }
        } else {
            let status = Command::new("git")
                .current_dir(path)
                .args(["checkout", "-b", the_branch])
                .status()
                .expect("failed to execute process");
            if !status.success() {
                return StatusItem {
                    work_flow: WorkFlow::Checkout,
                    status: Status::Failed,
                    message: "failed to checkout new execute branch".to_string(),
                };
            }
        }

        StatusItem {
            work_flow: WorkFlow::Checkout,
            status: Status::Success,
            message: "".to_string(),
        }
    }
    pub fn cmd_update_submodule(path: &str) -> Result<(), Box<dyn Error>> {
        let mut child = Command::new("git")
            .current_dir(path)
            .args(["submodule", "update"])
            .spawn()?;
        child.wait()?;
        Ok(())
    }
    pub fn cmd_merge(path: &str, config: &Config, work_flow: WorkFlow) -> StatusItem {
        let (k, v) = match work_flow {
            WorkFlow::Merge => (
                "merge",
                config.execute_branch.as_deref().unwrap_or("master"),
            ),
            WorkFlow::Rebase => (
                "rebase",
                config.execute_branch.as_deref().unwrap_or("master"),
            ),
            WorkFlow::CherryPick => (
                "cherry-pick",
                config.cherry_pick_commit.as_deref().unwrap_or("HEAD"),
            ),
            _ => unreachable!(),
        };

        let status = Command::new("git")
            .current_dir(path)
            .args([k, v])
            .status()
            .expect("failed to execute process");
        let status = if status.success() {
            Status::Success
        } else {
            Status::Failed
        };
        StatusItem {
            work_flow,
            status,
            message: "".to_string(),
        }
    }
    pub fn cmd_pull(path: &str) -> StatusItem {
        let status = Command::new("git")
            .current_dir(path)
            .args(["pull"])
            .status()
            .expect("failed to execute process");
        let status = if status.success() {
            Status::Success
        } else {
            Status::Failed
        };
        StatusItem {
            work_flow: WorkFlow::Pull,
            status,
            message: "".to_string(),
        }
    }
    pub fn cmd_check_clean(path: &str) -> StatusItem {
        let output = Command::new("git")
            .current_dir(path)
            .args(["status", "-s"])
            .output()
            .expect("failed to execute process");
        let status = if output.status.success() && output.stdout.is_empty() {
            Status::Success
        } else {
            Status::Failed
        };

        StatusItem {
            work_flow: WorkFlow::CheckClean,
            status,
            message: "".to_string(),
        }
    }
    pub fn cmd_add(path: &str) -> StatusItem {
        let mut child = Command::new("git")
            .current_dir(path)
            .args(["add", "."])
            .spawn()
            .expect("failed to execute process");
        child.wait().expect("failed to wait for child process");
        StatusItem {
            work_flow: WorkFlow::Add,
            status: Status::Success,
            message: "".to_string(),
        }
    }
    pub fn cmd_commit(path: &str, commit_message: Option<&str>) -> StatusItem {
        let message = commit_message.unwrap_or("feat: update");
        let mut chiild = Command::new("git")
            .current_dir(path)
            .args(["commit", "-m", message])
            .spawn()
            .expect("failed to execute process");
        chiild.wait().expect("failed to wait for child process");
        StatusItem {
            work_flow: WorkFlow::Commit,
            status: Status::Success,
            message: "".to_string(),
        }
    }
    pub fn cmd_push(path: &str, execute_branch: Option<&str>) -> StatusItem {
        let args = match execute_branch {
            Some(branch) => vec!["push", "-u", "origin", branch],
            None => vec!["push"],
        };
        let status = Command::new("git")
            .current_dir(path)
            .args(args)
            .status()
            .expect("failed to execute process");
        let status = if status.success() {
            Status::Success
        } else {
            Status::Failed
        };
        StatusItem {
            work_flow: WorkFlow::Push,
            status,
            message: "".to_string(),
        }
    }
}

fn get_workflow<B, C>(mode: B, config: C) -> Vec<WorkFlow>
where
    B: Borrow<Mode>,
    C: Borrow<Config>,
{
    let mode = mode.borrow();
    let config = config.borrow();
    let mut work_flows = vec![];

    match mode {
        Mode::Merge | Mode::Rebase | Mode::CherryPick => {
            work_flows.push(WorkFlow::CheckClean);
            work_flows.push(WorkFlow::Pull);
            if let Some(_) = config.execute_branch {
                work_flows.push(WorkFlow::Checkout);
            }
            match mode {
                Mode::Merge => {
                    work_flows.push(WorkFlow::Merge);
                }
                Mode::Rebase => {
                    work_flows.push(WorkFlow::Rebase);
                }
                Mode::CherryPick => {
                    work_flows.push(WorkFlow::CherryPick);
                }
                Mode::Commit => {
                    work_flows.push(WorkFlow::Add);
                    work_flows.push(WorkFlow::Commit);
                    work_flows.push(WorkFlow::Pull);
                }
            }
        }
        _ => (),
    }

    if config.need_push {
        work_flows.push(WorkFlow::Push);
    }
    work_flows
}

#[tauri::command]
pub async fn git_workflow(payload: GitPayload) -> GitResponse {
    let GitPayload {
        ref mode,
        ref config,
        ..
    } = payload;

    let mut map = HashMap::new();

    let work_flows: Vec<_> = payload
        .projects
        .par_iter()
        .map(|p| {
            let mut work_flows = get_workflow(mode, config)
                .into_iter()
                .map(|w| StatusItem {
                    work_flow: w,
                    status: Status::NotRunning,
                    message: "".to_string(),
                })
                .collect::<Vec<_>>();
            for w in work_flows.iter_mut() {
                let result = w.work_flow.run(p, config);
                let r = result.clone();
                w.status = r.status;
                w.message = r.message;
                if let Status::Failed = w.status {
                    break;
                }
            }
            println!("Checking clean in project: {:?}", work_flows);
            (p.clone(), work_flows)
        })
        .collect();

    work_flows.into_iter().for_each(|(k, v)| {
        map.insert(k, v);
    });

    GitResponse { data: map }
}
