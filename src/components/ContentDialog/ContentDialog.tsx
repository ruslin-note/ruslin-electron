import {
  JSXElement,
  ParentComponent,
  Show,
  createEffect,
  mergeProps,
} from "solid-js";
import "./ContentDialog.scss";
import "../animation.css";
import { TextBlock, Variant } from "..";
import { Transition } from "solid-transition-group";
import { useKeyDownEvent } from "@solid-primitives/keyboard";

export const ContentDialog: ParentComponent<{
  darken?: boolean;
  title?: string;
  size?: "standard" | "max" | "min";
  footer?: JSXElement;
  onEscape?: () => void;
}> = (_props) => {
  const props = mergeProps({ darken: true, size: "standard" }, _props);

  const onEscape = props.onEscape;
  if (onEscape) {
    const event = useKeyDownEvent();
    createEffect(() => {
      const e = event();
      if (e && e.key === "Escape") {
          onEscape();
          e.preventDefault();
      }
    });
  }

  return (
    <Transition appear name="fade">
      <div
        class="content-dialog-smoke"
        classList={{ darken: props.darken }}
      >
        <Transition appear name="scale">
          <div
            class="content-dialog"
            classList={{
              [`size-${props.size}`]: true,
            }}
          >
            <div class="content-dialog-body">
              <Show when={props.title}>
                <TextBlock
                  variant={Variant.Subtitle}
                  class="content-dialog-title"
                >
                  {props.title}
                </TextBlock>
              </Show>
              {props.children}
            </div>
            <Show when={props.footer}>
              <footer class="content-dialog-footer">{props.footer}</footer>
            </Show>
          </div>
        </Transition>
      </div>
    </Transition>
  );
};
