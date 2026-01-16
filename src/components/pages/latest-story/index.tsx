"use client"
import { Container } from "@shared";
import ArticlePreview from "./article-preview";
import { useRecoilState } from "recoil";
import { blogsAtom } from "@/utils/states/blogsAtom";
import { useCallback, useEffect } from "react";
import axios from "axios";

const LatestStoriesSection = () => {
    const [blogs, setBlogs] = useRecoilState(blogsAtom);

    const fetchBlogs = useCallback(async () => {
        try {
            const res = await axios.get("/api/publish-blog");
            if (res.data.formatBlogs) {
                setBlogs(res.data.formatBlogs);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    }, [setBlogs]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return (
        <section>
            <Container>
                <div className="section-inner py-[100px]">
                    <div className="section-heading-cont mb-[50px]">
                        <h2 className="text-[50px] font-[600]">Latest Stories</h2>
                        <p className="text-[18px] font-[300]">Stay upto date with the lastest write ups, inspirng articles and many more.</p>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        {blogs && blogs.length > 0 ? (
                            blogs.map((blog: any) => (
                                <ArticlePreview
                                    key={blog.id}
                                    previewImage={blog.coverImage || "/images/ice.jpeg"}
                                    heading={blog.title}
                                    description={blog.content[0]}
                                    profileImage={blog.author.image || "/images/profile.png"}
                                    userName={blog.author.name}
                                    postTime={blog.createdAt}
                                    catergory={blog.tags[0] || "Horror"}
                                    slug={blog.slug}
                                />
                            ))
                        ) : (
                            <p>No stories found.</p>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    )
}
export default LatestStoriesSection