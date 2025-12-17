"use client";

import Image from "next/image";

export default function CommentCard() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
          <Image
            src="/images/profile.png" // replace with real image
            alt="User avatar"
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-gray-900">
              Annie Kapur
            </span>
            <span className="text-sm text-gray-500">
              about 2 hours ago
            </span>
          </div>

          {/* Comment Bubble */}
          <div className="mt-4 rounded-xl bg-white p-4 text-gray-800">
            <p className="leading-relaxed text-gray-500">
              Oh this is so damn good. Never ever apologise! I've been through being fat and I've been through being unhealthily thin and I'm more just thin‑to‑average now and it's a wonder how different people treat you when you fit into societal beauty standards. It's honestly pathetic. I love the battle cry of this poem, one of the best I've read in a while...
            </p>

            <button className="mt-3 text-sm font-medium text-gray-600 hover:underline">
              Read more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
