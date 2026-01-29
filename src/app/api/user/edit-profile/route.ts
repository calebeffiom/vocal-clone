import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinaryConfig";
import { updateUserProfile } from "@/utils/helpers";

export async function PUT(request: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: You must be logged in to edit profile" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, bio, image, coverPicture } = body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (bio) updateData.bio = bio;

        // Handle profile picture upload
        if (image && image.startsWith("data:image")) {
            const uploadedImage = await cloudinary.uploader.upload(image, {
                folder: "user-profiles",
            });
            updateData.image = uploadedImage.secure_url;
        }

        // Handle cover picture upload
        if (coverPicture && coverPicture.startsWith("data:image")) {
            const uploadedCover = await cloudinary.uploader.upload(coverPicture, {
                folder: "user-covers",
            });
            updateData.coverPicture = uploadedCover.secure_url;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { message: "No changes detected" },
                { status: 400 }
            );
        }

        const updatedUser = await updateUserProfile(session.user.id, updateData);

        return NextResponse.json(
            { message: "Profile updated successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in PUT /api/user/edit-profile:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update profile" },
            { status: 500 }
        );
    }
}
