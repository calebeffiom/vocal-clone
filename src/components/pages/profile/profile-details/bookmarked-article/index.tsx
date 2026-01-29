"use client"
import axios from "axios";
import { BookmarkMinus, Loader2 } from "lucide-react"
import { useRecoilState } from "recoil";
import { userAtom } from "@/utils/states/userAtom";
import { useState } from "react";
interface types {
    id: string,
    previewImage: string,
    heading: string,
    description: string,
    profileImage: string,
    userName: string,
    postTime: string,
    catergory: string


}
const BookmarkedArticle = ({
    id,
    previewImage,
    heading,
    description,
    profileImage,
    userName,
    postTime,
    catergory
}: types) => {

    const [user, setUser] = useRecoilState(userAtom);
    const isBookmarked = user?.bookmarks?.some((b: any) => b.id === id || b._id === id);
    const [loading, setLoading] = useState(false)
    const handleUnBookmark = async () => {
        if (!user) return;
        try {
            setLoading(true)
            await axios.delete("/api/bookmark-blog", { data: { blogId: id } });
            setUser({
                ...user,
                bookmarks: user.bookmarks.filter(
                    (blog: any) => blog.id !== id
                ),
            });
        } catch (error) {
            console.error("Error unbookmarking post:", error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="story-flex-cont h-[450px] relative">
            <div onClick={() => console.log("clicked")}>
                <div>
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

                    <div className="cursor-pointer" onClick={handleUnBookmark}>
                        {
                            loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <BookmarkMinus />
                            )
                        }
                    </div>
                </div>



            </div>

        </div>
    )
}
export default BookmarkedArticle