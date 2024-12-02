import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $isRangeSelection,
  $getSelection,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  $isTextNode,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { RxCaretDown } from "react-icons/rx";

export const FONT_SIZE_COMMAND = createCommand();

export const FontSizePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const changeFontSize = useCallback(
    (fontSize) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.getNodes().forEach((node) => {
            if ($isTextNode(node)) {
              node.setStyle(`font-size: ${fontSize}`);
            }
          });
        }
      });
    },
    [editor]
  );

  useEffect(() => {
    return editor.registerCommand(
      FONT_SIZE_COMMAND,
      (fontSize) => {
        changeFontSize(fontSize);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [changeFontSize, editor]);

  useEffect(() => {
    document.addEventListener(
      "click",
      function (e) {
        if (!ref.current?.contains(e.target)) {
          setIsOpen(false);
        }
      },
      true
    );
  }, [ref]);

  return (
    <div
      className="flexer-box plugin-box"
      style={{
        position: "relative",
      }}
    >
      <p
        className="plugin-text"
        style={{
          cursor: "pointer",
        }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        18
      </p>
      <RxCaretDown />
      {isOpen && (
        <div ref={ref} className="drop-down-toolbar">
          {[12, 14, 16, 18, 24].map((element) => (
            <p
              onClick={() => {
                editor.dispatchCommand(FONT_SIZE_COMMAND, `${element}px`);
                setIsOpen(false);
              }}
            >
              {element}px
            </p>
          ))}
          <input
            type="number"
            onChange={(event) =>
              editor.dispatchCommand(
                FONT_SIZE_COMMAND,
                `${event.target.value}px`
              )
            }
            className=""
            placeholder="e.g 30px"
          />
        </div>
      )}
    </div>
  );
};
