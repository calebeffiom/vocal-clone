import { NextResponse, NextRequest } from "next/server";
import { connectToMongo } from "@/lib/mongoDB";
import Blog from "@/models/blog-model"
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinaryConfig";
// import { Collection } from "mongodb";
export async function POST(req: NextRequest){
    const res = NextResponse;

    const reqBody = await req.json()
    const {title, subtitle, paragraphs, coverImage, tags} = reqBody

  try {

    const uploadedImage = await cloudinary.uploader.upload(coverImage,
      {
        folder: "blog-images",
      }
    )
    console.log(uploadedImage)
    return res.json(
      {message: "sent"},
      { status: 201 },
      
    );
  } catch (error) {
    console.error("Error creating blog:", error);
        return res.json(
          { error: "Server error" },
          { status: 500 }
        );
  }
    // try {
      
      // await connectToMongo()
      // const authorId = "675abc8940e0c92ad4b1d11b"
      //   const payload = {
      //       authorId: authorId, // replace with logged-in user
      //       title: "My first blog",
      //       content: "<p>Hello world</p>",
      //       coverImage: "https://example.com/image.jpg",
      //       tags: ["nextjs", "mongodb"],
      //       published: true,
      //     }

          // const result = await Blog.create(payload)

          // console.log("added to posts")
          // return res.json(
          //   { success: true, title: result.title},
          //   { status: 201 }
          // );

    // } catch (error) {
    //     console.error("Error creating blog:", error);
    //     return res.json(
    //       { error: "Server error" },
    //       { status: 500 }
    //     );
    // }

    
}


// app/api/ping/route.ts
// import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, time: new Date().toISOString() });
}
