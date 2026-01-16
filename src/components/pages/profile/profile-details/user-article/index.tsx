"use client"
import { PinIcon } from "lucide-react"
interface types {
    previewImage: string,
    heading: string,
    description: string,
    profileImage: string,
    userName: string,
    postTime: string,
    catergory: string


}
const UserArticle = ({
    previewImage,
    heading,
    description,
    profileImage,
    userName,
    postTime,
    catergory
}: types) => {
    return (
        <div className="story-flex-cont h-[450px] relative">
            <img src={previewImage} className="rounded-[10px] mb-[15px] w-[100%] h-[200px]" alt="" />
            <h2 className="text-[25px] mb-[15px] line-clamp-2">{heading}</h2>
            <p className="text-[17px] w-full line-clamp-3">{description}</p>
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


                <div><PinIcon /></div>
            </div>

        </div>
    )
}
export default UserArticle