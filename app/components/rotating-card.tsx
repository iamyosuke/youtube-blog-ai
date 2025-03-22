"use client";

import Link from "next/link";
import Image from "next/image";
import { YouTubeService } from "@/app/(server)/services/youtube";
import type { Article } from "@/lib/types";

interface RotatingCardProps {
    article: Article;
    index: number;
    total: number;
}

export const RotatingCard = ({ article, index, total }: RotatingCardProps) => {
    return (
        <div
            className="w-[clamp(160px,15vw,200px)]"
            style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.3s ease-out',
            }}
        >
            <div className="w-full overflow-hidden backdrop-blur-md bg-gradient-to-b from-orange-50/80 to-orange-100/10 border border-orange-200/20 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <Link href={`/articles/${article.id}`}>
                    <div className="relative aspect-video">
                        <Image
                            src={YouTubeService.getThumbnailUrl(
                                article.videoId
                            )}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="280px"
                            priority={false}
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                            {article.title}
                        </h3>
                    </div>
                </Link>
            </div>
        </div>
    );
};
