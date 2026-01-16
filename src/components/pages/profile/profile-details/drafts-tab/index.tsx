import UserArticle from "../user-article"
import { useRecoilValue } from "recoil"
import { userAtom } from "@/utils/states/userAtom"
const DraftsTab = () => {
    const user = useRecoilValue(userAtom)
    return (
        <div className="stories-cont grid grid-cols-3 gap-[30px]">

            {/* <UserArticle
                previewImage="/images/ice.jpeg"
                heading="Terrifying Legend: Abandoned Portlock Alaska"
                description="This piece is for my New Year's resolution to share one original song, however imperfect/unfinished it may be, per month! I'll put the link to the article"
                profileImage="/images/profile.png"
                userName="sara burdick"
                postTime="a day ago"
                catergory="Horror"
            />
            <UserArticle
                previewImage="/images/talkingDrums.jpeg"
                heading="Talking Drums to 21st-Century Parties: The"
                description="This piece is for my New Year's resolution to share one original song, however imperfect/unfinished it may be, per month! I'll put the link to the article"
                profileImage="/images/profile.png"
                userName="sara burdick"
                postTime="a day ago"
                catergory="Horror"
            /> */}

            {
                user?.blogsWritten.filter((draft: any) => draft.published === false).map((draft: any, index: number) => (
                    <UserArticle
                        key={index}
                        previewImage={draft.coverImage}
                        heading={draft.title}
                        description={draft.content}
                        profileImage={user.image}
                        userName={user.name}
                        postTime={draft.createdAt}
                        catergory={draft.tags[0]}
                    />
                ))
            }
        </div>
    )
}
export default DraftsTab