import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUserById, formatRelativeTime, formatMonthYear } from "@/utils/helpers";

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
