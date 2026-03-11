import { Skeleton } from "@shared";

const ArticleSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[250px] lg:h-[230px] xl:h-[200px] rounded-[10px]" />
            <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-3/4 h-8" />
            </div>
            <div className="flex flex-col gap-1">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-1/2 h-4" />
            </div>
            <div className="flex items-center gap-3 mt-4">
                <Skeleton className="h-[40px] w-[40px] rounded-full" />
                <div className="flex flex-col gap-1">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-32 h-3" />
                </div>
            </div>
        </div>
    );
};

export default ArticleSkeleton;
