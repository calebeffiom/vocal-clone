"use client"
import { Container } from "@shared"
import CommentCard from "./comment-card"
import CommentForm from "./comment-form"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

import axios from "axios"

interface BlogPageProps {
    slug: string
}

const BlogPage = ({ slug }: BlogPageProps) => {
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchBlog = useCallback(async () => {
        try {
            const res = await axios.get(`/api/blogs/${slug}`);
            if (res.data.formatBlog) {
                setBlog(res.data.formatBlog);
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetchBlog();
        }
    }, [slug, fetchBlog]);

    const handleLike = async () => {
        try {
            if (blog.hasLiked) {
                await axios.delete(`/api/blogs/${slug}/blog-actions`);
            } else {
                await axios.put(`/api/blogs/${slug}/blog-actions`);
            }
            await fetchBlog();
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleCommentSubmit = async (content: string) => {
        setIsSubmitting(true);
        try {
            // Placeholder for comment submission
            // const res = await axios.post(`/api/blogs/${slug}/comments`, { content });
            const res = await axios.post(`/api/blogs/${slug}/blog-actions`, { content, action: "comment" });
            // For now, let's just simulate adding it or re-fetching
            console.log("Submitting comment:", content);
            await fetchBlog(); // Re-fetch to see new comments if any
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <div className="py-20 text-center text-xl">Loading...</div>
            </Container>
        );
    }

    if (!blog) {
        return (
            <Container>
                <div className="py-20 text-center text-xl">Blog not found.</div>
            </Container>
        );
    }

    return (
        <section>
            <div className="flex flex-col gap-11 py-[100px]">
                <Container>
                    <div className="flex flex-col gap-3 w-fit mx-auto">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[50px] font-bold">{blog.title}</h1>
                            {blog.subtitle && (
                                <h2 className="text-[25px] font-medium text-[#8f8f8f]">{blog.subtitle}</h2>
                            )}
                        </div>

                        <div className="flex flex-row gap-2">
                            <div className="writer-image-cont">
                                <img src={blog.author.image || "/images/profile.png"} className="h-[50px] rounded-full" alt={blog.author.name} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <h4>{blog.author.name}</h4>
                                <p className="text-[#8f8f8f] text-[13px]">published {blog.createdAt} • 3 min read </p>
                            </div>
                        </div>
                    </div>
                </Container>

                <div className="w-[85%] h-[650px] mx-auto px-4 sm:px-6 lg:px-8">
                    <img src={blog.coverImage || "/images/ice.jpeg"} className="h-full w-full rounded-xl object-cover" alt="Blog Cover" />
                </div>


                <Container>
                    <div className="flex flex-col gap-8 w-[80%] mx-auto">
                        <div className="flex flex-col gap-8 mx-auto">
                            {blog.content.map((para: string, index: number) => (
                                <p key={index} className="text-xl font-normal leading-loose text-gray-800">
                                    {para}
                                </p>
                            ))}
                        </div>

                        <div className="w-full">
                            <div className="p-4 border-t-[2px] border-b-[2px] border-[#8f8f8f] flex justify-between  mx-auto">
                                <div className="flex gap-4">
                                    <span
                                        onClick={() => setShowComments(!showComments)}
                                        className={`flex p-2 rounded-xl gap-2 text-[#8f8f8f] hover:bg-[#8f8f8f]/10 cursor-pointer ${showComments ? 'bg-[#8f8f8f]/10' : ''}`}
                                    >
                                        <MessageCircle />
                                        {blog.comments?.length || 0}
                                    </span>
                                    <span
                                        className={`flex p-2 rounded-xl gap-2 hover:bg-[#8f8f8f]/10 cursor-pointer ${blog.hasLiked ? 'text-red-500' : 'text-[#8f8f8f]'}`}
                                        onClick={handleLike}
                                    >
                                        <Heart fill={blog.hasLiked ? "currentColor" : "none"} />
                                        {blog.likes || 0}
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="flex p-2 rounded-xl gap-2 text-[#8f8f8f] hover:bg-[#8f8f8f]/10 cursor-pointer">
                                        <Share2 />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {showComments && (
                            <div className="flex flex-col gap-10 mt-10">
                                <h3 className="text-2xl font-bold max-w-3xl mx-auto w-full mb-4">
                                    Responses ({blog.comments?.length || 0})
                                </h3>

                                <CommentForm
                                    onSubmit={handleCommentSubmit}
                                    isSubmitting={isSubmitting}
                                />

                                <div className="flex flex-col gap-10">
                                    {blog.comments && blog.comments.length > 0 ? (
                                        blog.comments.map((comment: any, index: number) => (
                                            <CommentCard key={index} comment={comment} />
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">No comments yet. Be the first to respond!</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        </section>
    )
}
export default BlogPage