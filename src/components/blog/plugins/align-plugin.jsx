import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND, KEY_TAB_COMMAND } from "lexical";
import { useEffect, useRef, useState } from "react";
import { RxCaretDown } from "react-icons/rx";

export const AlignPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const toggleAligntment = (align) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
  };

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
      style={{ position: "relative", cursor: "pointer" }}
    >
      <svg
        width="21"
        onClick={() => setIsOpen(prev => !prev)}
        height="19"
        viewBox="0 0 21 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line y1="1.25" x2="21" y2="1.25" stroke="#161616" stroke-width="1.5" />
        <line y1="7.25" x2="15" y2="7.25" stroke="#161616" stroke-width="1.5" />
        <line
          y1="18.25"
          x2="11"
          y2="18.25"
          stroke="#161616"
          stroke-width="1.5"
        />
        <line
          y1="12.25"
          x2="21"
          y2="12.25"
          stroke="#161616"
          stroke-width="1.5"
        />
      </svg>
      <RxCaretDown />
      {isOpen && (
        <div ref={ref} className="drop-down-toolbar">
          {["left", "center", "right"].map((ele) => (
            <p onClick={() => toggleAligntment(ele)} key={ele}>
              {ele}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
