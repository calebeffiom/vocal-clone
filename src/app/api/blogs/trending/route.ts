import { NextResponse } from "next/server";
import { formatRelativeTime, getTrendingBlogs } from "@/utils/helpers";

export async function GET() {
    try {
        const blogs = await getTrendingBlogs();
        const formatBlogs = blogs.map((blog: any) => ({
            id: blog._id.toString(),
            title: blog.title,
            subtitle: blog.subtitle,
            content: blog.content,
            coverImage: blog.coverImage,
            slug: blog.slug,
            tags: blog.tags,
            published: blog.published,
            likes: blog.likes,
            comments: blog.comments,
            author: {
                id: blog.author._id.toString(),
                name: blog.author.name,
                username: blog.author.username,
                image: blog.author.image,
                bio: blog.author.bio
            },
            createdAt: formatRelativeTime(blog.createdAt.toISOString()),
            updatedAt: blog.updatedAt.toISOString(),
        }))

        return NextResponse.json({ formatBlogs }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/blogs/trending:", error);
        return NextResponse.json(
            { error: "Failed to fetch trending blogs" },
            { status: 500 }
        );
    }
}
