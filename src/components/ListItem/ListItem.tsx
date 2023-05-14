import type { Component } from "solid-js";
import "./ListItem.scss";

export const ListItem: Component<{
  selected: boolean;
  disabled?: boolean;
  title: string;
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
      {props.title}
    </a>
  );
};
