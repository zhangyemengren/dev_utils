use serde::Serialize;
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize)]
pub struct Item {
    pub name: String,
    pub path: String,
}
#[tauri::command]
pub fn get_dirs(url: String) -> Vec<Item> {
    let mut dirs = vec![];
    let path = Path::new(&url);
    println!("{:?}", path);
    if path.is_dir() {
        for entry in fs::read_dir(path).unwrap() {
            let entry = entry.unwrap();
            let path = entry.path();
            let path_str = path.to_str().unwrap().to_string();
            if path.is_dir() {
                // has a .git file
                let mut entries = fs::read_dir(&path).unwrap();
                let has_git = entries.any(|entry| {
                    let entry = entry.unwrap();
                    let path = entry.path();
                    let path_str = path.to_str().unwrap().to_string();
                    path_str.ends_with(".git")
                });
                if has_git {
                    dirs.push(Item {
                        name: entry.file_name().to_str().unwrap().to_string(),
                        path: path_str,
                    });
                }
            }
        }
    }
    println!("{:?}", dirs);
    dirs
}
