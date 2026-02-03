"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateFavoriteTopics } from "@/utils/helpers/frontendHelpers";
import { Container } from "@shared";
import { topicsList } from "@/utils/constants/topics";
import { useSession } from "next-auth/react";
import axios from "axios";

const SelectTopicsPage = () => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        const run = async () => {
            if (status === "unauthenticated") {
                router.replace("/signup?callbackUrl=/select-topics");
                return;
            }
            if (status === "authenticated") {
                try {
                    const res = await axios.get("/api/user");
                    const topics = res?.data?.formatedUser?.favoriteTopics || [];
                    if (Array.isArray(topics) && topics.length > 0) {
                        router.replace("/latest-stories");
                    }
                } catch {
                    // If the profile fetch fails for any reason, keep onboarding accessible.
                }
            }
        };
        run();
    }, [status, router]);

    const toggleTopic = (topic: string) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topic));
        } else {
            if (selectedTopics.length < 5) {
                setSelectedTopics([...selectedTopics, topic]);
            }
        }
    };

    const handleContinue = async () => {
        if (selectedTopics.length === 0) return;
        setLoading(true);
        try {
            await updateFavoriteTopics(selectedTopics);
            router.push("/latest-stories");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Container>
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">What are you interested in?</h1>
                    <p className="text-lg text-gray-600 mb-8">Choose up to 5 topics to personalize your feed.</p>

                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {topicsList.map((topic) => (
                            <button
                                key={topic}
                                onClick={() => toggleTopic(topic)}
                                className={`px-6 py-3 rounded-full text-base font-medium transition-colors duration-200 border-2 ${selectedTopics.includes(topic)
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={selectedTopics.length === 0 || loading}
                        className={`px-8 py-4 rounded-xl text-lg font-bold text-white transition-all duration-200 ${selectedTopics.length > 0 && !loading
                            ? "bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Saving..." : "Continue"}
                    </button>
                </div>
            </Container>
        </section>
    );
};

export default SelectTopicsPage;
