"use client"
import { BookMarkedIcon, BookmarkPlus, BookmarkMinus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRecoilState } from "recoil"
import { userAtom } from "@/utils/states/userAtom"
import axios from "axios"
import { useState } from "react"
import { useSession } from "next-auth/react"

interface types {
    id: string,
    previewImage: string,
    heading: string,
    description: string,
    profileImage: string,
    userName: string,
    displayName: string,
    postTime: string,
    catergory: string,
    slug: string
}
const TopArticlePreview = ({
    id,
    previewImage,
    heading,
    description,
    profileImage,
    displayName,
    userName,
    postTime,
    catergory,
    slug
}: types) => {
    const router = useRouter()
    const { status } = useSession()
    const [user, setUser] = useRecoilState(userAtom)
    const [loading, setLoading] = useState(false)

    const isBookmarked = user?.bookmarks?.some((b: any) => b.id === id || b._id === id);

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (status === "unauthenticated") {
            const callbackUrl =
                typeof window !== "undefined"
                    ? window.location.pathname + window.location.search
                    : "/latest-stories";
            router.push(`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`);
            return;
        }

        // Ensure we have the user profile loaded (Recoil) even if session is authenticated.
        let currentUser = user;
        if (!currentUser) {
            const res = await axios.get("/api/user");
            if (res.data.formatedUser) {
                setUser(res.data.formatedUser);
                currentUser = res.data.formatedUser;
            }
        }

        if (!currentUser) return;

        const currentlyBookmarked = currentUser?.bookmarks?.some((b: any) => b.id === id || b._id === id);
        setLoading(true);
        try {
            if (currentlyBookmarked) {
                await axios.delete("/api/bookmark-blog", { data: { blogId: id } });
            } else {
                await axios.post("/api/bookmark-blog", { blogId: id });
            }
            // Refetch user to update bookmarks list
            const res = await axios.get("/api/user");
            if (res.data.formatedUser) {
                setUser(res.data.formatedUser);
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                const callbackUrl =
                    typeof window !== "undefined"
                        ? window.location.pathname + window.location.search
                        : "/latest-stories";
                router.push(`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`);
                return;
            }
            console.error("Error toggling bookmark:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="story-flex-cont h-[450px] relative mb-6">
           
           <div onClick={() => {
                router.push(`/blog/${slug}`)
            }}>
                <img
                    src={previewImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="rounded-[10px] mb-[15px] w-[100%] h-[200px]"
                />
                <h2 className="text-[25px] mb-[15px] line-clamp-2">{heading}</h2>
                <p className="text-[17px] w-full line-clamp-3">{description}</p>
            </div>
            <div className="article-writer-details w-[100%] flex items-center justify-between absolute bottom-0">
                <div className="author-cont flex gap-[10px] items-center" onClick={()=>{router.push(`/user/${userName}`)}}>


                    <div className="writer-image-cont">
                        <img
                            src={profileImage}
                            alt=""
                            loading="eager"
                            decoding="async"
                            className="h-[50px] w-[50px] rounded-full"
                        />
                    </div>


                    <div className="writer-name-cont">
                        <h4>{displayName}</h4>
                        <p className="text-[#8f8f8f] text-[13px]">{postTime} in {catergory}</p>
                    </div>

                </div>


                <div onClick={handleBookmark} className="cursor-pointer">
                    {loading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : isBookmarked ? (
                        <BookmarkMinus />
                    ) : (
                        <BookmarkPlus />
                    )}
                </div>
            </div>

        </div>
    )
}
export default TopArticlePreview