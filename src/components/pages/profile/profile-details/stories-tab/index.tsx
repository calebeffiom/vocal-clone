import { BookMarkedIcon } from "lucide-react"
import UserArticle from "../user-article"
import { useRecoilValue } from "recoil"
import { userAtom } from "@/utils/states/userAtom"

const StoriesTab = () => {
    const user = useRecoilValue(userAtom)
    return (
        <div className="stories-cont grid grid-cols-3 gap-[30px]">
            {
                user?.blogsWritten.map((blog: any, index: number) => (
                    <UserArticle
                        key={index}
                        previewImage={blog.coverImage}
                        heading={blog.title}
                        description={blog.content}
                        profileImage={user.image}
                        userName={user.name}
                        postTime={blog.createdAt}
                        catergory={blog.tags[0]}
                    />
                ))
            }
        </div>
    )
}

export default StoriesTab