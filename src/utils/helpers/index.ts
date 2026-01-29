import mongoose from "mongoose";
import { connectToMongo } from "@/lib/mongoDB";
import Blog from "@/models/blog-model";
import User from "@/models/user-model";

const generateSlug = (str: string) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove non-word [a-z0-9_], non-space, non-hyphen
        .replace(/[\s_-]+/g, "-") // Replace spaces/hyphens/underscores with a single hyphen
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

const getAllBlogs = async () => {
    try {
        await connectToMongo()

        const blogs = await Blog.find({ published: true })
            .sort({ createdAt: -1 })
            .populate('author') // 👈 THIS LINE
            .lean()

        return blogs
    } catch (error) {
        console.error('Error fetching all blogs:', error)
        throw error
    }
}

const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

const getBlogBySlug = async (slug: string) => {
    try {
        await connectToMongo()
        const blog = await Blog.findOne({ slug })
            .populate('author')
            .populate('comments.author')
            .lean()
        return blog
    } catch (error) {
        console.error('Error fetching blog by slug:', error)
        throw error
    }
}

const getUserById = async (id: string) => {
    try {
        await connectToMongo()
        const user = await User.findById(id)
            .populate({
                path: 'blogsWritten',
                options: { sort: { createdAt: -1 } }
            })
            .populate('pinnedStories')
            .populate('bookmarks')
            .lean()
        return user
    } catch (error) {
        console.error('Error fetching user', error)
        throw error
    }
}

const formatMonthYear = (dateString: string | Date) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const pinPost = async (userId: string, postId: string) => {
    try {
        await connectToMongo()
        const user = await User.findById(userId)
        if (!user) throw new Error("User not found")

        if (user.pinnedStories.includes(postId)) {
            return user; // Already pinned
        }

        if (user.pinnedStories.length >= 3) {
            throw new Error("Maximum of 3 pinned stories allowed")
        }

        user.pinnedStories.push(postId)
        await user.save()
        return user
    } catch (error) {
        console.error('Error pinning post', error)
        throw error
    }
}

const unpinPost = async (userId: string, postId: string) => {
    try {
        await connectToMongo()
        const user = await User.findById(userId)
        if (!user) throw new Error("User not found")

        const postIndex = user.pinnedStories.indexOf(postId)
        if (postIndex > -1) {
            user.pinnedStories.splice(postIndex, 1)
            await user.save()
        }
        return user
    } catch (error) {
        console.error('Error unpinning post', error)
        throw error
    }
}

const addComment = async (slug: string, authorId: string, content: string) => {
    try {
        await connectToMongo()
        const blog = await Blog.findOne({ slug })
        if (!blog) throw new Error("Blog not found")

        const newComment = {
            author: authorId,
            content,
            createdAt: new Date()
        }

        blog.comments.push(newComment);
        await blog.save();
        return blog;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}

const toggleLike = async (slug: string, userId: string, action: "like" | "unlike") => {
    try {
        await connectToMongo()
        const blog = await Blog.findOne({ slug })
        if (!blog) throw new Error("Blog not found")

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const hasLiked = blog.likedBy.some((id: any) => id.toString() === userId);

        if (action === "like") {
            if (!hasLiked) {
                blog.likedBy.push(userObjectId);
                blog.likes = (blog.likes || 0) + 1;
            }
        } else if (action === "unlike") {
            if (hasLiked) {
                blog.likedBy.pull(userObjectId);
                blog.likes = Math.max(0, (blog.likes || 0) - 1);
            }
        }

        blog.markModified('likedBy');
        blog.markModified('likes');

        const savedBlog = await blog.save();
        return savedBlog;
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
}

const getUserByUsername = async (username: string) => {
    try {
        await connectToMongo()
        const user = await User.findOne({ username })
            .populate({
                path: 'blogsWritten',
                match: { published: true }, // Only public stories
                options: { sort: { createdAt: -1 } }
            })
            .populate({
                path: 'pinnedStories',
                match: { published: true }
            })
            .lean()
        return user
    } catch (error) {
        console.error('Error fetching user by username', error)
        throw error
    }
}

const getTrendingBlogs = async () => {
    try {
        await connectToMongo()

        const blogs = await Blog.aggregate([
            { $match: { published: true } },
            {
                $addFields: {
                    commentCount: { $size: { $ifNull: ["$comments", []] } }
                }
            },
            {
                $addFields: {
                    popularityScore: { $add: [{ $ifNull: ["$likes", 0] }, "$commentCount"] }
                }
            },
            { $sort: { popularityScore: -1, createdAt: -1 } },
            { $limit: 10 }
        ]);

        const populatedBlogs = await Blog.populate(blogs, { path: 'author' });

        return populatedBlogs
    } catch (error) {
        console.error('Error fetching trending blogs:', error)
        throw error
    }
}

const updateUserProfile = async (userId: string, data: any) => {
    try {
        await connectToMongo()
        const user = await User.findByIdAndUpdate(userId, data, { new: true })
        if (!user) throw new Error("User not found")
        return user
    } catch (error) {
        console.error('Error updating user profile', error)
        throw error
    }
}

const bookmarkBlog = async (userId: string, blogId: string) => {
    try {
        await connectToMongo()
        const user = await User.findById(userId)
        if (!user) throw new Error("User not found")

        if (user.bookmarks.includes(blogId)) {
            return user; // Already bookmarked
        }

        user.bookmarks.push(blogId)
        await user.save()
        return user
    } catch (error) {
        console.error('Error bookmarking blog', error)
        throw error
    }
}

const unbookmarkBlog = async (userId: string, blogId: string) => {
    try {
        await connectToMongo()
        const user = await User.findById(userId)
        if (!user) throw new Error("User not found")

        const blogIndex = user.bookmarks.indexOf(blogId)
        if (blogIndex > -1) {
            user.bookmarks.splice(blogIndex, 1)
            await user.save()
        }
        return user
    } catch (error) {
        console.error('Error unbookmarking blog', error)
        throw error
    }
}

const extractPublicId = (url: string) => {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const publicIdWithExtension = lastPart.split('.')[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${publicIdWithExtension}`;
};

export { generateSlug, getAllBlogs, getTrendingBlogs, formatRelativeTime, getBlogBySlug, getUserById, formatMonthYear, pinPost, unpinPost, addComment, toggleLike, getUserByUsername, updateUserProfile, bookmarkBlog, unbookmarkBlog, extractPublicId }