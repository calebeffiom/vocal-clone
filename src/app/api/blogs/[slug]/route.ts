import { NextResponse, NextRequest } from "next/server";
import { formatRelativeTime, getBlogBySlug } from "@/utils/helpers";

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;
        const blog: any = await getBlogBySlug(slug);

        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        const formatBlog = {
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
        };

        return NextResponse.json({ formatBlog }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/blogs/[slug]:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog" },
            { status: 500 }
        );
    }
}
