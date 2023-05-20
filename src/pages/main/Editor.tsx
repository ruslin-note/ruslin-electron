import { Show, VoidComponent, createResource } from "solid-js";
import "./Editor.scss";
import appData from "@/lib/AppData";
import { createCodeMirror, createEditorControlledValue } from "./CodeMirror";

const saveNoteBody = (id: string, body: string) =>
  appData.saveNoteBody(id, body).catch((e) => {
    console.error(e);
  });

export const Editor: VoidComponent<{
  selectedNote: string | null;
}> = (props) => {
  const [note] = createResource(
    () => props.selectedNote,
    (noteId) => appData.loadNote(noteId)
  );

  const { editorView, ref: editorRef } = createCodeMirror({
    value: "",
    onValueChange: (value) => saveNoteBody(note()!.id, value),
    onBlur: (latestValue) => {
      if (latestValue) {
        saveNoteBody(note()!.id, latestValue);
      }
    },
  });

  createEditorControlledValue(editorView, () => note()?.body);

  return (
    <div class="note-detail-container">
      <Show when={!!note()}>
        <div>{note()?.title}</div>
        <div ref={editorRef}></div>
      </Show>
    </div>
  );
};
