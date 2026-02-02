'use client';

import { Badge } from 'antd';
import { Eye, Clock, User, Heart } from 'lucide-react';
import Link from 'next/link';
import { Story } from '@/lib/types';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'เมื่อวาน';
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} สัปดาห์ที่แล้ว`;
    
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  return (
    <Link href={`/stories/${story.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {story.coverImage ? (
            <img
              alt={story.title}
              src={story.coverImage}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center">
              <span className="text-white text-5xl font-bold opacity-80">{story.title[0]}</span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Views Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <Eye className="w-3 h-3" />
            {formatViews(story.views)}
          </div>

          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-0.5 rounded-full border-0"
            >
              {story.category}
            </Badge>
          </div>

          {/* Hover Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="flex items-center gap-1 text-white text-sm">
              <Heart className="w-4 h-4" />
              <span>ถูกใจ</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm md:text-base group-hover:text-purple-600 transition-colors">
            {story.title}
          </h3>

          <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {story.author}
            </span>
          </div>

          <p className="text-gray-600 text-xs line-clamp-2 mb-3 hidden md:block">
            {story.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(story.createdAt)}
            </span>
            
            <div className="flex gap-1">
              {story.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
