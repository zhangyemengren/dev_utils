use scraper::{Html, Selector};

#[tauri::command]
pub fn import_by_html(value: &str) -> String {
    let fragment = Html::parse_fragment(value);
    println!("{:?}", fragment);
    format!("Hello, {}!", value)
}