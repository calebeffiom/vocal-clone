import { atom } from "recoil";
export interface BlogAuthor {
    id: string
    name: string
    username: string
    image: string
    bio: string
}

export interface Blog {
    id: string
    title: string
    subtitle?: string
    content: string[]
    coverImage: string
    slug: string
    tags: string[]
    published: boolean
    likes: number
    createdAt: string
    updatedAt: string
    author: BlogAuthor // 👈 belongs here
}
export const blogsAtom = atom<Blog[]>({
    key: "blogsAtom",
    default: [],
});
