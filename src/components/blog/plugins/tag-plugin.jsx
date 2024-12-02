import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { createCommand } from "lexical";
import { useEffect } from "react";

export const INSERT_TAB_COMMAND = createCommand();
export const REMOVE_TAB_COMMAND = createCommand();

export function TabPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeListener = editor.registerCommand(
      INSERT_TAB_COMMAND,
      () => {
        const selection = $getSelection();
        console.dir(selection, { depth: null });
        if ($isRangeSelection(selection)) {
          selection.insertText("    " + selection.getTextContent());
        }
        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeListener();
    };
  }, [editor]);

  useEffect(() => {
    const removeListener = editor.registerCommand(
      REMOVE_TAB_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorOffset = selection.anchor.offset;
          const focusOffset = selection.focus.offset;
          const textNode = selection.getTextContent();

          const tabPosition = textNode.lastIndexOf("    ", focusOffset);
          if (tabPosition !== -1 && tabPosition >= anchorOffset) {
            selection.deleteText(tabPosition, tabPosition + 4);
          }
        }
        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeListener();
    };
  }, [editor]);

  return (
    <div className="flexer-box plugin-box" style={{ gap: "20px" }}>
      <svg
        width="24"
        height="24"
        onClick={() => {
          editor.dispatchCommand(INSERT_TAB_COMMAND);
        }}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 4.5H21"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M9.5 9.5H21"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M9.5 14.5H21"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M5.5 9.5L3 12L5.5 14.5"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M3 19.5H21"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
      </svg>

      <svg
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
        onClick={() => {
          editor.dispatchCommand(REMOVE_TAB_COMMAND);
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 1.5H1"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M12.5 6.5H1"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M12.5 11.5H1"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M16.5 6.5L19 9L16.5 11.5"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
        <path
          d="M19 16.5H1"
          stroke="#161616"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}
