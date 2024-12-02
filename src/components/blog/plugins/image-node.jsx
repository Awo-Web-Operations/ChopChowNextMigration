import {
  DecoratorNode,
} from "lexical";
import { Suspense } from "react";



export class ImageNode extends DecoratorNode {
  constructor(src, altText, height, key) {
    super(key);
    this.src = src;
    this.altText = altText;
    this.height = height;
  }

  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(node.src, node.altText, node.height, node.__key);
  }

  createDOM(config) {
    const img = document.createElement("img");
    img.src = this.src;
    img.alt = this.altText;
    img.style.width = "100%";
    img.style.height = `${this.height}px`;
    img.className = "chow-blog-image";
    return img;
  }

  updateDOM(prevNode, dom) {
    return false;
  }

  decorate() {
    return (
      <Suspense fallback={<span>Loading...</span>}>
        <img
          src={this.src}
          alt={this.altText}
          style={{
            width: "100%",
            height: `${this.height}px`,
          }}
          className="chow-blog-image"
        />
      </Suspense>
    );
  }

  static importJSON(serializedNode) {
    const { src, altText, height } = serializedNode;
    return new ImageNode(src, altText, height);
  }

  exportJSON() {
    return {
      type: "image",
      src: this.src,
      altText: this.altText,
      height: this.height,
      version: 1,
    };
  }
}

export function $createImageNode(
  src,
  altText = "",
  height
) {
  return new ImageNode(src, altText, height);
}

export function isImageNode(node) {
  return node instanceof ImageNode;
}
