'use client';

import { useInView } from 'react-intersection-observer';
import { FloatingCard } from './floating-card';
import Image from 'next/image';
import Link from 'next/link';
import { YouTubeService } from '@/app/(server)/services/youtube';
import type { Article } from '@/lib/types';
import { useState, useCallback } from 'react';

interface FloatingCardsContainerProps {
  articles: Article[];
}

interface CardPosition {
  x: number;
  y: number;
}

export const FloatingCardsContainer = ({ articles }: FloatingCardsContainerProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [cardPositions, setCardPositions] = useState<Record<string, CardPosition>>({});

  // 衝突検出
  const checkCollision = (
    id: string,
    newPosition: CardPosition,
    threshold: number = 200
  ): boolean => {
    for (const [otherId, otherPosition] of Object.entries(cardPositions)) {
      if (otherId === id) continue;

      const distance = Math.sqrt(
        Math.pow(newPosition.x - otherPosition.x, 2) +
        Math.pow(newPosition.y - otherPosition.y, 2)
      );

      if (distance < threshold) {
        return true;
      }
    }
    return false;
  };

  // カード位置の更新
  const handlePositionUpdate = useCallback((id: string, position: CardPosition) => {
    setCardPositions(prev => ({
      ...prev,
      [id]: position
    }));
  }, []);

  // 初期配置を計算（グリッドベース）
  const calculateInitialPosition = useCallback((index: number, total: number) => {
    const SAFE_MARGIN = 200;
    const gridSize = Math.ceil(Math.sqrt(total));
    const cellWidth = (100 - (SAFE_MARGIN / 8)) / gridSize;
    const gridX = index % gridSize;
    const gridY = Math.floor(index / gridSize);
    
    const x = SAFE_MARGIN/16 + cellWidth * gridX + (cellWidth * 0.5);
    const y = SAFE_MARGIN/16 + cellWidth * gridY + (cellWidth * 0.5);
    
    return {
      initialX: x,
      initialY: y,
      zIndex: index,
    };
  }, []);

  return (
    <div 
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '1000px',
        padding: '150px',
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
              zIndex: position.zIndex,
            }}
          >
            <FloatingCard 
              id={article.id}
              delay={index * 0.2}
              safeArea={{
                top: 150,
                bottom: 150,
                left: 150,
                right: 150
              }}
              baseZIndex={position.zIndex}
              onPositionUpdate={handlePositionUpdate}
            >
              <Link 
                href={`/articles/${article.id}`} 
                className="block w-[280px] overflow-hidden backdrop-blur-md bg-gradient-to-b from-orange-50/80 to-orange-100/10 border border-orange-200/20 rounded-xl shadow-lg transition-opacity hover:opacity-90"
              >
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
            </FloatingCard>
          </div>
        );
      })}
    </div>
  );
};
