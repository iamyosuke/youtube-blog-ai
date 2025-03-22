'use client';

import { useEffect, useState } from 'react';
import { RotatingCard } from './rotating-card';
import type { Article } from '@/lib/types';

interface RotatingCardsContainerProps {
  articles: Article[];
}

export const RotatingCardsContainer = ({ articles }: RotatingCardsContainerProps) => {
  const [rotation, setRotation] = useState(0);

  // 自動回転のアニメーション
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.15) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // 画面サイズに応じて半径を計算
  const calculateRadius = () => {
    if (typeof window === 'undefined') return 150; // SSR対応
    return Math.min(Math.max(window.innerWidth * 0.175, 150), 250);
  };
  
  const [radius, setRadius] = useState(calculateRadius());

  // 画面サイズ変更時に半径を再計算
  useEffect(() => {
    const handleResize = () => {
      setRadius(calculateRadius());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="w-full h-[clamp(250px,40vh,350px)] overflow-hidden flex items-center justify-center">
      <div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '2000px',
          width: `clamp(600px, 90vw, ${radius * 2}px)`,
          height: `clamp(600px, 90vw, ${radius * 2}px)`,
        }}
      >
        {articles.map((article, index) => {
          const angle = (360 / articles.length) * index + rotation;
          const radian = (angle * Math.PI) / 180;
          const x = Math.sin(radian) * radius;
          const z = Math.cos(radian) * radius;
          
          return (
            <div
              key={article.id}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${angle}deg)`,
                transition: 'transform 0.1s linear',
                zIndex: Math.round(z),
              }}
            >
              <RotatingCard
                index={index}
                total={articles.length}
                article={article}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
