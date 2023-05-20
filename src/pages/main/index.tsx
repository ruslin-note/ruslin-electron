import { Editor } from "./Editor";
import { Notes } from "./Notes";
import { Folders } from "./Folders";
import "./index.scss";
import { createSignal } from "solid-js";

export const Main = () => {
  const [selectedFolder, setSelectedFolder] = createSignal("");
  const [selectedNote, setSelectedNote] = createSignal<string | null>(null);
  return (
    <div class="main-container">
      <Folders
        selectedFolder={selectedFolder()}
        onSelectFolder={setSelectedFolder}
      ></Folders>
      <Notes
        selectedFolder={selectedFolder()}
        selectedNote={selectedNote()}
        onSelectNote={setSelectedNote}
      ></Notes>
      <Editor selectedNote={selectedNote()}></Editor>
    </div>
  );
};
