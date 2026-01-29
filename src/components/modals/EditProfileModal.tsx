"use client"
import React, { useState, useCallback, useEffect, useRef } from "react";
import { X, Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import axios from "axios";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onSuccess: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [profileImage, setProfileImage] = useState(user?.image || "");
    const [coverImage, setCoverImage] = useState(user?.coverPicture || "");
    const [loading, setLoading] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const profileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const hasNameChanged = name !== user?.name;
        const hasBioChanged = bio !== user?.bio;
        const hasProfileChanged = profileImage !== user?.image;
        const hasCoverChanged = coverImage !== user?.coverPicture;
        setIsChanged(hasNameChanged || hasBioChanged || hasProfileChanged || hasCoverChanged);
    }, [name, bio, profileImage, coverImage, user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === "profile") {
                    setProfileImage(reader.result as string);
                } else {
                    setCoverImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = useCallback(async () => {
        if (!isChanged) return;
        setLoading(true);
        try {
            const payload: any = {};
            if (name !== user?.name) payload.name = name;
            if (bio !== user?.bio) payload.bio = bio;
            if (profileImage !== user?.image) payload.image = profileImage;
            if (coverImage !== user?.coverPicture) payload.coverPicture = coverImage;

            await axios.put("/api/user/edit-profile", payload);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [isChanged, name, bio, profileImage, coverImage, user, onSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Cover Photo */}
                    <div className="relative group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
                        <div className="relative h-32 w-full bg-gray-100 rounded-xl overflow-hidden">
                            <img
                                src={coverImage || "https://readdy.ai/api/search-image?query=Minimalist%20writing%20workspace%20with%20soft%20green%20plants%20in%20background%2C%20blurred%20aesthetic%2C%20calm%20and%20peaceful%20environment%2C%20natural%20light%2C%20inspiring%20creative%20space%20for%20writers%20and%20developers&width=1440&height=400&seq=banner1&orientation=landscape"}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                            >
                                <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                    <ImageIcon className="w-5 h-5 text-gray-700" />
                                </div>
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={(e) => handleImageChange(e, "cover")}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    {/* Profile Photo */}
                    <div className="relative -mt-16 flex justify-center">
                        <div className="relative group p-1 bg-white rounded-full">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                                <img
                                    src={profileImage || "/images/profile.png"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => profileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center transition-all"
                            >
                                <div className="bg-black/40 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-5 h-5 text-white" />
                                </div>
                            </button>
                            <input
                                type="file"
                                ref={profileInputRef}
                                onChange={(e) => handleImageChange(e, "profile")}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 pt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                                placeholder="Tell us about yourself"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isChanged || loading}
                        className="flex-1 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
