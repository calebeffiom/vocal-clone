import UserArticle from "../user-article"
import { useRecoilValue } from "recoil"
import { userAtom } from "@/utils/states/userAtom"

const PinnedTab = () => {
    const user = useRecoilValue(userAtom)
    return (
        <div className="stories-cont grid grid-cols-3 gap-[30px]">
            {
                user?.pinnedStories.map((blog: any, index: number) => (
                    <UserArticle
                        key={index}
                        previewImage={blog.coverImage}
                        heading={blog.title}
                        description={blog.content}
                        profileImage={blog.author.image}
                        userName={blog.author.name}
                        postTime={blog.createdAt}
                        catergory={blog.tags[0]}
                    />
                ))
            }
        </div>
    )
}
export default PinnedTab