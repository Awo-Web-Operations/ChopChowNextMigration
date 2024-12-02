import { useParams, useRouter } from "next/navigation";
import Header, { Header2 } from "../../src/components/Header/Header";
import { ShareOutlined } from "@mui/icons-material";
import { FBIcon, InstaIcon, ReditIcon, TwitterIcon, WhappIcon } from "../../src/components/icons";
import Footer from "../../src/components/Footer/Footer";
import { useEffect, useState } from "react";
import axios from "../../src/util/Api";
import { FacebookShareButton, InstapaperShareButton, RedditShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";


export default function SingleBlog() {
    const router = useRouter();
    const params = useParams();
    const [post, setPosts] = useState({
        single: {},
        data: []
    })

    useEffect(() => {
        if (params?.id) {
            (async () => {
                try {
                    const response = await axios.get(`/blog/getBlog/${params.id}`)
                    const doc = document.querySelector('.blog-post-html')
                    if (doc) {
                        doc.innerHTML = response.data.data.data?.html_template
                    }
                    setPosts({
                        single: response.data.data.data,
                        data: response.data.data.recent_post
                    })
                } catch (e) {
                    console.log(e)
                }
            })()
        }
    }, [params])

    return (
        <div>
            <Header />
            <Header2 />
            <div className="single-blog-user">
                <div className="single-container">
                    <div className="single-blog-view">
                        <div className="single-blog-content">
                            <h1>{post?.single?.title}</h1>
                            <div className="post-actions">
                                <p>By {post?.single?.author?.first_name} {post?.single?.author?.last_name}    |    Updated on {new Date(post?.single?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                <div className="">
                                    <div className="post-actions" style={{
                                        justifyContent: "flex-start",
                                        gap: "10px"
                                    }}><ShareOutlined />
                                        <p>Share this post</p>
                                    </div>
                                    <div className="post-icons">
                                        {
                                            [
                                                {
                                                    icon: <FacebookShareButton
                                                        title={post?.single?.title}
                                                        url={window.location}>
                                                        <FBIcon />
                                                    </FacebookShareButton>,
                                                },
                                                {
                                                    icon: <TwitterShareButton
                                                        title={post?.single?.title}
                                                        url={window.location}>
                                                        <TwitterIcon />
                                                    </TwitterShareButton>,
                                                },
                                                {
                                                    icon:
                                                        <InstaIcon />,
                                                },
                                                {
                                                    icon: <WhatsappShareButton
                                                        title={post?.single?.title}
                                                        url={window.location}>
                                                        <WhappIcon />
                                                    </WhatsappShareButton>,
                                                },
                                                {
                                                    icon: <RedditShareButton 
                                                    title={post?.single?.title}
                                                    url={window.location}>
                                                        <ReditIcon />
                                                    </RedditShareButton>,
                                                },
                                            ].map((ele, idx) => (
                                                <div key={idx}>{ele.icon}</div>
                                            ))
                                        }
                                    </div>

                                </div>
                            </div>
                            <img className="post-image" src={post?.single?.featured_image} alt="post-image" />
                            <div className="blog-post-html">
                            </div>
                        </div>
                        {
                            Array.isArray(post?.data) && post?.data?.length ? <div className="single-blog-recent">
                                <h3>Related Posts</h3>
                                {
                                    post.data.map((entry, idx) => (
                                        <div
                                            onClick={() => router.push(`/blog/${entry._id}`)}
                                            className="recent-blog-2 single">
                                            <img src={entry?.featured_image} />
                                            <div className="user-feature-footer-3">
                                                <p id="blog-post-title-2">{entry?.title}</p>
                                                <p id="blog-id">By {entry?.author?.first_name} {entry?.author?.last_name}</p>
                                                <div className="feature-footer">
                                                    <p id="blog-id" >Updated on {new Date(entry?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                    <p id="blog-id" >Kitchen Tips</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div> : null
                        }

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}