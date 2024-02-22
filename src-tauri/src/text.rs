use scraper::{Html, Selector, ElementRef};

#[tauri::command]
pub fn import_by_html(value: &str) -> String {
    let fragment = Html::parse_fragment(value);
    let table_selector = Selector::parse("table.confluenceTable").unwrap();
    let tables:Vec<_> = fragment.select(&table_selector).filter_map(filter_table).collect();
    println!("{:?}", tables.len());
    format!("Hello, {}!", value)
}

fn filter_table(table: ElementRef) -> Option<bool> {
    let tr_selector = Selector::parse("tr").ok()?;
    let tr = table.select(&tr_selector).next()?;
    let text = tr.text().collect::<Vec<_>>().join(" ");
    println!("{:?}", text);
    Some(true)
}