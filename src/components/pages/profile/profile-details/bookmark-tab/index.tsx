import BookmarkedArticle from "../bookmarked-article"
import { useRecoilValue } from "recoil"
import { userAtom } from "@/utils/states/userAtom"
const BookmarkedTab = () => {
    const user = useRecoilValue(userAtom)
    return (
        <div className="stories-cont grid grid-cols-3 gap-[30px]">
            {
                user?.bookmarks.map((blog: any, index: number) => (
                    <BookmarkedArticle
                        key={index}
                        id={blog.id}
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
export default BookmarkedTab