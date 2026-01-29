import UserArticle from "../user-article"
import { useRecoilValue } from "recoil"
import { userAtom } from "@/utils/states/userAtom"
const DraftsTab = () => {
    const user = useRecoilValue(userAtom)
    return (
        <div className="stories-cont grid grid-cols-3 gap-[30px]">
            {
                user?.blogsWritten.filter((draft: any) => draft.published === false).map((draft: any, index: number) => (
                    <UserArticle
                        key={index}
                        id={draft.id}
                        previewImage={draft.coverImage}
                        heading={draft.title}
                        description={draft.content}
                        profileImage={user.image}
                        userName={user.name}
                        postTime={draft.createdAt}
                        catergory={draft.tags[0]}
                        slug={draft.slug}
                    />
                ))
            }
        </div>
    )
}
export default DraftsTab