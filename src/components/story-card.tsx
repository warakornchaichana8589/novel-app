'use client';

import { Card, Tag, Typography, Badge } from 'antd';
import { Eye, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { Story } from '@/lib/types';

const { Title, Text, Paragraph } = Typography;

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <Link href={`/stories/${story.id}`} className="block h-full">
      <Card
        hoverable
        className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg"
        cover={
          story.coverImage ? (
            <div className="relative h-48 overflow-hidden">
              <img
                alt={story.title}
                src={story.coverImage}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <Badge
                count={`${formatViews(story.views)} อ่าน`}
                className="absolute bottom-2 right-2"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">{story.title[0]}</span>
            </div>
          )
        }
      >
        <div className="space-y-3">
          <Title level={4} className="!text-lg !mb-0 line-clamp-2">
            {story.title}
          </Title>

          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {story.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(story.createdAt)}
            </span>
          </div>

          <Paragraph
            ellipsis={{ rows: 2 }}
            className="!text-gray-600 !mb-0"
          >
            {story.description}
          </Paragraph>

          <div className="flex flex-wrap gap-2 pt-2">
            {story.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} className="text-xs">
                {tag}
              </Tag>
            ))}
            {story.tags.length > 3 && (
              <Tag className="text-xs">+{story.tags.length - 3}</Tag>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
