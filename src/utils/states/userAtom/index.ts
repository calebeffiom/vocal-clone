import { atom } from "recoil"

interface Blog {
    id: string;
    title: string;
    content: string[];
    coverImage: string;
    slug: string;
    tags: string[];
    published: boolean;
    createdAt: string;
}
interface User {
    id: string;
    name: string;
    image: string;
    blogsWritten: Blog[] | [];
    bio: string;
    username: string;
    pinnedStories: Blog[] | [];
    bookmarks: Blog[] | [];
    coverPicture: string;
    createdAt: string;
}

export const userAtom = atom<User | null>({
    key: "userAtom",
    default: null
})

