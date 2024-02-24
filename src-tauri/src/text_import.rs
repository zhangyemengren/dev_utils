use scraper::{ElementRef, Html, Selector};

#[tauri::command]
pub fn import_by_html(value: &str) -> String {
    let fragment = Html::parse_fragment(value);
    let table_selector = Selector::parse("table.confluenceTable").unwrap();
    let tables: Vec<_> = fragment
        .select(&table_selector)
        .filter_map(filter_table)
        .collect();
    if !tables.is_empty() {
        println!("{:?} {:?} .", tables[0].t_type, tables[0].rows.len());
        format!("{:?}", tables)
    } else {
        format!("No table found")
    }
}

#[derive(Debug)]
enum TableType {
    Row,
    Col,
}

#[derive(Debug)]
struct Table {
    t_type: TableType,
    rows: Vec<String>,
}
fn filter_table(table: ElementRef) -> Option<Table> {
    let tr_selector = Selector::parse("tr").ok()?;
    let td_selector = Selector::parse("td").ok()?;
    let th_selector = Selector::parse("th").ok()?;
    let first_col = table
        .select(&tr_selector)
        .filter_map(|row| {
            row.select(&td_selector)
                .next()
                .or(row.select(&th_selector).next())
        })
        .collect::<Vec<_>>();
    let first_row = table.select(&tr_selector).next()?;
    let mut text_row = first_row
        .text()
        .map(|t| t.to_lowercase().to_string())
        .collect::<Vec<_>>();
    text_row.sort();
    text_row.dedup();
    let text_col_all = text_row.join(" ");
    let mut text_col = first_col
        .iter()
        .map(|td| {
            td.text()
                .map(|t| t.to_lowercase())
                .collect::<Vec<_>>()
                .join(" ")
        })
        .collect::<Vec<_>>();
    text_col.sort();
    text_col.dedup();
    let text_row_all = text_col.join(" ");
    if CN_HIT
        .iter()
        .any(|&x| text_col_all.contains(x) || text_row_all.contains(x))
    {
        let t_type = get_table_type(&text_row);
        println!("{:?} {:?} {:?}", text_row, text_col, t_type);
        Some(Table {
            t_type,
            rows: text_col,
        })
    } else {
        None
    }
}

fn get_table_type(rows: &Vec<String>) -> TableType {
    if CN_HIT.iter().any(|x| rows.contains(&x.to_string()))
        && EN_HIT.iter().any(|x| rows.contains(&x.to_string()))
    {
        TableType::Row
    } else {
        TableType::Col
    }
}

const CN_HIT: [&'static str; 6] = ["cn", "中文", "zh", "zh-cn", "zh-hans", "sc"];
const EN_HIT: [&'static str; 3] = ["en", "english", "英文"];
