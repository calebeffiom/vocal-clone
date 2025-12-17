import { connectToMongo } from "@/lib/mongoDB";
import User from "@/models/user-model";
import { notFound } from "next/navigation";

interface UserProfileProps {
    params: {
      username: string; // <-- This will be "johnsmith"
    };
  }
export default async function ({params}: UserProfileProps){
    const {username} = params;

    await connectToMongo();

    const user = await User.findOne({username: username}).lean()

    if (!user){
        notFound();
    }

    // const userPosts = await Post
}