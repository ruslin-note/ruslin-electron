import type { ParentComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import "./TextBlock.scss";

export const enum Variant {
  Body = 0,
  BodyStrong,
  BodyLarge,
  Caption,
  Subtitle,
  Title,
  TitleLarge,
  Display,
}

const TAGS = ["span", "h5", "h4", "span", "h4", "h3", "h1", "h1"];
const CLASS_NAMES = [
  "text-block type-body",
  "text-block type-body-strong",
  "text-block type-body-large",
  "text-block type-caption",
  "text-block type-subtitle",
  "text-block type-title",
  "text-block type-title-large",
  "text-block type-display",
];

export const TextBlock: ParentComponent<{
  variant: Variant;
  class?: string;
}> = (props) => {
  let cls = CLASS_NAMES[props.variant];
  if (props.class) {
    cls = cls.concat(` ${props.class}`);
  }
  return (
    <Dynamic component={TAGS[props.variant]} class={`${cls}`}>
      {props.children}
    </Dynamic>
  );
};
