'use client';

import { RotatingCard } from './rotating-card';
import Image from 'next/image';
import Link from 'next/link';
import { YouTubeService } from '@/app/(server)/services/youtube';
import type { Article } from '@/lib/types';

interface RotatingCardsContainerProps {
  articles: Article[];
}

export const RotatingCardsContainer = ({ articles }: RotatingCardsContainerProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="whitespace-nowrap py-8 px-4">
        {articles.map((article, index) => (
          <RotatingCard
            index={index}
            total={articles.length}
            article={article}
          />
        ))}
      </div>
    </div>
  );
};
