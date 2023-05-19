import { VoidComponent, mergeProps } from "solid-js";
import "./ProgressRing.scss";

export const ProgressRing: VoidComponent<{
  size?: number;
  disabled?: boolean;
  style?: string;
}> = (_props) => {
  const props = mergeProps({ size: 16 }, _props);
  return (
    <svg
      tabindex="-1"
      class="progress-ring indeterminate"
      style={props.style}
      width={props.size}
      height={props.size}
      viewBox="0 0 16 16"
    >
      <circle
        classList={{ disabled: props.disabled }}
        cx="50%"
        cy="50%"
        r="7"
        stroke-dasharray="3"
      />
    </svg>
  );
};
