use crate::get_dirs;
use rayon::prelude::*;
use std::process::{Command, Stdio};

#[tauri::command]
pub async fn test1() -> String {
    "Hello from Rust".to_string()
}

#[tauri::command]
pub async fn test2() -> String {
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

#[tauri::command]
pub async fn test3() -> String {
    let dirs = get_dirs("/Users/zhangchi/personal/tests".to_string());
    dirs.par_iter().for_each(|p| {
        let status = Command::new("touch")
            .current_dir(p.path.clone())
            .args(["test.txt"])
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .status()
            .expect("failed to execute process");
    });
    "多线程结束".to_string()
}
