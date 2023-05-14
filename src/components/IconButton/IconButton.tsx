import type { ParentComponent } from "solid-js";
import "./IconButton.scss";

export const IconButton: ParentComponent<{
  disabled?: boolean;
  onClick?: () => void;
}> = (props) => {
  return (
    <button
      class="icon-button"
      classList={{ disabled: props.disabled }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
