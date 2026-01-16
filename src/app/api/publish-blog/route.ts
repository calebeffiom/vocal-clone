import { NextResponse, NextRequest } from "next/server";
import { connectToMongo } from "@/lib/mongoDB";
import Blog from "@/models/blog-model"
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinaryConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { formatRelativeTime, generateSlug, getAllBlogs } from "@/utils/helpers";
import User from "@/models/user-model";
// import { Collection } from "mongodb";
export async function POST(req: NextRequest) {
  const res = NextResponse

  let mongoSession: mongoose.ClientSession | null = null

  try {
    const reqBody = await req.json()
    const { title, subtitle, paragraphs, coverImage, tags } = reqBody

    const session = await getServerSession(authOptions)

    // 1️⃣ Auth check
    if (!session || !session.user) {
      return res.json(
        { message: "Unauthorized: You must be logged in to post." },
        { status: 401 }
      )
    }

    // 2️⃣ Validation
    if (!title || !subtitle || !paragraphs || !coverImage || !tags) {
      return res.json(
        { message: "Bad request" },
        { status: 400 }
      )
    }

    // 3️⃣ Connect to Mongo
    await connectToMongo()

    // 4️⃣ Upload image (OUTSIDE transaction)
    const uploadedImage = await cloudinary.uploader.upload(coverImage, {
      folder: "blog-images",
    })

    const slug = generateSlug(title)
    // 5️⃣ Start transaction
    mongoSession = await mongoose.startSession()
    mongoSession.startTransaction()

    // 6️⃣ Create blog
    const [blog] = await Blog.create(
      [
        {
          author: session.user.id,
          title,
          subtitle,
          content: paragraphs,
          coverImage: uploadedImage.secure_url,
          slug,
          tags,
          published: true,
        },
      ],
      { session: mongoSession }
    )

    // 7️⃣ Update author
    await User.findByIdAndUpdate(
      session.user.id,
      { $push: { blogsWritten: blog._id } },
      { session: mongoSession }
    )

    // 8️⃣ Commit
    await mongoSession.commitTransaction()

    return res.json(
      { message: "Blog posted successfully" },
      { status: 201 }
    )

  } catch (error) {
    // 9️⃣ Rollback if anything fails
    if (mongoSession) {
      await mongoSession.abortTransaction()
    }

    console.error("Error creating blog:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )

  } finally {
    // 🔚 Always clean up
    if (mongoSession) {
      mongoSession.endSession()
    }
  }
}



export async function GET() {
  try {
    const blogs = await getAllBlogs();
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
    console.error("Error in GET /api/publish-blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
