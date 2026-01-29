import { BookMarkedIcon } from "lucide-react"
import UserArticle from "../user-article"
import { useRecoilValue } from "recoil"
import { userAtom } from "@/utils/states/userAtom"

const StoriesTab = () => {
    const user = useRecoilValue(userAtom)
    return (
        <div className="stories-cont grid grid-cols-3 gap-[30px]">
            {
                user?.blogsWritten.filter((blog: any) => blog.published === true).map((blog: any, index: number) => (
                    <UserArticle
                        key={index}
                        id={blog.id}
                        previewImage={blog.coverImage}
                        heading={blog.title}
                        description={blog.content}
                        profileImage={user.image}
                        userName={user.name}
                        postTime={blog.createdAt}
                        catergory={blog.tags[0]}
                        slug={blog.slug}
                    />
                ))
            }
        </div>
    )
}

export default StoriesTab