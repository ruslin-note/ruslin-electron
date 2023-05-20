use napi::bindgen_prelude::*;
use napi_derive::napi;
use ruslin_data::{
    sync::{SyncConfig, SyncInfo},
    AbbrNote, Folder, Note, RuslinData, UpdateSource,
};
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

#[napi(object, js_name = "SyncConfig")]
pub struct JsSyncConfig {
    pub host: String,
    pub email: String,
    pub password: String,
}

impl From<JsSyncConfig> for SyncConfig {
    fn from(value: JsSyncConfig) -> Self {
        let JsSyncConfig {
            host,
            email,
            password,
        } = value;
        Self::JoplinServer {
            host,
            email,
            password,
        }
    }
}

#[napi(object, js_name = "SyncInfo")]
pub struct JsSyncInfo {
    pub delete_remote_count: i32,
    pub conflict_note_count: i32,
    pub other_conflict_count: i32,
    pub upload_count: i32,
    pub delete_count: i32,
    pub pull_count: i32,
    pub elapsed_time: f64,
}

impl From<SyncInfo> for JsSyncInfo {
    fn from(value: SyncInfo) -> Self {
        let SyncInfo {
            delete_remote_count,
            conflict_note_count,
            other_conflict_count,
            upload_count,
            delete_count,
            pull_count,
            elapsed_time,
        } = value;
        Self {
            delete_remote_count,
            conflict_note_count,
            other_conflict_count,
            upload_count,
            delete_count,
            pull_count,
            elapsed_time,
        }
    }
}

#[napi(object, js_name = "AbbrNote")]
pub struct JsAbbrNote {
    pub id: String,
    pub title: String,
}

impl From<AbbrNote> for JsAbbrNote {
    fn from(value: AbbrNote) -> Self {
        let AbbrNote { id, title, .. } = value;
        Self { id, title }
    }
}

#[napi(object, js_name = "Note")]
pub struct JsNote {
    pub id: String,
    pub title: String,
    pub body: String,
}

impl From<Note> for JsNote {
    fn from(value: Note) -> Self {
        let Note {
            id, title, body, ..
        } = value;
        Self { id, title, body }
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

    #[napi]
    pub async fn save_sync_config(&self, sync_config: JsSyncConfig) -> Result<()> {
        self.data
            .save_sync_config(sync_config.into())
            .await
            .map_err(|e| Error::from_reason(e.to_string()))?;
        Ok(())
    }

    #[napi]
    pub async fn synchronize(&self, from_scratch: bool) -> Result<JsSyncInfo> {
        let sync_info = self
            .data
            .synchronize(from_scratch)
            .await
            .map_err(|e| Error::from_reason(e.to_string()))?;
        Ok(sync_info.into())
    }

    #[napi]
    pub async fn load_abbr_notes(&self, parent_id: String) -> Result<Vec<JsAbbrNote>> {
        let parent_id = if parent_id.is_empty() {
            None
        } else {
            Some(parent_id)
        };
        let notes = self
            .data
            .db
            .load_abbr_notes(parent_id.as_deref())
            .map_err(|e| Error::from_reason(e.to_string()))?;
        Ok(notes.into_iter().map(|n| n.into()).collect())
    }

    #[napi]
    pub async fn load_note(&self, id: String) -> Result<JsNote> {
        Ok(self
            .data
            .db
            .load_note(&id)
            .map_err(|e| Error::from_reason(e.to_string()))?
            .into())
    }

    #[napi]
    pub async fn save_note_body(&self, id: String, body: String) -> Result<()> {
        self.data
            .db
            .update_note_body(&id, &body)
            .map_err(|e| Error::from_reason(e.to_string()))?;
        Ok(())
    }

    #[napi]
    pub async fn save_note_title(&self, id: String, title: String) -> Result<()> {
        self.data
            .db
            .update_note_title(&id, &title)
            .map_err(|e| Error::from_reason(e.to_string()))?;
        Ok(())
    }
}
