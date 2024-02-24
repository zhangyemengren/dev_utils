// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod merge_branch;
mod text_import;
mod update_dependency;
mod utils;

use text_import::*;
use update_dependency::*;
use utils::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![import_by_html, get_dirs,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
