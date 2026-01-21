import { NextResponse, NextRequest } from "next/server";
import { formatRelativeTime, getBlogBySlug } from "@/utils/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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

        const session = await getServerSession(authOptions);
        console.log(`Fetching blog: ${slug}, User: ${session?.user?.id}`);
        console.log(`likedBy from DB:`, blog.likedBy);

        const hasLiked = session?.user?.id
            ? blog.likedBy?.some((id: any) => id.toString() === session.user.id)
            : false;
        console.log(`Has Liked: ${hasLiked}`);

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
            hasLiked,
            comments: blog.comments?.map((comment: any) => ({
                content: comment.content,
                author: {
                    username: comment.author?.username || "Anonymous",
                    name: comment.author?.name || "Anonymous",
                    image: comment.author?.image || "/images/profile.png"
                },
                createdAt: formatRelativeTime(comment.createdAt.toISOString())
            })).reverse(),
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

