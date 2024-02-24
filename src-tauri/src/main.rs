// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod merge_branch;
mod text_import;
mod update_dependency;

use text_import::*;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![import_by_html])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
