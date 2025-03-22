'use client';

import { motion } from 'framer-motion';
import { RotatingCard } from './rotating-card';
import Image from 'next/image';
import Link from 'next/link';
import { YouTubeService } from '@/app/(server)/services/youtube';
import type { Article } from '@/lib/types';
import { useInView } from 'react-intersection-observer';

interface RotatingCardsContainerProps {
  articles: Article[];
}

export const RotatingCardsContainer = ({ articles }: RotatingCardsContainerProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div 
      ref={ref}
      className="relative w-full h-[800px] overflow-hidden"
      style={{
        perspective: '1500px',
        perspectiveOrigin: 'center'
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {articles.map((article, index) => (
          <RotatingCard
            key={article.id}
            index={index}
            total={articles.length}
          >
            <Link href={`/articles/${article.id}`}>
              <div className="relative aspect-video">
                <Image
                  src={YouTubeService.getThumbnailUrl(article.videoId)}
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
          </RotatingCard>
        ))}
      </motion.div>
    </div>
  );
};
