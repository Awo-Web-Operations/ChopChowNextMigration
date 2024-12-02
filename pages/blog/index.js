import { Search } from "@mui/icons-material";
import Header, { Header2 } from "../../src/components/Header/Header";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import Footer from "../../src/components/Footer/Footer";
import { useCallback, useEffect, useState } from "react";
import axios from "../../src/util/Api";
import { useRouter } from "next/router";



export default function Blog() {
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1
    })
    const router = useRouter()
    const [blogPost, setBlogPost] = useState([]);
    const [mostRecentPost, setMostRecentPost] = useState([])
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
                params: { ...params, status: "PUBLIC" }
            });
            const response = allPosts.data.data.data || [];
            if (page === 1) {
                if (response?.length >= 5) {
                    // setBlogPost([...response]);
                } else {
                    setMostRecentPost([...response].slice(0, 5))
                }
                setBlogPost([...response]);
                setPagination({
                    total: Math.ceil(allPosts.data.data.total / 10),
                    page
                })
            } else {
                setPagination({
                    total: Math.ceil(allPosts.data.data.total / 10),
                    page
                })
            }

        } catch (e) {
            console.log(e);
        }
    }, []);


    useEffect(() => {
        handlegetAllBlogPost()
    }, [])

    return (
        <>
            <div>
                <Header />
                <Header2 />
                <div className="user-blog-page-container">
                    <div className="blog-container">
                        {/* Blog Header */}
                        <div className="user-blog-search">
                            <div className="blog-search-bar">
                                <div className="search">
                                    <Search />
                                </div>
                                <input
                                    placeholder="Search for Post" />
                                <button >SEARCH</button>
                            </div>
                            <div className="search-bar-footer">
                                <p>Meal</p>
                                <p>Ingredients</p>
                                <p>Utensils</p>
                                <p>Kitchen Tips</p>
                            </div>
                        </div>

                        {/* Blog section */}
                        <section className="user-blog-section-1">
                            <h1>Blog</h1>
                            <p>Stay up-to-date on recent posts about recipes, kitchen tips and lots more.</p>
                            <div className="user-blog-box">
                                {
                                    Array.isArray(mostRecentPost) && mostRecentPost.length && Boolean(Object.keys(mostRecentPost[0] || {}).length) ? <div
                                        onClick={() => router.push(`/blog/${mostRecentPost[0]._id}`)}
                                        className="user-blog-featured">
                                        <h3>Featured posts</h3>
                                        <div className="user-feature-box">
                                            <img src={mostRecentPost[0]?.featured_image} />
                                            <div className="user-feature-footer">
                                                <p id="blog-post-title">{mostRecentPost[0]?.title}</p>
                                                <p id="blog-id">By {mostRecentPost[0]?.author?.first_name} {mostRecentPost[0]?.author?.last_name}</p>
                                                <div className="feature-footer">
                                                    <p id="blog-id" >Updated on {new Date(mostRecentPost[0]?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                    <p id="blog-id" >{mostRecentPost[0]?.category}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div> : null
                                }
                                {
                                    Array.isArray(mostRecentPost) && mostRecentPost.length > 1 && <div className="user-blog-recent">
                                        <h3>Recent posts</h3>
                                        {
                                            [...mostRecentPost].slice(1).map((ele) => (
                                                <div
                                                    onClick={() => router.push(`/blog/${ele._id}`)}
                                                    key={ele._id} className="recent-blog">
                                                    <img src={ele?.featured_image} />
                                                    <div className="user-feature-footer-3">
                                                        <p id="blog-post-title-2">{ele?.title}</p>
                                                        <p id="blog-id">By {ele?.author?.first_name} {ele?.author?.last_name}</p>
                                                        <div className="feature-footer">
                                                            <p id="blog-id" >Updated on {new Date(ele?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                            <p style={{
                                                                textTransform: "capitalize"
                                                            }} id="blog-id" >{ele?.category}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                            </div>
                        </section>

                        {/* All Blog Posts */}
                        <section className="user-all-blog-posts">
                            {
                                Array.isArray(blogPost) ?
                                    blogPost.map((ele) => (
                                        <div
                                            onClick={() => router.push(`/blog/${ele._id}`)}
                                            key={ele?._id} className="recent-blog-2">
                                            <img src={ele?.featured_image} />
                                            <div className="user-feature-footer-3">
                                                <p id="blog-post-title-2">{ele?.title}</p>
                                                <p id="blog-id">By {ele?.author?.first_name} {ele?.author?.last_name}</p>
                                                <div className="feature-footer">
                                                    <p id="blog-id" >Updated on {new Date(ele?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                    <p id="blog-id" >{ele?.category}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : []
                            }
                        </section>
                        <div className="user-blog-footer-col">
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
                        <div className="blog-footer_">
                        
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
           
        </>
    )
}