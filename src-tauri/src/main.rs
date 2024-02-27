// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod global;
mod merge_branch;
mod text_import;
mod update_dependency;
mod utils;

use global::*;
use merge_branch::*;
use text_import::*;
use update_dependency::*;
use utils::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            test1,
            test2,
            test3,
            close_splashscreen,
            import_by_html,
            get_dirs,
            update_dependency
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
