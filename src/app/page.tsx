'use client';

import { useState } from 'react';
import { Typography, Row, Col, Empty, Spin, Pagination } from 'antd';
import { BookOpen } from 'lucide-react';
import { MainLayout } from '@/components/main-layout';
import { StoryCard } from '@/components/story-card';
import { CategoryFilter } from '@/components/category-filter';
import { useStories } from '@/hooks/use-stories';

const { Title, Text } = Typography;

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: stories, isLoading, error } = useStories({
    category: selectedCategory,
    search: searchQuery,
  });

  const pageSize = 8;
  const paginatedStories = stories?.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalStories = stories?.length || 0;

  return (
    <MainLayout onSearch={setSearchQuery} searchQuery={searchQuery}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          {/* Sidebar - Category Filter */}
          <Col xs={24} lg={6}>
            <div className="sticky top-24">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
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
            ) : paginatedStories?.length === 0 ? (
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
              <>
                <Row gutter={[24, 24]}>
                  {paginatedStories?.map((story) => (
                    <Col key={story.id} xs={24} sm={12} xl={8}>
                      <StoryCard story={story} />
                    </Col>
                  ))}
                </Row>

                {totalStories > pageSize && (
                  <div className="flex justify-center mt-12">
                    <Pagination
                      current={currentPage}
                      total={totalStories}
                      pageSize={pageSize}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
