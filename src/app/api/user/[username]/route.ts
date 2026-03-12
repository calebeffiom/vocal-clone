import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername, formatRelativeTime, formatMonthYear } from "@/utils/helpers";

export async function GET(
    req: NextRequest,
    { params }: { params: { username: string } }
) {
    try {
        const { username } = params;
        const user = await getUserByUsername(username);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const formatedUser = {
            id: user._id.toString(),
            name: user.name,
            image: user.image,
            bio: user.bio,
            username: user.username,
            pinnedStories: (user.pinnedStories || []).map((blog: any) => ({
                id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
                coverImage: blog.coverImage,
                slug: blog.slug,
                tag: blog.tag,
                published: blog.published,
                createdAt: formatRelativeTime(blog.createdAt.toISOString()),
            })),
            coverPicture: user.coverPicture,
            blogsWritten: (user.blogsWritten || []).map((blog: any) => ({
                id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
                coverImage: blog.coverImage,
                slug: blog.slug,
                tag: blog.tag,
                published: blog.published,
                createdAt: formatRelativeTime(blog.createdAt.toISOString()),
            })),
            createdAt: formatMonthYear(user.createdAt.toISOString()),
        };

        return NextResponse.json({ formatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/user/[username]:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
