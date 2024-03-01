use rayon::prelude::*;
use serde::Deserialize;
use std::borrow::Borrow;
use std::process::Command;
use tauri::http::status;

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

pub struct ExecutionResult {
    work_flows: Vec<StatusItem>,
}
#[derive(Debug)]
pub struct StatusItem {
    work_flow: WorkFlow,
    status: Status,
    message: String,
}
#[derive(Debug)]
pub enum Status {
    Success,
    Failed,
    NotRunning,
}
#[derive(Clone, Debug)]
pub enum WorkFlow {
    Add,
    Commit,
    CheckClean, // 查看是否有未提交 git status -s
    // Checkout to master -> CheckSubmodule(git submodule && git submodule update) -> Pull -> Checkout to branch
    // ok -> CheckSubmodule -> Pull
    // fail -> Checkout -b
    CheckoutExecuteBranch,
    CheckoutMergeBranch,
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
            _ => StatusItem {
                work_flow: WorkFlow::Add,
                status: Status::Success,
                message: "".to_string(),
            },
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
        Mode::Merge => {
            work_flows.push(WorkFlow::CheckClean);
            work_flows.push(WorkFlow::CheckoutMergeBranch);
            if let Some(_) = config.execute_branch {
                work_flows.push(WorkFlow::CheckoutExecuteBranch);
            }
            work_flows.push(WorkFlow::Merge);
        }
        Mode::Rebase => {
            work_flows.push(WorkFlow::CheckClean);
            work_flows.push(WorkFlow::CheckoutMergeBranch);
            if let Some(_) = config.execute_branch {
                work_flows.push(WorkFlow::CheckoutExecuteBranch);
            }
            work_flows.push(WorkFlow::Rebase);
        }
        Mode::CherryPick => {
            work_flows.push(WorkFlow::CheckClean);
            if let Some(_) = config.execute_branch {
                work_flows.push(WorkFlow::CheckoutExecuteBranch);
            }
            work_flows.push(WorkFlow::CherryPick);
        }
        _ => (),
    }
    work_flows.push(WorkFlow::Add);
    work_flows.push(WorkFlow::Commit);
    if config.need_push {
        work_flows.push(WorkFlow::Push);
    }
    work_flows
}

#[tauri::command]
pub async fn git_workflow(payload: GitPayload) -> bool {
    let GitPayload {
        ref mode,
        ref config,
        ..
    } = payload;

    payload.projects.par_iter().for_each(|p| {
        let work_flows = get_workflow(mode, config)
            .into_iter()
            .map(|w| w.run(p, config))
            .collect::<Vec<_>>();
        println!("Checking clean in project: {:?}", work_flows);
    });

    true
}
