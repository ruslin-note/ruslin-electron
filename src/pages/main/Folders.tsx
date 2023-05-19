import {
  Button,
  ContentDialog,
  IconButton,
  ListItem,
  ProgressRing,
  TextBlock,
  TextBox,
  Variant,
} from "@/components";
import { IoAddSharp } from "solid-icons/io";
import "./Folders.scss";
import {
  For,
  Show,
  VoidComponent,
  createResource,
  createSignal,
} from "solid-js";
import appData from "@/lib/AppData";
import type { SyncInfo } from "ruslin-addon/addon";

export const Folders: VoidComponent<{
  selectedFolder: string;
  onSelectFolder: (folderId: string) => void;
}> = (props) => {
  let path = appData.path;
  console.log(path);

  const [newTitle, setNewTitle] = createSignal("");
  const [folders, { refetch: refetchFolders }] = createResource(() =>
    appData.loadFolders()
  );
  const [showCreateNotebookDialog, setShowCreateNotebookDialog] =
    createSignal(false);

  return (
    <div class="folders-container">
      <div>
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
        <ListItem
          selected={props.selectedFolder === ""}
          onClick={() => props.onSelectFolder("")}
        >
          All notes
        </ListItem>
        <For each={folders()}>
          {(folder) => (
            <ListItem
              selected={props.selectedFolder === folder.id}
              onClick={() => props.onSelectFolder(folder.id)}
            >
              {folder.title}
            </ListItem>
          )}
        </For>
      </div>
      <div class="folders-footer">
        <SynchronizeButton
          onFinished={() => {
            refetchFolders();
          }}
        />
      </div>
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
                    refetchFolders();
                  });
                }}
              >
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

const SynchronizeButton: VoidComponent<{
  onFinished: (syncInfo: SyncInfo) => void;
}> = (props) => {
  const [synchronizing, setSynchronizing] = createSignal(false);
  return (
    <Button
      disabled={synchronizing()}
      onClick={() => {
        setSynchronizing(true);
        appData
          .synchronize(false)
          .then((syncInfo) => {
            props.onFinished(syncInfo);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            setSynchronizing(false);
          });
      }}
    >
      <Show when={synchronizing()}>
        <ProgressRing style="padding-inline-end:6px;" disabled></ProgressRing>
      </Show>
      {synchronizing() ? "Synchronizing" : "Synchronize"}
    </Button>
  );
};
