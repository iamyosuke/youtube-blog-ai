'use client';

import { motion, useAnimation } from 'framer-motion';
import { ReactNode, useState, useRef, useEffect } from 'react';

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

interface Point {
  x: number;
  y: number;
}

export const FloatingCard = ({ 
  children, 
  delay = 0, 
  safeArea,
  baseZIndex 
}: FloatingCardProps) => {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPos = useRef<Point>({ x: 0, y: 0 });
  const targetPos = useRef<Point>({ x: 0, y: 0 });

  // ランダムな目標地点を生成
  const generateNewTarget = () => {
    const maxX = window.innerWidth - (safeArea.left + safeArea.right + 300);
    const maxY = window.innerHeight - (safeArea.top + safeArea.bottom + 200);
    
    return {
      x: (Math.random() - 0.5) * maxX * 0.7,
      y: (Math.random() - 0.5) * maxY * 0.7
    };
  };

  // 次の移動を計算して実行
  const moveToNextPoint = async () => {
    const newTarget = generateNewTarget();
    targetPos.current = newTarget;

    // 現在位置から新しい目標地点までの中間点を計算
    const midPoint = {
      x: (currentPos.current.x + newTarget.x) / 2,
      y: (currentPos.current.y + newTarget.y) / 2 - 100 - Math.random() * 100 // 上に弧を描く
    };

    // アニメーションを実行
    await controls.start({
      x: [currentPos.current.x, midPoint.x, newTarget.x],
      y: [currentPos.current.y, midPoint.y, newTarget.y],
      transition: {
        duration: 5 + Math.random() * 3, // 5-8秒
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    });

    // 現在位置を更新
    currentPos.current = newTarget;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startMovement = async () => {
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
      
      const moveLoop = async () => {
        await moveToNextPoint();
        timeoutId = setTimeout(moveLoop, Math.random() * 1000); // 0-1秒の間隔
      };

      moveLoop();
    };

    startMovement();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [delay]);

  return (
    <motion.div
      ref={containerRef}
      className="floating-card"
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={controls}
      style={{
        zIndex: baseZIndex,
        position: 'relative'
      }}
      whileHover={{
        scale: 1.05,
        zIndex: 999,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};
