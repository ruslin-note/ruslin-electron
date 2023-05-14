import { Editor } from "./Editor";
import { Notes } from "./Notes";
import { Folders } from "./Folders";
import "./index.scss";

export const Main = () => {
  return (
    <div class="main-container">
      <Folders></Folders>
      <Notes></Notes>
      <Editor></Editor>
    </div>
  );
};
