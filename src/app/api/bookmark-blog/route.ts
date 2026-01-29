import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { bookmarkBlog, unbookmarkBlog } from "@/utils/helpers";

export async function POST(request: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: You must be logged in to bookmark stories" },
                { status: 401 }
            );
        }

        const { blogId } = await request.json();
        if (!blogId) {
            return NextResponse.json(
                { message: "Blog ID is required" },
                { status: 400 }
            );
        }

        await bookmarkBlog(session.user.id, blogId);

        return NextResponse.json({ message: "Blog bookmarked successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error in POST /api/bookmark-blog:", error);
        return NextResponse.json(
            { error: error.message || "Failed to bookmark blog" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: You must be logged in to unbookmark stories" },
                { status: 401 }
            );
        }

        const { blogId } = await request.json();
        if (!blogId) {
            return NextResponse.json(
                { message: "Blog ID is required" },
                { status: 400 }
            );
        }

        await unbookmarkBlog(session.user.id, blogId);

        return NextResponse.json({ message: "Blog unbookmarked successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error in DELETE /api/bookmark-blog:", error);
        return NextResponse.json(
            { error: error.message || "Failed to unbookmark blog" },
            { status: 500 }
        );
    }
}
