import { ParentComponent, mergeProps } from "solid-js";
import "./Button.scss";

export const Button: ParentComponent<{
  variant?: "standard" | "accent" | "hyperlink";
  disabled?: boolean;
  onClick?: () => void;
}> = (props) => {
  const merged = mergeProps({ variant: "standard" }, props);
  return (
    <button
      class="button"
      classList={{
        disabled: props.disabled,
        [`style-${merged.variant}`]: true,
      }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
