'use client';

import { useInView } from 'react-intersection-observer';
import { FloatingCard } from './floating-card';
import Image from 'next/image';
import Link from 'next/link';
import { YouTubeService } from '@/app/(server)/services/youtube';
import type { Article } from '@/lib/types';

interface FloatingCardsContainerProps {
  articles: Article[];
}

export const FloatingCardsContainer = ({ articles }: FloatingCardsContainerProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 初期配置を計算（均等に分散）
  const calculateInitialPosition = (index: number, total: number) => {
    // コンテナを4x4のグリッドに分割
    const GRID_SIZE = 4;
    const cellSize = 100 / GRID_SIZE;
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    
    // グリッドセル内でのランダムな位置
    const x = cellSize * col + cellSize / 2 + (Math.random() - 0.5) * 10;
    const y = cellSize * row + cellSize / 2 + (Math.random() - 0.5) * 10;
    
    return {
      initialX: x,
      initialY: y,
      zIndex: index + 1,
    };
  };

  return (
    <div 
      ref={ref}
      className="relative w-full bg-gradient-to-b from-orange-50/50 to-white/30"
      style={{
        height: '800px',
        margin: '2rem auto',
        padding: '2rem',
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    >
      {articles.map((article, index) => {
        const position = calculateInitialPosition(index, articles.length);
        return (
          <div
            key={article.id}
            style={{
              position: 'absolute',
              left: `${position.initialX}%`,
              top: `${position.initialY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <FloatingCard 
              delay={index * 0.3}
              safeArea={{
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
              }}
              baseZIndex={position.zIndex}
            >
              <Link 
                href={`/articles/${article.id}`} 
                className="block w-[250px] overflow-hidden backdrop-blur-md bg-gradient-to-b from-orange-50/80 to-orange-100/10 border border-orange-200/20 rounded-xl shadow-lg transition-opacity hover:opacity-90"
              >
                <div className="relative aspect-video">
                  <Image
                    src={YouTubeService.getThumbnailUrl(article.videoId)}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="250px"
                    priority={false}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </Link>
            </FloatingCard>
          </div>
        );
      })}
    </div>
  );
};
