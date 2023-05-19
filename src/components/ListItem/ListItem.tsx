import type { ParentComponent } from "solid-js";
import "./ListItem.scss";

export const ListItem: ParentComponent<{
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = (props) => {
  return (
    <a
      class="list-item"
      classList={{
        selected: props.selected,
        disabled: props.disabled,
      }}
      onClick={props.onClick}
    >
      {props.children}
    </a>
  );
};
