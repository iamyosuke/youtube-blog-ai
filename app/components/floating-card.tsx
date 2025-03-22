'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useRef } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  baseZIndex: number;
}

export const FloatingCard = ({ 
  children, 
  delay = 0, 
  safeArea,
  baseZIndex 
}: FloatingCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [randomValues] = useState(() => {
    const generateRandomPoint = () => {
      // コンテナのサイズを考慮して移動範囲を制限
      const maxX = window.innerWidth - (safeArea.left + safeArea.right + 300); // カードの幅を考慮
      const maxY = window.innerHeight - (safeArea.top + safeArea.bottom + 200); // カードの高さを考慮
      
      return {
        x: (Math.random() - 0.5) * maxX * 0.8, // 80%の範囲で制限
        y: (Math.random() - 0.5) * maxY * 0.8
      };
    };

    return {
      duration: 15 + Math.random() * 10,
      initialDelay: delay + Math.random() * 3,
      points: Array(4).fill(0).map(generateRandomPoint)
    };
  });

  const floatingAnimation = {
    initial: { 
      opacity: 0,
      x: 0,
      y: 0
    },
    animate: {
      opacity: 1,
      x: randomValues.points.map(p => p.x),
      y: randomValues.points.map(p => p.y),
      transition: {
        delay: randomValues.initialDelay,
        duration: randomValues.duration,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="floating-card"
      variants={floatingAnimation}
      initial="initial"
      animate="animate"
      style={{
        zIndex: baseZIndex
      }}
      whileHover={{
        scale: 1.05,
        zIndex: 999, // 最前面に表示
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};
