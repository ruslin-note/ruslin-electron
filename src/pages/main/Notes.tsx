import { Button, ListItem } from "@/components";
import "./Notes.scss";
import { For, VoidComponent, createResource } from "solid-js";
import appData from "@/lib/AppData";

export const Notes: VoidComponent<{
  selectedFolder: string;
  selectedNote: string | null;
  onSelectNote: (noteId: string) => void;
}> = (props) => {
  // Cannot use `null`. https://www.solidjs.com/docs/latest/api#createresource
  const [notes] = createResource(
    () => props.selectedFolder,
    async (folderId) => appData.loadAbbrNotes(folderId)
  );

  return (
    <div class="notes-container">
      <div class="notes-header">
        <Button variant="accent">New note</Button>
      </div>
      <For each={notes()}>
        {(note) => (
          <ListItem
            selected={props.selectedNote === note.id}
            onClick={() => {
              props.onSelectNote(note.id);
            }}
          >
            {note.title}
          </ListItem>
        )}
      </For>
    </div>
  );
};
