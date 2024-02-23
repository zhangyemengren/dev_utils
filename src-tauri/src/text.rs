use scraper::{ElementRef, Html, Selector};

#[tauri::command]
pub fn import_by_html(value: &str) -> String {
    let fragment = Html::parse_fragment(value);
    let table_selector = Selector::parse("table.confluenceTable").unwrap();
    let tables: Vec<_> = fragment
        .select(&table_selector)
        .filter_map(filter_table)
        .collect();
    println!("{:?}", tables.len());
    format!("Hello, {}!", value)
}

fn filter_table(table: ElementRef) -> Option<bool> {
    let tr_selector = Selector::parse("tr").ok()?;
    let td_selector = Selector::parse("td").ok()?;
    let th_selector = Selector::parse("th").ok()?;
    let first_row = table
        .select(&tr_selector)
        .filter_map(|row| {
            row.select(&td_selector)
                .next()
                .or(row.select(&th_selector).next())
        })
        .collect::<Vec<_>>();
    let first_col = table.select(&tr_selector).next()?;
    let text_col = first_col.text().collect::<Vec<_>>();
    let text_col_all = text_col.join(" ");
    let text_row = first_row
        .iter()
        .map(|td| td.text().collect::<Vec<_>>().join(" "))
        .collect::<Vec<_>>();
    let text_row_all = text_row.join(" ");
    if CN_HIT
        .iter()
        .any(|&x| text_col_all.contains(x) || text_row_all.contains(x))
    {
        println!("{:?} {:?}", text_col, text_row);
    }

    Some(true)
}

const CN_HIT: [&'static str; 5] = ["cn", "中文", "zh", "zh-cn", "zh-hans"];
