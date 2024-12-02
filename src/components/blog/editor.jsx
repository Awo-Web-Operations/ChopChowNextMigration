import {
  ToolbarPlugin,
  ImagePlugin,
  ParagraphPlugin,
  FontSizePlugin,
  TextFormatPlugin,
  ListTypePlugin,
  AlignPlugin,
  TabPlugin,
  CreateLinkPlugin,
  RedoPlugin,
} from "./plugins";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { toast } from "react-toastify";
import { $createImageNode, ImageNode } from "./plugins/image-node";
import { BsPlus } from "react-icons/bs";
import axios from "../../util/Api";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useRouter } from "next/router";
import { $getRoot } from "lexical";

export const editorConfig = {
  namespace: "ChopChowEditor",
  onError: (error) => {
    console.error("Editor error:", error);
  },
  theme: {
    text: {
      underline: "underline",
      strikethrough: "line-through",
    },
    list: {
      nested: {
        listitem: "editor-nested-listitem",
      },
      ol: "editor-list-ol",
      ul: "editor-list-ul",
      listitem: "editor-listItem",
      listitemChecked: "editor-listItemChecked",
      listitemUnchecked: "editor-listItemUnchecked",
    },
    link: "link",
  },
  nodes: [ListItemNode, ListNode, LinkNode, ImageNode],
};

export const Editor = forwardRef((props, ref) => {
  const [editorState, setEditorState] = useState(null);
  const params = useRouter();
  const pageRef = useRef(true);

  const inputRef = useRef();
  const [editor] = useLexicalComposerContext();
  const [form, setForm] = useState({
    title: "",
    uri: "",
    feature_image: {},
  });

  const onChange = (state) => {
    setEditorState(state);
  };

  const handleCreateBlogPost = useCallback(
    async (status) => {
      try {
        editor.update(async () => {
          const htmlString = $generateHtmlFromNodes(editor, null);
          const formData = new FormData();
          const parser = new DOMParser();

          const n = parser.parseFromString(htmlString, "text/html");
          const plainText = n.body.textContent?.toString();
          formData.append("title", form.title);
          formData.append("featured_image", form.feature_image);
          formData.append("html_template", htmlString);
          formData.append("category", form.category);
          formData.append("body_content_text", plainText.toString());
          formData.append("word_count", plainText.toString().split(" ").length);
          if (status) {
            formData.append("status", status);
          }
          let url =
            params.query.action === "edit"
              ? `/blog/update/${params.query.id}`
              : "/blog/create";
          const response = await axios(url, {
            method: "post",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("The post is published successfully");
        });
      } catch (e) {
        toast.error("An Error occured");
        console.log(e);
      }
    },
    [form, editor, params]
  );
  const handleGetOneBlogPost = useCallback(async (id) => {
    try {
      const response = await axios.get(`/blog/getBlog/${id}`);
      const data = response.data.data.data;
      setForm({
        title: data.title,
        feature_image: data.featured_image,
        uri: data.featured_image,
      });
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(data.html_template, "text/html");
        let nodes = $generateNodesFromDOM(editor, dom);
        let cp = [...nodes];
        dom.body.childNodes.forEach((child, index) => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName.toLowerCase() === "img") {
              const src = child.getAttribute("src");
              const alt = child.getAttribute("alt") || "Image";
              const height =
                parseInt(child.style.height.replace("px", "")) || 300;
              const imageNode = $createImageNode(src, alt, height);
              cp = [...cp.slice(0, index - 1), imageNode, ...nodes.slice(index)];
            }
          }
        });
        const root = $getRoot();
        root.clear();
        root.append(...cp);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (
      params.query?.action === "edit" &&
      params.query?.id &&
      pageRef.current
    ) {
      handleGetOneBlogPost(params.query?.id);
      pageRef.current = false;
    }
  }, [params, pageRef]);

  useImperativeHandle(ref, () => {
    return {
      async handleSubmit(status) {
        await handleCreateBlogPost(status);
      },
    };
  });

  return (
    <>
      <div className="editor-container ">
        <div className="editor-toolbar">
          <ToolbarPlugin>
            <ImagePlugin />
            <ParagraphPlugin />
            <FontSizePlugin />
            <TextFormatPlugin />
            <ListTypePlugin />
            <AlignPlugin />
            <TabPlugin />
            <CreateLinkPlugin />
            <RedoPlugin />
          </ToolbarPlugin>
          <ListPlugin />
          <TabIndentationPlugin />
          <LinkPlugin />
          <HistoryPlugin />
        </div>
        <div></div>
        <OnChangePlugin onChange={onChange} />
      </div>
      <div className="editor-header-section">
        <div className="editor-post-title-sec">
          <div className="ed_1">
            <h2>Add Post Title</h2>
            <input
              onChange={(event) =>
                setForm({
                  ...form,
                  title: event.target.value,
                })
              }
              value={form.title}
              className="input-box"
            />
          </div>
          <div className="ed_2">
            <h2>
              Select a category <sup>*</sup>
            </h2>
            <select
              onChange={(event) => {
                setForm({
                  ...form,
                  category: event.target.value,
                });
              }}
            >
              <option selected disabled>
                Select an option
              </option>
              <option value="MEAL">Meal</option>
              <option value="INGREDIENTS">Ingredients</option>
              <option value="UTENSILS">Utensils</option>
              <option value="KITCHEN TIPS">Kitchen Tips</option>
            </select>
          </div>
        </div>
      </div>
      <div className="editor-image">
        <h2>Featured Image</h2>
        {!form.uri ? (
          <div onClick={() => inputRef.current?.click()} className="pick-image">
            <BsPlus />
            <p>Add Image</p>
          </div>
        ) : (
          <>
            <div className="selected_image">
              <img className="f_image" src={form.uri} />
            </div>
            <div className="selected_image_options">
              <button onClick={() => inputRef.current?.click()}>
                Change picture
              </button>
              <button
                onClick={() => {
                  setForm({
                    ...form,
                    uri: "",
                  });
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}

        <input
          onChange={(event) =>
            setForm({
              ...form,
              feature_image: event.target.files[0],
              uri: URL.createObjectURL(event.target.files[0]),
            })
          }
          ref={inputRef}
          style={{
            display: "none",
          }}
          type="file"
          accept=".png, .jpeg, .jpg"
        />
      </div>
      <div className="blog-editor-content">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-content" />}
          ErrorBoundary={() => null}
          placeholder={<div></div>}
        />
      </div>
    </>
  );
});
