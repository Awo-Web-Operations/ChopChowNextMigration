import { ArrowBack } from "@mui/icons-material";
import Header from "../../../src/components/Header/Header";
import Sidenav from "../../../src/components/Header/sidenav";
import Sidenav2 from "../../../src/components/Header/sidenav2";
import {
    container,
    col2,
    left,
    empty,
    center,
} from "../../../src/components/dashboard/dashboard.module.css";
import { Editor, editorConfig } from "../../../src/components/blog/editor";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function ManageBlog() {
    const ref = useRef();
    const router = useRouter()
    return (
        <div className={container + " " + col2}>
            <Header />
            <Sidenav />
            <div className={left}>
                <Sidenav2 showBottom={false} />
            </div>
            <div className={empty}></div>
            <div className="blog-container">
                <div className="blog-header">
                    <div
                        onClick={() => router.push('/dashboard/blog/create')}
                        className="flexer-box back-box" style={{
                            cursor: "pointer"
                        }}>
                        <ArrowBack />
                        <p className="back">Back</p>
                    </div>
                    <div className="flexer-box action">
                        <p onClick={() => ref.current?.handleSubmit('DRAFT')}>Save</p>
                        <button onClick={() => ref.current?.handleSubmit()}>Publish</button>
                    </div>
                </div>
                <div className="blog-content">
                    <LexicalComposer initialConfig={editorConfig}>
                        <Editor ref={ref} />
                    </LexicalComposer>
                </div>
            </div>
        </div>
    );
}
