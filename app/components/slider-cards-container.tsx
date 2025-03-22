'use client';

import React from 'react';
import Slider from 'react-slick';
import type { Article } from '@/lib/types';
import { SlickCard } from './slick-card';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

interface SliderCardsContainerProps {
  articles: Article[];
}

export const SliderCardsContainer: React.FC<SliderCardsContainerProps> = ({ articles }) => {
  const settings = {
    dots: false,
    speed: 3000,
    autoplaySpeed: 0,
    slidesToShow: 5,
    autoplay: true,
    pauseOnHover: false,
    centerMode: false,
    centerPadding: "0",
    cssEase: "linear",
    variableWidth: false,
    swipe: false,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          speed: 6000,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          speed: 6000,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          speed: 6000,
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 overflow-hidden">
      <div className="carousel-container">
        <Slider {...settings}>
          {[...articles, ...articles].map((article, index) => (
            <SlickCard key={`${article.id}-${index}`} article={article} />
          ))}
        </Slider>
      </div>
    </div>
  );
};
