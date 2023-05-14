import { IconButton, ListItem, TextBlock, Variant } from "@/components";
import { IoAddSharp } from "solid-icons/io";
import "./Folders.scss";
import { For, createResource, createSignal } from "solid-js";
import appData from "@/lib/AppData";

// const fetchUser = async (id) =>
// (await fetch(`https://swapi.dev/api/people/${id}/`)).json();

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
                console.log("create");
                refetch();
              });
            }
          }}
        >
          <IoAddSharp />
        </IconButton>
      </div>
      <div>
        <input placeholder="name" onInput={(e) => setTitle(e.target.value)} />
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
