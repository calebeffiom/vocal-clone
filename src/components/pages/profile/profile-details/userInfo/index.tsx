import { Calendar, ScrollText } from "lucide-react"
import { useRecoilValue } from "recoil"
import { userAtom } from "@/utils/states/userAtom"
const UserInfo = () => {
    const user = useRecoilValue(userAtom)
    const storiesCount = user?.blogsWritten.length || 0
    return (
        <section>
            <div className="mb-6 items-end">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                    <img
                        src={user?.image}
                        alt="Profile"
                        className="w-full h-full object-cover object-top"
                    />
                </div>
                <div className="ml-4 mt-[20px] pb-2">
                    <h1 className="text-3xl mb-[20px] font-bold text-gray-800">
                        {user?.name}
                    </h1>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                        <div className="flex items-center">
                            <Calendar className="mr-2 text-[25px]" />
                            <span className="text-[17px] ">Joined {user?.createdAt}</span>
                        </div>
                        <div className="flex items-center">
                            <ScrollText className="mr-2 text-[25px]" />
                            <span className="text-[17px]">{storiesCount > 1 || storiesCount === 0 ? `${storiesCount} stories` : `${storiesCount} story`}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
                <p className="leading-relaxed text-[17px]">
                    {user?.bio}
                </p>
            </div>
        </section>
    )
}
export default UserInfo