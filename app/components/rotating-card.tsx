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
            className="w-[clamp(140px,15vw,200px)]"
            style={{
                transformStyle: 'flat',
                transition: 'transform 0.3s ease-out',
                backfaceVisibility: 'hidden',
                willChange: 'transform',
            }}
        >
            <div className="w-full overflow-hidden backdrop-blur-md bg-gradient-to-b from-orange-50/80 to-orange-100/10 border border-orange-200/20 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl [backface-visibility:hidden] [transform-style:preserve-3d]">
                <Link href={`/articles/${article.id}`}>
                    <div className="relative" style={{ aspectRatio: '2/1' }}>
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
                    <div className="py-1.5 px-2">
                        <h3 className="text-xs font-medium text-gray-800 antialiased subpixel-antialiased tracking-tight [text-rendering:optimizeLegibility]" style={{ transform: 'translateZ(0)' }}>
                            {article.title}
                        </h3>
                    </div>
                </Link>
            </div>
        </div>
    );
};
