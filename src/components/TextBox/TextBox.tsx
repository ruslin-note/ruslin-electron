import { JSX, ParentComponent, mergeProps } from "solid-js";
import "./TextBox.scss";

export type TextInputTypes =
  | "text"
  | "number"
  | "search"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "date"
  | "datetime-local"
  | "month"
  | "time"
  | "week";

export const TextBox: ParentComponent<{
  type?: TextInputTypes;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> | undefined;
  onInput?: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> | undefined;
}> = (props) => {
  const merged = mergeProps({ type: "text", value: "" }, props);
  return (
    <div class="text-box-container">
      <input class="text-box" {...merged}></input>
      <div class="text-box-underline" />
    </div>
  );
};
