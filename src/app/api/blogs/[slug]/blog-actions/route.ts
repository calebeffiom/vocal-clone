import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { addComment, toggleLike } from "@/utils/helpers";

export async function POST(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { slug } = params;
        const body = await req.json();
        const { content, action } = body;

        if (action === "comment") {
            if (!content || content.trim() === "") {
                return NextResponse.json({ message: "Comment content is required" }, { status: 400 });
            }

            const authorId = session.user.id;
            const updatedBlog = await addComment(slug, authorId, content);

            return NextResponse.json({
                message: "Comment added successfully",
                blog: updatedBlog
            }, { status: 200 });
        }

        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("Error in blog-actions POST:", error);
        return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { slug } = params;
        const updatedBlog = await toggleLike(slug, session.user.id, "like");

        return NextResponse.json({ message: "Post liked", blog: updatedBlog }, { status: 200 });
    } catch (error: any) {
        console.error("Error in blog-actions PUT:", error);
        return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { slug } = params;
        const updatedBlog = await toggleLike(slug, session.user.id, "unlike");

        return NextResponse.json({ message: "Post unliked", blog: updatedBlog }, { status: 200 });
    } catch (error: any) {
        console.error("Error in blog-actions DELETE:", error);
        return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
    }
}
