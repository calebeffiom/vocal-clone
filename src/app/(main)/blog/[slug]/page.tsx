"use client"
import BlogPage from "@/components/pages/blog";
import { useParams } from "next/navigation";

const BlogDetailPage = () => {
    const params = useParams();
    const slug = params.slug as string;

    return <BlogPage slug={slug} />;
};

export default BlogDetailPage;
