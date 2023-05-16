import {
  IconButton,
  ListItem,
  TextBlock,
  TextBox,
  Variant,
} from "@/components";
import { IoAddSharp } from "solid-icons/io";
import "./Folders.scss";
import { For, createResource, createSignal } from "solid-js";
import appData from "@/lib/AppData";

export const Folders = () => {
  let path = appData.path;
  console.log(path);

  const [title, setTitle] = createSignal("");
  const [folders, { refetch }] = createResource(() => appData.loadFolders());
  const [selectedFolderId, setSelectedFolderId] = createSignal("");

  return (
    <div class="folders-container">
      <div class="folders-header">
        <TextBlock variant={Variant.BodyStrong}>Notebooks</TextBlock>
        <IconButton
          onClick={() => {
            if (title().length > 0) {
              appData.createFolder(title()).then(() => {
                setTitle("");
                refetch();
              });
            }
          }}
        >
          <IoAddSharp />
        </IconButton>
      </div>
      <div class="folders-header">
        <TextBox
          placeholder="name"
          value={title()}
          onChange={(e) => setTitle(e.target.value)}
        ></TextBox>
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
    </div>
  );
};
