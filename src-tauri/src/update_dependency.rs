use rayon::prelude::*;
use serde::Deserialize;
use std::process::Command;

#[tauri::command]
pub async fn update_dependency(payload: UpDepPayload) {
    let UpDepPayload {
        ref pkg_name,
        ref pkg_version,
        ref install_mode,
        ref registry,
        ref npm_path,
        is_exact,
        ..
    } = payload;
    payload.projects.par_iter().for_each(|p| {
        let mut args = vec!["install".to_string()];
        let pkg_version = if pkg_version.is_empty() {
            "latest"
        } else {
            pkg_version.as_str()
        };
        args.push(format!("{}@{}", pkg_name, pkg_version));

        if is_exact {
            args.push("--save-exact".to_string());
        }
        let install_mode_flag = match install_mode {
            InstallMode::Prod => "--save-prod",
            InstallMode::Dev => "--save-dev",
            InstallMode::Optional => "--save-optional",
            _ => "",
        };
        if !install_mode_flag.is_empty() {
            args.push(install_mode_flag.to_string());
        }
        if !registry.is_empty() {
            args.push(format!("--registry={}", registry));
        }
        println!("args: {:?}", args);
        let status = Command::new("npm")
            .env("PATH", npm_path)
            .current_dir(p)
            .args(args)
            .status()
            .expect("failed to execute process");
        println!("Updating dependency in project: {:?}", status.success());
    });
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UpDepPayload {
    pub projects: Vec<String>,
    pub is_exact: bool,
    pub pkg_name: String,
    pub pkg_version: String,
    pub install_mode: InstallMode,
    pub registry: String,
    pub npm_path: String,
}
#[derive(Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum InstallMode {
    Default,
    Prod,
    Dev,
    Optional,
}
