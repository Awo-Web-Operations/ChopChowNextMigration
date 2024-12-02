import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { useCallback } from "react";


export const RedoPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const handleUndo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  return (
    <div
      className="flexer-box plugin-box"
      style={{
        cursor: "pointer",
        gap: "5px"
      }}
    >
      <svg
        width="24"
        onClick={handleUndo}
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 19V17H14.1C15.15 17 16.0627 16.6667 16.838 16C17.6133 15.3333 18.0007 14.5 18 13.5C18 12.5 17.6123 11.6667 16.837 11C16.0617 10.3333 15.1493 10 14.1 10H7.8L10.4 12.6L9 14L4 9L9 4L10.4 5.4L7.8 8H14.1C15.7167 8 17.1043 8.525 18.263 9.575C19.4217 10.625 20.0007 11.9333 20 13.5C20 15.0667 19.4207 16.375 18.262 17.425C17.1033 18.475 15.716 19 14.1 19H7Z"
          fill="black"
        />
      </svg>
      <svg
        onClick={handleRedo}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 19V17H9.9C8.85 17 7.93733 16.6667 7.162 16C6.38667 15.3333 5.99933 14.5 6 13.5C6 12.5 6.38767 11.6667 7.163 11C7.93833 10.3333 8.85067 10 9.9 10H16.2L13.6 12.6L15 14L20 9L15 4L13.6 5.4L16.2 8H9.9C8.28333 8 6.89567 8.525 5.737 9.575C4.57833 10.625 3.99933 11.9333 4 13.5C4 15.0667 4.57933 16.375 5.738 17.425C6.89667 18.475 8.284 19 9.9 19H17Z"
          fill="black"
        />
      </svg>
    </div>
  );
};
