import { Container, Skeleton } from "@shared";

const ProfileSkeleton = () => {
    return (
        <section>
            <div className="pb-[50px]">
                {/* Banner Skeleton */}
                <div className="relative h-60 w-full overflow-hidden">
                    <Skeleton className="w-full h-full" />
                </div>

                {/* Profile Section Skeleton */}
                <Container>
                    <div className="w-full mx-auto px-6 -mt-16 relative z-10">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Left Column - Profile Info Skeleton */}
                            <div className="w-full md:flex-1">
                                <div className="mb-6 items-end">
                                    <Skeleton className="w-32 h-32 rounded-full border-4 border-white shadow-md" />
                                    <div className="ml-4 mt-[20px] pb-2">
                                        <Skeleton className="w-48 h-10 mb-[20px]" />
                                        <div className="flex items-center space-x-4">
                                            <Skeleton className="w-32 h-6" />
                                            <Skeleton className="w-32 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <Skeleton className="w-full h-20" />
                                </div>
                                <div className="flex border-b border-gray-200 mb-6">
                                    <Skeleton className="w-24 h-10 mr-8" />
                                    <Skeleton className="w-24 h-10 mr-8" />
                                    <Skeleton className="w-24 h-10" />
                                </div>
                            </div>

                            {/* Right Column - Sidebar Skeleton */}
                            <div className="w-full sticky top-0 md:w-72 mt-8 md:mt-16">
                                <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
                                    <Skeleton className="w-32 h-6 mb-2" />
                                    <Skeleton className="w-full h-12 mb-4" />
                                    <Skeleton className="w-full h-10 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    );
};

export default ProfileSkeleton;
