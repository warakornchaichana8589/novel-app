'use client';

import { Menu, Badge, Skeleton } from 'antd';
import { BookOpen, Layers } from 'lucide-react';
import { useCategories } from '@/hooks/use-stories';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  const menuItems = [
    {
      key: 'all',
      icon: <BookOpen className="w-4 h-4" />,
      label: (
        <span className="flex items-center justify-between w-full">
          ทั้งหมด
          <Badge count={categories?.reduce((acc, cat) => acc + cat.storyCount, 0) || 0} 
                 style={{ backgroundColor: '#1890ff' }} />
        </span>
      ),
    },
    ...(categories?.map((cat) => ({
      key: cat.slug,
      icon: <Layers className="w-4 h-4" />,
      label: (
        <span className="flex items-center justify-between w-full">
          {cat.name}
          <Badge count={cat.storyCount} style={{ backgroundColor: '#8c8c8c' }} />
        </span>
      ),
    })) || []),
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          หมวดหมู่
        </h3>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedCategory]}
        onClick={({ key }) => onSelectCategory(key)}
        items={menuItems}
        className="border-0"
      />
    </div>
  );
}
