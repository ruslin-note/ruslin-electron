import { VoidComponent, createResource } from "solid-js";
import "./Editor.scss";
import appData from "@/lib/AppData";

export const Editor: VoidComponent<{
  selectedNote: string;
}> = (props) => {
  const [note] = createResource(
    () => props.selectedNote,
    (noteId) => appData.loadNote(noteId)
  );
  return (
    <div class="note-detail-container">
      <div>{note()?.title}</div>
      <div>{note()?.body}</div>
    </div>
  );
};
