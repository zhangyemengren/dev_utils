use crate::get_dirs;
use rayon::prelude::*;
use std::process::Command;

#[tauri::command]
pub async fn test() -> String {
    let dirs = get_dirs("/Users/zhangchi/personal/tests".to_string());
    dirs.par_iter().for_each(|p| {
        let status = Command::new("npm")
            .env("PATH", "/usr/local/bin")
            .current_dir(p.path.clone())
            .args(["get", "registry"])
            .status()
            .expect("failed to execute process");
    });
    "多线程结束".to_string()
}
