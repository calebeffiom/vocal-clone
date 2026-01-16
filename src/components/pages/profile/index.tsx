"use client"
import { Container } from "@shared";
import ProfileActions from "./profile-actions";
import ProfileDetails from "./profile-details";
import { useCallback, useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userAtom } from "@/utils/states/userAtom";

const ProfilePage = () => {
    const [user, setUser] = useRecoilState(userAtom);

    const fetchUserProfile = useCallback(async () => {
        try {
            const res = await axios.get("/api/user");
            if (res.data.formatedUser) {
                setUser(res.data.formatedUser);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }, [setUser]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);


    return (

        <section>
            <div className="pb-[50px]">
                {/* Banner */}
                <div className="relative h-60 w-full overflow-hidden">
                    <img
                        src={user?.coverPicture !== "black" || null ? user?.coverPicture : "https://readdy.ai/api/search-image?query=Minimalist%20writing%20workspace%20with%20soft%20green%20plants%20in%20background%2C%20blurred%20aesthetic%2C%20calm%20and%20peaceful%20environment%2C%20natural%20light%2C%20inspiring%20creative%20space%20for%20writers%20and%20developers&width=1440&height=400&seq=banner1&orientation=landscape"}
                        alt="Profile banner"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/80 to-transparent"></div>
                </div>

                {/* Profile Section */}
                <Container>
                    <div className="w-full mx-auto px-6 -mt-16 relative z-10">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Left Column - Profile Info */}

                            <ProfileDetails />


                            {/* Right Column - Sidebar */}
                            <ProfileActions />
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    )
}
export default ProfilePage;