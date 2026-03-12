import UserArticle from "../user-article"

interface StoriesTabProps {
    user: any;
}

const StoriesTab = ({ user }: StoriesTabProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {user?.blogsWritten?.length > 0 ? (
                user.blogsWritten.map((blog: any, index: number) => (
                    <UserArticle
                        key={index}
                        id={blog.id}
                        previewImage={blog.coverImage}
                        heading={blog.title}
                        description={blog.content}
                        profileImage={user.image}
                        userName={user.name}
                        postTime={blog.createdAt}
                        category={blog.tag}
                        slug={blog.slug}
                    />
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-gray-500">
                    No stories published yet.
                </div>
            )}
        </div>
    )
}

export default StoriesTab
