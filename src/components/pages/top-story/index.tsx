"use client"
import { Container } from "@shared"
import TopArticlePreview from "./top-article-preview"
import { useRecoilState } from "recoil"
import { trendingBlogsAtom } from "@/utils/states/blogsAtom"
import { useState, useCallback, useEffect } from "react"
import axios from "axios"
import ArticleSkeleton from "../latest-story/article-skeleton"

const TopStoriesSection = () => {
    const [trendingBlogs, setTrendingBlogs] = useRecoilState(trendingBlogsAtom);
    const [loading, setLoading] = useState(trendingBlogs.length === 0);

    const fetchTrendingBlogs = useCallback(async () => {
        if (trendingBlogs.length === 0) setLoading(true);
        try {
            const res = await axios.get("/api/blogs/trending");
            if (res.data.formatBlogs) {
                setTrendingBlogs(res.data.formatBlogs);
            }
        } catch (error) {
            console.error("Error fetching trending blogs:", error);
        } finally {
            setLoading(false);
        }
    }, [setTrendingBlogs, trendingBlogs.length]);

    useEffect(() => {
        fetchTrendingBlogs();
    }, [fetchTrendingBlogs]);

    return (
        <section>
            <Container>
                <div className="section-inner py-[100px]">
                    <div className="section-heading-cont mb-[50px]">
                        <h2 className="text-[50px] font-[600]">Top Stories</h2>
                        <p className="text-[18px] font-[300]">Get some inspiration from the best of the best. Learn and grow with the best articles selected based on popularity.</p>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        {loading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <ArticleSkeleton key={i} />
                            ))
                        ) : trendingBlogs && trendingBlogs.length > 0 ? (
                            trendingBlogs.slice(0, 10).map((blog: any) => (
                                <TopArticlePreview
                                    key={blog.id}
                                    id={blog.id}
                                    previewImage={blog.coverImage || "/images/ice.jpeg"}
                                    heading={blog.title}
                                    description={blog.content[0]}
                                    profileImage={blog.author.image || "/images/profile.png"}
                                    userName={blog.author.name}
                                    postTime={blog.createdAt}
                                    catergory={blog.tags[0] || "General"}
                                    slug={blog.slug}
                                />
                            ))
                        ) : (
                            <p>No trending stories found.</p>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    )
}
export default TopStoriesSection