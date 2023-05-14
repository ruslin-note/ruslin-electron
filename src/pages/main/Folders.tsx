import { IconButton, ListItem, TextBlock, Variant } from "@/components";
import { IoAddSharp } from "solid-icons/io";
import "./Folders.scss";
import { createSignal } from "solid-js";

export const Folders = () => {
  const [title, setTitle] = createSignal("");

  return (
    <div class="folders-container">
      <div class="folders-header">
        <TextBlock variant={Variant.BodyStrong}>
          Notebooks
          {title()}
        </TextBlock>
        <IconButton
          onClick={() => {
            setTitle("ABC");
          }}
        >
          <IoAddSharp />
        </IconButton>
      </div>
      <ListItem selected={true} title="First" onClick={() => {}}></ListItem>
      <ListItem selected={false} title="Second" onClick={() => {}}></ListItem>
      <ListItem
        selected={false}
        disabled={true}
        title="Third"
        onClick={() => {}}
      ></ListItem>
    </div>
  );
};
