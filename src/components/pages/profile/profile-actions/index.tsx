"use client"
import React, { useState } from "react";
import { ChevronDown, Share2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import EditProfileModal from "@/components/modals/EditProfileModal";

interface ProfileActionsProps {
    user: any;
    onSuccess: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ user, onSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);

    const handleShareProfile = async () => {
        const url = typeof window !== "undefined"
            ? `${window.location.origin}/user/${user?.username}`
            : "";
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${user?.name} on Vocal Clone`,
                    url,
                    text: `Check out ${user?.name}'s profile on Vocal Clone`,
                });
            } else {
                await navigator.clipboard.writeText(url);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
            }
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                await navigator.clipboard.writeText(url);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
            }
        }
    };

    return (
        <>
            <div className="w-full md:w-72 mt-8 md:mt-16 md:sticky md:top-24 md:self-start">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                        Update your profile
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Leave a lasting first impression with the right avatar, banner
                        and bio.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50 cursor-pointer whitespace-nowrap !rounded-button transition-colors"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={handleShareProfile}
                        className="w-full mt-3 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50 cursor-pointer whitespace-nowrap !rounded-button transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        {shareCopied ? "Copied!" : "Share Profile"}
                    </button>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full mt-3 flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 font-medium py-2 px-4 rounded hover:bg-red-50 cursor-pointer whitespace-nowrap !rounded-button transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

                {/* <div className="mt-6 bg-gray-50 rounded-lg shadow-lg pt-6 px-6">
                    <h3 className="font-medium text-gray-800 mb-2">Writing Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total stories</span>
                            <span className="font-medium">5</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total views</span>
                            <span className="font-medium">1,243</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Followers</span>
                            <span className="font-medium">28</span>
                        </div>
                    </div>
                    <div className="mt-4 border-t border-gray-200">
                        <button className="w-full p-4 text-sm text-gray-700 hover:text-gray-900 cursor-pointer whitespace-nowrap !rounded-button">
                            <span className="w-[100%] flex items-center justify-between">View More stats <ChevronDown className="text-[20px]" /></span>
                        </button>
                    </div>
                </div> */}
            </div>

            <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
                onSuccess={onSuccess}
            />
        </>
    )
}
export default ProfileActions