"use client"
import { Container } from "@shared";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import UserDetails from "./user-details";
import UserSkeleton from "./user-skeleton";

interface UserProps {
    username: string;
}

const User = ({ username }: UserProps) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async () => {
        if (!user) setLoading(true);
        try {
            const res = await axios.get(`/api/user/${username}`);
            if (res.data.formatedUser) {
                setUser(res.data.formatedUser);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            fetchUserProfile();
        }
    }, [username, fetchUserProfile]);

    if (loading) {
        return <UserSkeleton />;
    }

    if (!user) {
        return (
            <Container>
                <div className="py-20 text-center text-xl">User not found.</div>
            </Container>
        );
    }

    return (
        <section>
            <div className="pb-[50px]">
                {/* Banner */}
                <div className="relative h-60 w-full overflow-hidden">
                    <img
                        src={user?.coverPicture !== "black" && user?.coverPicture ? user.coverPicture : "https://readdy.ai/api/search-image?query=Minimalist%20writing%20workspace%20with%20soft%20green%20plants%20in%20background%2C%20blurred%20aesthetic%2C%20calm%20and%20peaceful%20environment%2C%20natural%20light%2C%20inspiring%20creative%20space%20for%20writers%20and%20developers&width=1440&height=400&seq=banner1&orientation=landscape"}
                        alt="Profile banner"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/80 to-transparent"></div>
                </div>

                {/* Profile Section */}
                <Container>
                    <div className="w-full max-w-5xl px-6 -mt-16 relative z-10">
                        <UserDetails user={user} />
                    </div>
                </Container>
            </div>
        </section>
    )
}
export default User;
