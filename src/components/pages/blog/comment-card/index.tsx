"use client";

import Image from "next/image";

interface CommentCardProps {
  comment: {
    author: {
      name: string;
      image: string;
    };
    content: string;
    createdAt: string;
  };
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200 shrink-0">
          <Image
            src={comment.author.image || "/images/profile.png"}
            alt={comment.author.name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-gray-900">
              {comment.author.name}
            </span>
            <span className="text-sm text-gray-500">
              {comment.createdAt}
            </span>
          </div>

          {/* Comment Bubble */}
          <div className="mt-4 rounded-xl bg-white p-4 text-gray-800 border">
            <p className="leading-relaxed text-gray-600">
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
