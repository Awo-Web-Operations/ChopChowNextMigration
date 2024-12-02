import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { $createImageNode } from "./image-node";

export const ImagePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState({
    url: "",
    altText: "",
    height: 0,
  });

  const insertImage = useCallback(() => {
    if (image.url.trim() === "") {
      return;
    }
    editor.update(() => {
      const root = $getRoot();
      const imageNode = $createImageNode(
        image.url,
        image.altText,
        image.height
      );
      root.append(imageNode);
      setIsOpen(false);
    });
    setImage({
      url: "",
      altText: "",
      height: 0,
    });
  }, [image]);

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
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setIsOpen(true)}
        className="flexer-box plugin-box"
        style={{
          cursor: "pointer",
        }}
      >
        <BsPlus />
        <p className="plugin-text">Add Image</p>
      </div>
      {isOpen && (
        <div ref={ref} className="drop-down-toolbar">
          <input
            onChange={(event) =>
              setImage({
                ...image,
                url: event.target.value,
              })
            }
            placeholder="Enter link"
          />
          <input
            onChange={(event) =>
              setImage({
                ...image,
                altText: event.target.value,
              })
            }
            placeholder="Enter alt text"
          />
          <input
            onChange={(event) =>
              setImage({
                ...image,
                height: Number(event.target.value),
              })
            }
            placeholder="Enter height"
            type="number"
          />
          <button onClick={insertImage}>Add</button>
        </div>
      )}
    </div>
  );
};
