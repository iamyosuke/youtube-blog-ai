'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RotatingCardProps {
  children: ReactNode;
  index: number;
  total: number;
}

export const RotatingCard = ({ children, index, total }: RotatingCardProps) => {
  // カードの位置を計算（円周上に均等に配置）
  const angle = (index / total) * 360;
  const radius = 400; // 回転の半径

  return (
    <motion.div
      className="absolute"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        backfaceVisibility: 'hidden',
      }}
      whileHover={{
        scale: 1.05,
        zIndex: 10,
        transition: {
          duration: 0.3,
        },
      }}
    >
      <div className="w-[280px] overflow-hidden backdrop-blur-md bg-gradient-to-b from-orange-50/80 to-orange-100/10 border border-orange-200/20 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        {children}
      </div>
    </motion.div>
  );
};
