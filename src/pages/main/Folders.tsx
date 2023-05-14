import { ListItem } from "@/components";
import './Folders.scss';

export const Folders = () => {
    return (
      <div class="folders-container">
        <ListItem selected={true} title='First' onClick={() => {}}></ListItem>
        <ListItem selected={false} title='Second' onClick={() => {}}></ListItem>
        <ListItem selected={false} disabled={true} title='Third' onClick={() => {}}></ListItem>
      </div>
    );
};
