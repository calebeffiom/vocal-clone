"use client"
import UserInfo from "./userInfo"
import ActiveTabs from "./tabs"
import StoriesTab from "./stories-tab"
import PinnedTab from "./pinned-tab"
import DraftsTab from "./drafts-tab"
import { useState } from "react"
const ProfileDetails = () => {
    const [activeTab, setActiveTab] = useState<"stories" | "pinned" | "drafts">("stories");
    return (
        <div className="flex-1">
            {/* Profile Picture */}
            <UserInfo />





            {/* Tabs */}
            <ActiveTabs changeTab={setActiveTab} activeTab={activeTab} />




            {/* Content based on active tab */}
            {activeTab === "stories" && (
                <StoriesTab />
            )}





            {activeTab === "pinned" && (
                <PinnedTab />
            )}





            {activeTab === "drafts" && (
                <DraftsTab />
            )}
        </div>
    )
}
export default ProfileDetails