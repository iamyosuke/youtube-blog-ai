'use client';

import { motion } from 'framer-motion';
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
  onPositionUpdate?: (id: string, position: { x: number; y: number }) => void;
  id: string;
}

export const FloatingCard = ({ 
  children, 
  delay = 0, 
  safeArea,
  baseZIndex,
  onPositionUpdate,
  id
}: FloatingCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const [controlPoint, setControlPoint] = useState({ x: 0, y: 0 });
  const [animationProgress, setAnimationProgress] = useState(0);

  // 新しい目標点を生成（衝突回避を考慮）
  const generateNewTarget = (attempts: number = 0): { x: number; y: number } => {
    if (attempts > 10) {
      // 10回試行しても衝突を回避できない場合は、現在の位置から小さな移動に制限
      return {
        x: position.x + (Math.random() - 0.5) * 100,
        y: position.y + (Math.random() - 0.5) * 100
      };
    }

    const maxX = window.innerWidth - (safeArea.left + safeArea.right + 300);
    const maxY = window.innerHeight - (safeArea.top + safeArea.bottom + 200);
    
    const newPosition = {
      x: (Math.random() - 0.5) * maxX * 0.8,
      y: (Math.random() - 0.5) * maxY * 0.8
    };

    // 衝突を検出した場合は再試行
    if (onPositionUpdate && !checkCollision(newPosition)) {
      return newPosition;
    }
    
    return generateNewTarget(attempts + 1);
  };

  // 弧を描くための制御点を計算
  const calculateControlPoint = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const perpX = -(end.y - start.y);
    const perpY = end.x - start.x;
    const distance = Math.sqrt(perpX * perpX + perpY * perpY);
    const scale = (Math.random() * 0.5 + 0.3) * 100; // 弧の高さをランダムに調整

    if (distance === 0) return { x: midX, y: midY };

    return {
      x: midX + (perpX / distance) * scale,
      y: midY + (perpY / distance) * scale
    };
  };

  // 衝突検出
  const checkCollision = (pos: { x: number; y: number }): boolean => {
    const COLLISION_THRESHOLD = 300; // 衝突判定の距離
    const currentRect = containerRef.current?.getBoundingClientRect();
    
    if (!currentRect) return false;

    const elements = document.querySelectorAll('.floating-card');
    for (const element of elements) {
      if (element === containerRef.current) continue;

      const rect = element.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow((currentRect.x + pos.x) - rect.x, 2) +
        Math.pow((currentRect.y + pos.y) - rect.y, 2)
      );

      if (distance < COLLISION_THRESHOLD) {
        return true;
      }
    }
    return false;
  };

  // アニメーションの更新
  useEffect(() => {
    const updateAnimation = () => {
      const newTarget = generateNewTarget(0);
      const control = calculateControlPoint(position, newTarget);
      
      setTarget(newTarget);
      setControlPoint(control);
      setAnimationProgress(0);

      if (onPositionUpdate) {
        onPositionUpdate(id, newTarget);
      }
    };

    const initialTimeout = setTimeout(() => {
      updateAnimation();
      const interval = setInterval(updateAnimation, 10000); // より長いインターバル
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(initialTimeout);
  }, [delay, id, onPositionUpdate, position]);

  const animatedPosition = {
    x: position.x + 
       (controlPoint.x - position.x) * Math.sin(animationProgress * Math.PI) * (1 - animationProgress) +
       (target.x - position.x) * (Math.sin(animationProgress * Math.PI / 2)),
    y: position.y + 
       (controlPoint.y - position.y) * Math.sin(animationProgress * Math.PI) * (1 - animationProgress) +
       (target.y - position.y) * (Math.sin(animationProgress * Math.PI / 2))
  };

  useEffect(() => {
    const animate = () => {
      setAnimationProgress(prev => {
        const newProgress = prev + 0.002; // アニメーションの速度を遅く
        if (newProgress >= 1) {
          setPosition(target);
          return 0;
        }
        return newProgress;
      });
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, animationProgress]);

  return (
    <motion.div
      ref={containerRef}
      className="floating-card"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        x: animatedPosition.x,
        y: animatedPosition.y,
        transition: { 
          opacity: { duration: 0.5 },
          x: { duration: 0.1, ease: [0.4, 0.0, 0.2, 1], type: "tween" },
          y: { duration: 0.1, ease: [0.4, 0.0, 0.2, 1], type: "tween" }
        }
      }}
      style={{
        zIndex: baseZIndex
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
