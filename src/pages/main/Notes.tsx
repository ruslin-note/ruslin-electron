import { Button, ListItem } from "@/components";
import "./Notes.scss";
import {
  For,
  Signal,
  VoidComponent,
  createEffect,
  createResource,
  on,
} from "solid-js";
import appData from "@/lib/AppData";
import { createStore, produce, reconcile, unwrap } from "solid-js/store";

function createDeepSignal<T>(value: T): Signal<T> {
  const [store, setStore] = createStore({
    value,
  });
  return [
    () => store.value,
    (v: T) => {
      const unwrapped = unwrap(store.value);
      typeof v === "function" && (v = v(unwrapped));
      setStore("value", reconcile(v));
      return store.value;
    },
  ] as Signal<T>;
}

export const Notes: VoidComponent<{
  selectedFolder: string;
  selectedNote: string | null;
  newNoteTitle: { id: string; newTitle: string } | undefined;
  onSelectNote: (noteId: string) => void;
}> = (props) => {
  let selectedIndexCache = 0;
  // Cannot use `null`. https://www.solidjs.com/docs/latest/api#createresource
  const [notes, { mutate }] = createResource(
    () => props.selectedFolder,
    async (folderId) => await appData.loadAbbrNotes(folderId),
    {
      storage: createDeepSignal,
    }
  );

  createEffect(
    on(
      () => props.newNoteTitle,
      (newNoteTitle) => {
        mutate(
          produce((notes) => {
            if (notes && newNoteTitle) {
              if (
                notes[selectedIndexCache] &&
                notes[selectedIndexCache].id === newNoteTitle.id
              ) {
                notes[selectedIndexCache].title = newNoteTitle.newTitle;
              } else {
                for (const [index, note] of notes.entries()) {
                  if (note.id === newNoteTitle.id) {
                    notes[index].title = newNoteTitle.newTitle;
                    selectedIndexCache = index;
                  }
                }
              }
            }
          })
        );
      }
    )
  );

  return (
    <div class="notes-container">
      <div class="notes-header">
        <Button variant="accent">New note</Button>
      </div>
      <div class="notes-list">
        <For each={notes()}>
          {(note, i) => {
            return (
              <ListItem
                selected={props.selectedNote === note.id}
                onClick={() => {
                  selectedIndexCache = i();
                  props.onSelectNote(note.id);
                }}
              >
                {note.title.length ? note.title : "Untitled"}
              </ListItem>
            );
          }}
        </For>
      </div>
    </div>
  );
};
