import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const IndentPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const addUnorderedList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const addOrderedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="flexer-box plugin-box" style={{ gap: "20px" }}>
      <svg
        width="24"
        height="24"
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
};
