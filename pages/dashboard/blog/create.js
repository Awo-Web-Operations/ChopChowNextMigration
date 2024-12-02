import { ArrowBack, Search, SearchSharp } from "@mui/icons-material";
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
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../../src/util/Api";
import { toast } from 'react-toastify'

export default function ManageBlog() {
    const router = useRouter();
    const [blogPost, setBlogPost] = useState([]);
    const ref = useRef();
    const [isOpen, setisOpen] = useState(false)
    const [selected, setSelected] = useState("")
    const [title, setTitle] = useState("")
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1
    })

    const handlegetAllBlogPost = useCallback(async (page = 1, title = '') => {
        try {
            const params = {
                page,
                limit: 10,
            }
            if (title) {
                params.title = title
            }
            const allPosts = await axios.get("/blog/get-all-blogs", {
                params
            });
            setBlogPost(allPosts.data.data.data);
            setPagination({
                total: Math.ceil(allPosts.data.data.total / 10),
                page
            })
        } catch (e) {
            console.log(e);
        }
    }, []);

    const handleDeleteBlogPost = useCallback(async (id) => {
        try {
            await axios.delete(`/blog/deleteblog/${id}`)
            handlegetAllBlogPost()
            toast.success("Blog Post deleted successfully")
        } catch (e) {
            console.log(e)
        }
    }, [])

    const handleUpdateStatus = useCallback(async (id, payload) => {
        try {
            const response = await axios(`/blog/update/${id}`, {
                method: "post",
                data: payload,
            });
            handlegetAllBlogPost()
            setisOpen(false)
            toast.success("The post updated successfully");
        } catch (e) {
            console.log(e)
        }
    }, [])


    useEffect(() => {
        handlegetAllBlogPost();
    }, []);

    useEffect(() => {
        document.addEventListener(
            "click",
            function (e) {
                if (!ref.current?.contains(e.target)) {
                    setisOpen(false);
                }
            },
            true
        );
    }, [ref]);

    return (
        <div className={container + " " + col2}>
            <Header />
            <Sidenav />
            <div className={left}>
                <Sidenav2 showBottom={false} />
            </div>
            <div className={empty}></div>
            <div className="blog-list-container">
                <div className="blog-list-header">
                    <h1>Blog Posts</h1>
                    <div className="blog-search-bar">
                        <div className="search">
                            <Search />
                        </div>
                        <input
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Search for Post" />
                        <button onClick={() => handlegetAllBlogPost(1, title)}>
                            <p>SEARCH</p>
                            <SearchSharp />
                        </button>
                    </div>
                    <button
                        onClick={() => router.push("/dashboard/blog/manage")}
                        className="blog-add"
                    >
                        <BsPlus />
                        <p>Add New blog post</p>
                    </button>
                </div>
                <div className="blog-list-data">
                    <h2>Overview</h2>
                    <div className="blog-list-data-stats">
                        <div className="box-data">
                            <div className="box-data-header">
                                <h3>Total number of posts</h3>
                                <select>
                                    <option>Monthly</option>
                                    <option>Daily</option>
                                </select>
                            </div>
                            <h1>{Array.isArray(blogPost) ? blogPost.length : 0}</h1>
                        </div>
                        <div className="box-data">
                            <div className="box-data-header">
                                <h3>Published Posts</h3>
                                <select>
                                    <option>Monthly</option>
                                    <option>Daily</option>
                                </select>
                            </div>
                            <h1>
                                {Array.isArray(blogPost)
                                    ? blogPost.filter((ele) => ele.status === "PUBLIC").length
                                    : 0}
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="blog-list-table">
                    <table>
                        <thead>
                            <tr>
                                <td>Article name</td>
                                <td>Date</td>
                                <td>
                                    <div className="blog-list-flexer">
                                        <p>Status</p>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5.33464 10.6654H2.66797L6.66797 14.6654V1.33203H5.33464V10.6654ZM9.33464 3.33203V14.6654H10.668V5.33203H13.3346L9.33464 1.33203V3.33203Z"
                                                fill="#25282B"
                                            />
                                        </svg>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(blogPost)
                                ? [...blogPost].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((data, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div className="blog-list-flexer">
                                                <img
                                                    src={data?.featured_image}
                                                    height={"34px"}
                                                    width={"44px"}
                                                />
                                                <p>{data.title}</p>
                                            </div>
                                            <div className="_status__">
                                                <p>{new Date(data.createdAt).toLocaleString()}</p>
                                                <p>{data.status}</p>
                                            </div>
                                        </td>
                                        <td>{new Date(data.createdAt).toLocaleString()}</td>
                                        <td>{data.status}</td>
                                        <td>
                                            <div className="blog-list-flexer" >
                                                <svg
                                                    onClick={() => router.push(`/dashboard/blog/manage?action=edit&id=${data._id}`)}
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M0 15.3666C0.4448 13.8402 0.888 12.3138 1.3328 10.7874C1.368 10.6658 1.4048 10.5442 1.4368 10.4226C1.488 10.2386 1.584 10.0898 1.7312 9.96664C1.8688 9.85304 1.9904 9.71704 2.1168 9.59064C4.2016 7.52505 6.2864 5.45945 8.3696 3.39226C8.4176 3.34426 8.4592 3.28986 8.4928 3.24826C8.776 3.53306 9.0416 3.80026 9.3376 4.09786C9.3056 4.12026 9.2432 4.15226 9.1952 4.20026C7.0352 6.35545 4.8768 8.51065 2.7216 10.6706C2.6448 10.749 2.5808 10.8562 2.5504 10.9618C2.2912 11.8178 2.0448 12.6786 1.7888 13.5378C1.7568 13.645 1.7728 13.7122 1.8544 13.7858C1.9872 13.9058 2.104 14.0434 2.2384 14.1618C2.2848 14.2018 2.3728 14.2322 2.4288 14.2178C3.2896 13.9714 4.1488 13.7202 5.0064 13.461C5.08 13.4386 5.1488 13.3762 5.2064 13.317C7.3968 11.133 9.584 8.94584 11.7712 6.76025C11.8128 6.71865 11.848 6.67225 11.872 6.64505C12.1824 6.95545 12.4832 7.25625 12.8128 7.58585C12.7984 7.59545 12.7408 7.61945 12.7008 7.65945C10.544 9.79544 8.384 11.9266 6.2384 14.0738C5.9392 14.3746 5.6144 14.5602 5.2128 14.6738C3.7888 15.077 2.3712 15.5026 0.9504 15.9202C0.856 15.9474 0.76 15.973 0.6656 16.0002H0.5376C0.4688 15.9698 0.3984 15.9426 0.3296 15.9106C0.1376 15.821 0.072 15.6386 0 15.461V15.3666ZM4.3024 12.7154C4.2608 12.4498 4.216 12.2066 4.1872 11.9634C4.1728 11.8482 4.1264 11.8018 4.0144 11.781C3.7408 11.7282 3.4704 11.6594 3.2176 11.6034C5.4864 9.32984 7.7552 7.05465 10.0096 4.79386C10.3696 5.15385 10.7456 5.52825 11.1088 5.88985C8.8624 8.14265 6.5952 10.4162 4.3024 12.7154ZM10.8368 1.02586C11.0416 0.825865 11.2464 0.613065 11.4656 0.414666C12.0944 -0.151733 12.9136 -0.138933 13.5264 0.459466C14.2032 1.11866 14.8704 1.78586 15.5296 2.46266C16.1536 3.10106 16.144 3.95546 15.5216 4.59226C15.3344 4.78426 15.1408 4.97145 14.9616 5.14745C13.592 3.77946 12.224 2.41306 10.8368 1.02586ZM9.168 2.53626C9.4784 2.24506 9.7968 1.94586 10.0992 1.66106C11.5328 3.09466 12.9584 4.52186 14.3968 5.96025C14.0976 6.24025 13.776 6.54265 13.4656 6.83385L9.168 2.53626Z"
                                                        fill="#A0A4A8"
                                                    />
                                                </svg>
                                                <svg
                                                    width="16"
                                                    onClick={() => handleDeleteBlogPost(data._id)}
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M4.00916 14.3248C4.02516 14.7024 4.33556 15 4.71316 15H11.2908C11.6684 15 11.9804 14.7024 11.9948 14.3248L12.4652 4.408H3.53876L4.00916 14.3248ZM9.48916 6.872C9.48916 6.7136 9.61716 6.5856 9.77556 6.5856H10.2332C10.3916 6.5856 10.5196 6.7152 10.5196 6.872V12.5376C10.5196 12.696 10.39 12.824 10.2332 12.824H9.77556C9.61716 12.824 9.48916 12.696 9.48916 12.5376V6.872ZM7.48756 6.872C7.48756 6.7136 7.61556 6.5856 7.77396 6.5856H8.23156C8.38996 6.5856 8.51796 6.7152 8.51796 6.872V12.5376C8.51796 12.696 8.38996 12.824 8.23156 12.824H7.77396C7.61556 12.824 7.48756 12.696 7.48756 12.5376V6.872ZM5.48436 6.872C5.48436 6.7136 5.61236 6.5856 5.76916 6.5856H6.22676C6.38516 6.5856 6.51316 6.7152 6.51316 6.872V12.5376C6.51316 12.696 6.38356 12.824 6.22676 12.824H5.76916C5.61076 12.824 5.48436 12.696 5.48436 12.5376V6.872ZM12.7772 1.7216H9.74356V1.1472C9.74356 1.0656 9.67796 1 9.59636 1H6.40916C6.32756 1 6.26196 1.0656 6.26196 1.1472V1.7216H3.22676C2.98356 1.7216 2.78516 1.9184 2.78516 2.1632V3.552H13.2188V2.1632C13.2188 1.92 13.022 1.7216 12.7772 1.7216V1.7216Z"
                                                        fill="#FF6760"
                                                    />
                                                </svg>
                                                <div style={{
                                                    position: "relative",
                                                }}>
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        onClick={() => {
                                                            setisOpen(true)
                                                            setSelected(data._id)
                                                        }}
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M9 2.25C8.175 2.25 7.5 2.925 7.5 3.75C7.5 4.575 8.175 5.25 9 5.25C9.825 5.25 10.5 4.575 10.5 3.75C10.5 2.925 9.825 2.25 9 2.25ZM9 12.75C8.175 12.75 7.5 13.425 7.5 14.25C7.5 15.075 8.175 15.75 9 15.75C9.825 15.75 10.5 15.075 10.5 14.25C10.5 13.425 9.825 12.75 9 12.75ZM9 7.5C8.175 7.5 7.5 8.175 7.5 9C7.5 9.825 8.175 10.5 9 10.5C9.825 10.5 10.5 9.825 10.5 9C10.5 8.175 9.825 7.5 9 7.5Z"
                                                            fill="black"
                                                        />
                                                    </svg>
                                                    {
                                                        isOpen && selected === data._id && <div ref={ref} className="blog-table-actions">
                                                            <p
                                                                onClick={() => handleUpdateStatus(data._id, {
                                                                    status: data.status === 'PUBLIC' ? "DRAFT" : "PUBLIC",
                                                                    title: data.title,
                                                                    html_template: data.html_template,
                                                                    body_content_text: data.body_content_text,
                                                                    word_count: data.word_count,
                                                                    featured_image: data.featured_image,
                                                                    category: data.category
                                                                })}
                                                            >{data.status === 'PUBLIC' ? "Unpublish" : "Publish"}</p>
                                                            <p onClick={() => router.push(`/dashboard/blog/manage?action=edit&id=${data._id}`)}
                                                            >Edit Post</p><br />
                                                            <p onClick={() => handleDeleteBlogPost(data._id)}
                                                            >Delete Post</p>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                : []}
                        </tbody>
                    </table>
                    <div className="blog-list-table-footer">
                        <button
                            onClick={() => handlegetAllBlogPost(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className={`${pagination.page <= 1 && "disabled"}`}
                        ><RxCaretLeft /></button>
                        {
                            Array(pagination.total || 0).fill('_').map((ele, idx) => (
                                <button style={{
                                    backgroundColor: idx + 1 === pagination.page ? "rgba(47, 170, 0, 1)" : "#fff",
                                    color: idx + 1 === pagination.page ? "#fff" : "#000",
                                }}
                                    onClick={() => handlegetAllBlogPost(idx + 1)}
                                    key={idx + ele}>{idx + 1}</button>
                            ))
                        }
                        <button
                            onClick={() => handlegetAllBlogPost(pagination.page + 1)}
                            className={`${pagination.page >= pagination.total && "disabled"}`}
                            disabled={pagination.page >= pagination.total}
                        ><RxCaretRight /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
