import { Editor } from "./Editor";
import { Notes } from "./Notes";
import { Folders } from "./Folders";
import "./index.scss";
import { createSignal } from "solid-js";

export const Main = () => {
  const [selectedFolder, setSelectedFolder] = createSignal("");
  const [selectedNote, setSelectedNote] = createSignal<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = createSignal<
    { id: string; newTitle: string } | undefined
  >(undefined);
  return (
    <div class="main-container">
      <Folders
        selectedFolder={selectedFolder()}
        onSelectFolder={setSelectedFolder}
      ></Folders>
      <Notes
        selectedFolder={selectedFolder()}
        selectedNote={selectedNote()}
        newNoteTitle={newNoteTitle()}
        onSelectNote={setSelectedNote}
      ></Notes>
      <Editor
        selectedNote={selectedNote()}
        onTitleChange={(id, newTitle) => {
          setNewNoteTitle({ id, newTitle });
        }}
      ></Editor>
    </div>
  );
};
