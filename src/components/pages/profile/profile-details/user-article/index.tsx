"use client"
import axios from "axios";
import { PinIcon, PinOffIcon } from "lucide-react"
import { useRecoilState } from "recoil";
import { userAtom } from "@/utils/states/userAtom";
import { useState } from "react";
import { useRouter } from "next/navigation"
interface types {
    id: string,
    previewImage: string,
    heading: string,
    description: string,
    profileImage: string,
    userName: string,
    postTime: string,
    catergory: string,
    slug: string


}
const UserArticle = ({
    id,
    previewImage,
    heading,
    description,
    profileImage,
    userName,
    postTime,
    catergory,
    slug
}: types) => {
    const router = useRouter()
    const [user, setUser] = useRecoilState(userAtom);
    const handlePin = async () => {
        try {
            if (user) {
                const isPinned = user.pinnedStories.some((story: any) => story.id === id);
                if (isPinned) {
                    const request = await axios.delete(`/api/user`, { data: { postId: id } });
                    setUser({
                        ...user,
                        pinnedStories: user.pinnedStories.filter(
                            (story: any) => story.id !== id
                        ),
                    });
                } else {
                    if (user.pinnedStories.length >= 3) {
                        console.error("Maximum 3 pinned stories allowed");
                        return;
                    }
                    const request = await axios.put(`/api/user`, { postId: id });
                    if (request.status === 200) {
                        console.log("Post pinned successfully");
                        const storyToPin = user.blogsWritten.find((blog: any) => blog.id === id);
                        if (!storyToPin) return;
                        setUser({
                            ...user,
                            pinnedStories: [...user.pinnedStories, storyToPin],
                        });
                    }
                    else {
                        console.error("Failed to pin post");
                    }
                }
            }
        } catch (error) {
            console.error("Error pinning/unpinning post:", error);
        }
    };

    return (
        <div className="story-flex-cont h-[450px] relative">
            <div>
                <div
                    onClick={
                        () => {
                            user?.blogsWritten.filter((draft: any) => draft.published === true).some((draft: any) => draft.id === id) ? router.push(`/blog/${slug}`) : router.push(`/create-story`)
                        }
                    }
                    className="cursor-pointer"
                >
                    <img src={previewImage} className="rounded-[10px] mb-[15px] w-[100%] h-[200px]" alt="" />
                    <h2 className="text-[25px] mb-[15px] line-clamp-2">{heading}</h2>
                    <p className="text-[17px] w-full line-clamp-3">{Array.isArray(description) ? description[0] : description}</p>
                </div>
                <div className="article-writer-details w-[100%] flex items-center justify-between absolute bottom-0">
                    <div className="author-cont flex gap-[10px] items-center">


                        <div className="writer-image-cont">
                            <img src={profileImage} className="h-[50px] rounded-full" alt="" />
                        </div>


                        <div className="writer-name-cont">
                            <h4>{userName}</h4>
                            <p className="text-[#8f8f8f] text-[13px]">{postTime} in {catergory}</p>
                        </div>

                    </div>
                    {
                        user?.blogsWritten.some((draft: any) => draft.published && draft.id === id) &&

                        (
                            <div className="cursor-pointer" onClick={handlePin}>{
                                user?.pinnedStories.some((story: any) => story.id === id) && user?.pinnedStories.length <= 3 ?
                                    <PinOffIcon /> :
                                    <PinIcon />
                            }</div>
                        )
                    }
                </div>



            </div>

        </div>
    )
}
export default UserArticle