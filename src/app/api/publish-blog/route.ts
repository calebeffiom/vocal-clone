import { NextResponse, NextRequest } from "next/server";
import { connectToMongo } from "@/lib/mongoDB";
import Blog from "@/models/blog-model"
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinaryConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { formatRelativeTime, generateSlug, getAllBlogs, extractPublicId, getPersonalizedBlogs } from "@/utils/helpers";
import User from "@/models/user-model";
// import { Collection } from "mongodb";


export async function POST(req: NextRequest) {
  const res = NextResponse

  let mongoSession: mongoose.ClientSession | null = null

  try {
    const reqBody = await req.json()
    const { title, subtitle, paragraphs, coverImage, tag } = reqBody

    const session = await getServerSession(authOptions)

    // 1️⃣ Auth check
    if (!session || !session.user) {
      return res.json(
        { message: "Unauthorized: You must be logged in to post." },
        { status: 401 }
      )
    }

    // 2️⃣ Validation
    if (!title || !subtitle || !paragraphs || !coverImage || !tag) {
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
          tag,
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



export async function PUT(req: NextRequest) {
  const res = NextResponse;
  let mongoSession: mongoose.ClientSession | null = null;

  try {
    const reqBody = await req.json();
    const { id, title, subtitle, paragraphs, coverImage, tag } = reqBody;

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToMongo();

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.json({ message: "Blog not found" }, { status: 404 });
    }

    if (blog.author.toString() !== session.user.id) {
      return res.json({ message: "Unauthorized" }, { status: 403 });
    }

    let coverImageUrl = coverImage;

    // Handle image update
    if (coverImage.startsWith("data:")) {
      // Upload new image
      const uploadedImage = await cloudinary.uploader.upload(coverImage, {
        folder: "blog-images",
      });
      coverImageUrl = uploadedImage.secure_url;

      // Delete old image if it exists and is from cloudinary
      if (blog.coverImage && blog.coverImage.includes("cloudinary")) {
        const publicId = extractPublicId(blog.coverImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    // Update fields
    blog.title = title;
    blog.subtitle = subtitle;
    blog.content = paragraphs;
    blog.coverImage = coverImageUrl;
    // Check if tags is array, split if string?
    // create-story sends array (text.tags is array in my code?)
    // In create-story, text.tags is string[], but input handling splits it.
    blog.tags = tag;
    blog.published = true; // Set to published

    if (blog.title !== title) {
      blog.slug = generateSlug(title);
    }

    // Handle explicit session? save() uses default usually, but we are not in transaction here unless we start one.
    // POST used transaction. Should we?
    // Single document update is atomic in Mongo. Transaction needed if updating multiple docs (like User).
    // POST updated User.blogsWritten.
    // PUT just updates existing blog. User.blogsWritten already has the ID.
    // So no transaction needed for single doc update.
    await blog.save();

    return res.json({ message: "Blog published successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);
    const blogs = await getPersonalizedBlogs(session?.user?.id);

    const formatBlogs = blogs.map((blog: any) => ({
      id: blog._id.toString(),
      title: blog.title,
      subtitle: blog.subtitle,
      content: blog.content,
      coverImage: blog.coverImage,
      slug: blog.slug,
      tag: blog.tag,
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
