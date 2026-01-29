"use client"
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import EditProfileModal from "@/components/modals/EditProfileModal";

interface ProfileActionsProps {
    user: any;
    onSuccess: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ user, onSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="w-full sticky top-0 md:w-72 mt-8 md:mt-16">
                <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
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