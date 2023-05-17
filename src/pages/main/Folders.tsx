import {
  Button,
  ContentDialog,
  IconButton,
  ListItem,
  TextBlock,
  TextBox,
  Variant,
} from "@/components";
import { IoAddSharp } from "solid-icons/io";
import "./Folders.scss";
import { For, Show, createResource, createSignal } from "solid-js";
import appData from "@/lib/AppData";

export const Folders = () => {
  let path = appData.path;
  console.log(path);

  const [newTitle, setNewTitle] = createSignal("");
  const [folders, { refetch }] = createResource(() => appData.loadFolders());
  const [selectedFolderId, setSelectedFolderId] = createSignal("");
  const [showCreateNotebookDialog, setShowCreateNotebookDialog] =
    createSignal(false);

  return (
    <div class="folders-container">
      <div class="folders-header">
        <TextBlock variant={Variant.BodyStrong}>Notebooks</TextBlock>
        <IconButton
          onClick={() => {
            setShowCreateNotebookDialog(true);
          }}
        >
          <IoAddSharp />
        </IconButton>
      </div>
      <For each={folders()}>
        {(folder) => (
          <ListItem
            selected={selectedFolderId() === folder.id}
            title={folder.title}
            onClick={() => setSelectedFolderId(folder.id)}
          ></ListItem>
        )}
      </For>
      <Show when={showCreateNotebookDialog()}>
        <ContentDialog
          title="Create notebook"
          onEscape={() => setShowCreateNotebookDialog(false)}
          footer={
            <>
              <Button
                variant="accent"
                disabled={newTitle().length === 0}
                onClick={() => {
                  appData.createFolder(newTitle()).then(() => {
                      setNewTitle("");
                      setShowCreateNotebookDialog(false);
                      refetch();
                  });
                }}>
                OK
              </Button>
              <Button onClick={() => setShowCreateNotebookDialog(false)}>
                Cancel
              </Button>
            </>
          }
        >
          <TextBox
            placeholder="name"
            value={newTitle()}
            onInput={(e) => setNewTitle(e.target.value)}
          ></TextBox>
        </ContentDialog>
      </Show>
    </div>
  );
};
