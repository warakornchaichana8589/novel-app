'use client';

import { useState, useRef } from 'react';
import { Typography, Row, Col, Empty, Spin, Badge } from 'antd';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/main-layout';
import { StoryCard } from '@/components/story-card';
import { CategoryFilter } from '@/components/category-filter';
import { useStories, useCategories } from '@/hooks/use-stories';
import { mockStories } from '@/lib/mock-data';

const { Title, Text } = Typography;

// Instagram-style Stories/Highlights Component
function StoryHighlights({ 
  selectedCategory, 
  onSelectCategory 
}: { 
  selectedCategory: string; 
  onSelectCategory: (cat: string) => void;
}) {
  const { data: categories } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  const allCategories = [{ id: 'all', name: 'ทั้งหมด', slug: 'all' }, ...(categories || [])];

  return (
    <div className="relative mb-6">
      {/* Gradient Overlays */}
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      )}
      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Scroll Arrows */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Stories Container */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onSelectCategory(cat.slug)}
            className="flex flex-col items-center gap-2 min-w-[72px]"
          >
            <div 
              className={`w-[72px] h-[72px] rounded-full p-[3px] transition-all duration-300 ${
                selectedCategory === cat.slug 
                  ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' 
                  : 'bg-gray-200'
              }`}
            >
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"
                >
                  <span className="text-2xl">
                    {cat.name[0]}
                  </span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${
              selectedCategory === cat.slug ? 'text-purple-600' : 'text-gray-600'
            }`}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Featured Stories Carousel
function FeaturedStories() {
  const featured = mockStories.slice(0, 3);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="font-semibold text-gray-800">นิยายแนะนำ</h3>
        <button className="text-sm text-purple-600 font-medium">ดูทั้งหมด</button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {featured.map((story, idx) => (
          <a 
            key={story.id}
            href={`/stories/${story.id}`}
            className="relative flex-shrink-0 w-[280px] h-[160px] rounded-2xl overflow-hidden group"
          >
            <img 
              src={story.coverImage} 
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge 
                count={`#${idx + 1}`} 
                className="mb-2"
                style={{ backgroundColor: idx === 0 ? '#f59e0b' : idx === 1 ? '#6b7280' : '#92400e' }}
              />
              <h4 className="text-white font-semibold line-clamp-1">{story.title}</h4>
              <p className="text-white/80 text-sm">{story.author}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: stories, isLoading, error } = useStories({
    category: selectedCategory,
    search: searchQuery,
  });

  return (
    <MainLayout onSearch={setSearchQuery} searchQuery={searchQuery}>
      <div className="min-h-screen bg-white md:bg-gray-50">
        {/* Mobile View */}
        <div className="md:hidden">
          {/* Category Stories */}
          <StoryHighlights 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Featured Stories */}
          {!searchQuery && selectedCategory === 'all' && <FeaturedStories />}

          {/* Content */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                {searchQuery ? `ผลการค้นหา "${searchQuery}"` : 
                 selectedCategory !== 'all' ? 'นิยายในหมวดหมู่' : 'นิยายล่าสุด'}
              </h3>
              <span className="text-sm text-gray-500">{stories?.length || 0} เรื่อง</span>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spin size="large" />
              </div>
            ) : error ? (
              <Empty description="เกิดข้อผิดพลาด" className="py-12" />
            ) : stories?.length === 0 ? (
              <Empty
                image={<BookOpen className="w-16 h-16 text-gray-300 mx-auto" />}
                description={searchQuery ? 'ไม่พบนิยาย' : 'ยังไม่มีนิยาย'}
                className="py-12"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-24">
                {stories?.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Title level={1} className="!text-3xl sm:!text-4xl !mb-4">
              ยินดีต้อนรับสู่ NovelHub
            </Title>
            <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
              แหล่งรวมนิยายคุณภาพ อ่านฟรี อัพเดทใหม่ทุกวัน
              <br />
              ครบทุกรส ทั้งรักโรแมนติก แฟนตาซี สืบสวน และอีกมากมาย
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {/* Sidebar */}
            <Col xs={24} lg={6}>
              <div className="sticky top-24">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            </Col>

            {/* Main Content */}
            <Col xs={24} lg={18}>
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Spin size="large" />
                </div>
              ) : error ? (
                <Empty
                  description="เกิดข้อผิดพลาดในการโหลดข้อมูล"
                  className="py-20"
                />
              ) : stories?.length === 0 ? (
                <Empty
                  image={<BookOpen className="w-16 h-16 text-gray-300 mx-auto" />}
                  description={
                    searchQuery
                      ? `ไม่พบนิยายที่ตรงกับ "${searchQuery}"`
                      : 'ยังไม่มีนิยายในหมวดหมู่นี้'
                  }
                  className="py-20"
                />
              ) : (
                <Row gutter={[24, 24]}>
                  {stories?.map((story) => (
                    <Col key={story.id} xs={24} sm={12} xl={8}>
                      <StoryCard story={story} />
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </MainLayout>
  );
}
