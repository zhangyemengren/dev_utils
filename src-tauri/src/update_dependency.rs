use serde::Deserialize;

#[tauri::command]
pub fn update_dependency(payload: Payload) {
    println!("Updating dependency: {:?}", payload);
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Payload {
    pub projects: Vec<String>,
    pub version_mode: String,
}
