import { type EditorView, keymap } from "@uiw/react-codemirror";

/** Tab keymap that inserts `indentSize` spaces instead of a tab char. */
export const createIndentWithTab = (indentSize: number) =>
  keymap.of([
    {
      key: "Tab",
      run: (view: EditorView) => {
        view.dispatch(view.state.replaceSelection(" ".repeat(indentSize)));
        return true;
      },
    },
  ]);
