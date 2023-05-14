use napi::bindgen_prelude::*;
use napi_derive::napi;
use ruslin_data::{Folder, RuslinData, UpdateSource};
use std::path::PathBuf;

#[napi]
#[allow(dead_code)]
fn add(x: i32, y: i32) -> i32 {
    x + y
}

#[napi(object, js_name = "Folder")]
pub struct JsFolder {
    pub id: String,
    pub title: String,
}

impl From<Folder> for JsFolder {
    fn from(value: Folder) -> Self {
        Self {
            id: value.id,
            title: value.title,
        }
    }
}

#[napi]
pub struct AppData {
    data: RuslinData,
    path: PathBuf,
}

#[napi]
impl AppData {
    #[napi(constructor)]
    pub fn new() -> Self {
        let data_dir = dirs::data_dir().unwrap();
        #[cfg(debug_assertions)]
        let data_dir = data_dir.join("ruslin_debug");
        #[cfg(not(debug_assertions))]
        let data_dir = data_dir.join("ruslin");
        println!("dir: {}", data_dir.display());
        let resources_dir = data_dir.join("resources");
        let data = RuslinData::new(&data_dir, &resources_dir).unwrap();
        AppData {
            data,
            path: data_dir,
        }
    }

    #[napi(getter)]
    pub fn path(&self) -> String {
        format!("{}", self.path.display())
    }

    #[napi]
    pub async fn create_folder(&self, title: String) -> Result<()> {
        let folder = Folder::new(title, None);
        self.data
            .db
            .replace_folder(&folder, UpdateSource::LocalEdit)
            .unwrap(); // TODO: handle error
        Ok(())
    }

    #[napi]
    pub async fn load_folders(&self) -> Result<Vec<JsFolder>> {
        let folders = self.data.db.load_folders().unwrap();
        let folders = folders
            .into_iter()
            .map(|x| x.into())
            .collect::<Vec<JsFolder>>();
        Ok(folders)
    }
}
