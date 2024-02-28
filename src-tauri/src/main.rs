// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod git_operation;
mod global;
mod text_import;
mod update_dependency;
mod utils;

use git_operation::*;
use global::*;
use text_import::*;
use update_dependency::*;
use utils::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            test,
            close_splashscreen,
            import_by_html,
            get_dirs,
            update_dependency
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
