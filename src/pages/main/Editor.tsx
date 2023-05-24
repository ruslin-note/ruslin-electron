import { Show, VoidComponent, createResource, onCleanup } from "solid-js";
import "./Editor.scss";
import appData from "@/lib/AppData";
import { createCodeMirror, createEditorControlledValue } from "./CodeMirror";

const saveNoteBody = (id: string, body: string) =>
  appData.saveNoteBody(id, body).catch((e) => {
    console.error(e);
  });

const saveNoteTitle = (id: string, title: string) =>
  appData.saveNoteTitle(id, title).catch((e) => {
    console.error(e);
  });

export const Editor: VoidComponent<{
  selectedNote: string | null;
  onTitleChange: (id: string, title: string) => void;
}> = (props) => {
  const [note] = createResource(
    () => props.selectedNote,
    (selectedNote) => appData.loadNote(selectedNote)
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
      <Show when={note()}>
        {(note) => (
          <>
            <TitleInput
              title={note().title}
              onInput={(newTitle) => props.onTitleChange(note().id, newTitle)}
              onSaveTitle={(newTitle) => saveNoteTitle(note().id, newTitle)}
            />
            <div class="code-mirror-container" ref={editorRef}></div>
          </>
        )}
      </Show>
    </div>
  );
};

const TitleInput: VoidComponent<{
  title: string;
  onInput: (newTitle: string) => void;
  onSaveTitle: (newTitle: string) => void;
}> = (props) => {
  let delayTimer: NodeJS.Timeout | undefined;
  let changed: boolean = false;

  onCleanup(() => {
    clearTimeout(delayTimer);
  });

  return (
    <input
      class="note-title"
      value={props.title}
      onInput={(e) => {
        props.onInput(e.target.value);
        changed = true;
        clearTimeout(delayTimer);
        delayTimer = setTimeout(() => {
          props.onSaveTitle(e.target.value);
          changed = false;
        }, 1000);
      }}
      onBlur={(e) => {
        if (changed) {
          props.onSaveTitle(e.target.value);
          changed = false;
          clearTimeout(delayTimer);
        }
      }}
    ></input>
  );
};
