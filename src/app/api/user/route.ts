import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUserById, formatRelativeTime, formatMonthYear, pinPost, unpinPost } from "@/utils/helpers";
import { Bookmark } from "lucide-react";

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: You must be logged in to view profile" },
                { status: 401 }
            )
        }
        const user = await getUserById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        const formatedUser = {
            id: user._id.toString(),
            name: user.name,
            image: user.image,
            bio: user.bio,
            username: user.username,
            pinnedStories: user.pinnedStories.map((blog: any) => ({
                id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
                coverImage: blog.coverImage,
                slug: blog.slug,
                tags: blog.tags,
                published: blog.published,
                createdAt: formatRelativeTime(blog.createdAt.toISOString()),
            })) || [],
            coverPicture: user.coverPicture,
            blogsWritten: user.blogsWritten.map((blog: any) => ({
                id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
                coverImage: blog.coverImage,
                slug: blog.slug,
                tags: blog.tags,
                published: blog.published,
                createdAt: formatRelativeTime(blog.createdAt.toISOString()),
            })) || [],
            bookmarks: user.bookmarks.map((blog: any) => ({
                id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
                coverImage: blog.coverImage,
                slug: blog.slug,
                tags: blog.tags,
                published: blog.published,
                createdAt: formatRelativeTime(blog.createdAt.toISOString()),
            })) || [],
            createdAt: formatMonthYear(user.createdAt.toISOString()),
        }

        return NextResponse.json({ formatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session: any = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: You must be logged in to pin stories" },
                { status: 401 }
            )
        }

        const { postId } = await request.json()
        if (!postId) {
            return NextResponse.json(
                { message: "Post ID is required" },
                { status: 400 }
            )
        }

        await pinPost(session.user.id, postId)

        return NextResponse.json({ message: "Post pinned successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error in PUT /api/user:", error);
        return NextResponse.json(
            { error: error.message || "Failed to pin story" },
            { status: 500 }
        );
    }
}


export async function DELETE(request: Request) {
    try {
        const session: any = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: You must be logged in to unpin stories" },
                { status: 401 }
            )
        }

        const { postId } = await request.json()
        if (!postId) {
            return NextResponse.json(
                { message: "Post ID is required" },
                { status: 400 }
            )
        }

        await unpinPost(session.user.id, postId)

        return NextResponse.json({ message: "Post unpinned successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error in DELETE /api/user:", error);
        return NextResponse.json(
            { error: error.message || "Failed to unpin story" },
            { status: 500 }
        );
    }
}
