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

        const blogs = await Blog.find({})
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

export { generateSlug, getAllBlogs, formatRelativeTime, getBlogBySlug, getUserById, formatMonthYear }