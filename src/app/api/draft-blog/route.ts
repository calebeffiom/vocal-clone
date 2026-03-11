import { NextResponse, NextRequest } from "next/server";
import { connectToMongo } from "@/lib/mongoDB";
import Blog from "@/models/blog-model"
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinaryConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { formatRelativeTime, generateSlug, getAllBlogs } from "@/utils/helpers";
import User from "@/models/user-model";


export async function POST(req: Request) {
    let mongoSession: mongoose.ClientSession | null = null
    try {
        const { title, subtitle, paragraphs, coverImage, tags } = await req.json()
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: You must be logged in to post." },
                { status: 401 }
            )
        }
        if (!title || !subtitle || !paragraphs || !coverImage || !tags) {
            return NextResponse.json(
                { message: "Bad request" },
                { status: 400 }
            )
        }
        await connectToMongo()
        const uploadedImage = await cloudinary.uploader.upload(coverImage, {
            folder: "blog-images",
        })
        const slug = generateSlug(title)
        const [blog] = await Blog.create([
            {
                author: session.user.id,
                title,
                subtitle,
                content: paragraphs,
                coverImage: uploadedImage.secure_url,
                slug,
                tags,
                published: false,
            },
        ])
        await User.findByIdAndUpdate(
            session.user.id,
            { $push: { blogsWritten: blog._id } },
            { session: mongoSession }
        )
        return NextResponse.json(
            { message: "Blog posted successfully" },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating blog:", error)
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        )
    }
}