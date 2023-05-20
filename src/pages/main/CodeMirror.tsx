import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";

export interface CreateCodeMirrorProps {
  value: string;
  onValueChange: (value: string) => void;
  onBlur: (latestValue: string | null) => void;
}

export function createCodeMirror(props: CreateCodeMirrorProps) {
  const [ref, setRef] = createSignal<HTMLElement>();
  const [editorView, setEditorView] = createSignal<EditorView>();

  let delayTimer: NodeJS.Timeout | undefined;
  let changed: boolean = false;

  onCleanup(() => {
    clearTimeout(delayTimer);
  });

  createEffect(
    on(ref, (ref) => {
      const onBlurListener = EditorView.updateListener.of((update) => {
        if (update.focusChanged && !update.view.hasFocus) {
          props.onBlur(changed ? update.view.state.doc.toString() : null);
          changed = false;
          clearTimeout(delayTimer);
        }
      });

      const state = EditorState.create({
        doc: props?.value ?? "",
        extensions: [onBlurListener],
      });
      const currentView = new EditorView({
        state,
        parent: ref,
        // Replace the old `updateListenerExtension`
        dispatch: (transaction) => {
          currentView.update([transaction]);
          if (!transaction.isUserEvent(NOTE_SWITCH) && transaction.docChanged) {
            changed = true;
            clearTimeout(delayTimer);
            delayTimer = setTimeout(() => {
              const document = transaction.state.doc;
              const value = document.toString();
              props.onValueChange(value);
              changed = false;
            }, DEBOUNCE_TIMEOUT);
          }
        },
      });

      onMount(() => setEditorView(currentView));

      onCleanup(() => {
        editorView()?.destroy();
        setEditorView(undefined);
      });
    })
  );

  createEffect(
    on(
      editorView,
      (editorView) => {
        const localValue = editorView?.state.doc.toString();
        if (localValue !== props?.value && !!editorView) {
          editorView.dispatch({
            changes: {
              from: 0,
              to: localValue?.length,
              insert: props?.value ?? "",
            },
          });
        }
      },
      { defer: true }
    )
  );

  return {
    editorView,
    ref: setRef,
    //   createExtension: localCreateCompartmentExtension,
  } as const;
}

export function createEditorControlledValue(
  view: Accessor<EditorView | undefined>,
  code: Accessor<string | undefined>
): void {
  const memoizedCode = createMemo(code);

  createEffect(
    on(view, (view) => {
      if (view) {
        createEffect(
          on(memoizedCode, (code) => {
            const localValue = view?.state.doc.toString();
            if (localValue !== code) {
              view.dispatch({
                changes: {
                  from: 0,
                  to: localValue?.length,
                  insert: code ?? "",
                },
                userEvent: NOTE_SWITCH,
              });
            }
          })
        );
      }
    })
  );
}

const NOTE_SWITCH = "note.switch";
const DEBOUNCE_TIMEOUT = 3000;
