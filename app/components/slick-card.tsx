"use client";

import Link from "next/link";
import Image from "next/image";
import { YouTubeService } from "@/app/(server)/services/youtube";
import type { Article } from "@/lib/types";

interface SlickCardProps {
    article: Article;
}

export const SlickCard = ({ article }: SlickCardProps) => {
    return (
        <div className="w-full px-2 transform transition-all duration-300">
            <div className="w-[200px] overflow-hidden backdrop-blur-md bg-gradient-to-b from-orange-50/80 to-orange-100/10 border border-orange-200/20 rounded-lg shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Link href={`/articles/${article.id}`}>
                    <div className="relative" style={{ aspectRatio: '16/9' }}>
                        <Image
                            src={YouTubeService.getThumbnailUrl(
                                article.videoId
                            )}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 320px, (max-width: 1024px) 360px, 400px"
                            priority={true}
                            quality={100}
                        />
                    </div>
                    <div className="p-2">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                            {article.title}
                        </h3>
                    </div>
                </Link>
            </div>
        </div>
    );
};
