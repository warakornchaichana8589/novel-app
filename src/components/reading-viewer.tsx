'use client';

import { useState } from 'react';
import { Typography, Button, Divider, Space, Drawer } from 'antd';
import { ChevronLeft, ChevronRight, List, Settings, Moon, Sun, Type } from 'lucide-react';
import { Story } from '@/lib/types';

const { Title, Text } = Typography;

interface ReadingViewerProps {
  story: Story;
}

type FontSize = 'small' | 'medium' | 'large';
type Theme = 'light' | 'sepia' | 'dark';

export function ReadingViewer({ story }: ReadingViewerProps) {
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [theme, setTheme] = useState<Theme>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  const fontSizeClasses = {
    small: 'text-base leading-relaxed',
    medium: 'text-lg leading-relaxed',
    large: 'text-xl leading-loose',
  };

  const themeClasses = {
    light: 'bg-white text-gray-900',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]',
    dark: 'bg-gray-900 text-gray-100',
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-6 indent-8">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses[theme]}`}>
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-md bg-opacity-90">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            type="text"
            icon={<ChevronLeft className="w-5 h-5" />}
            href="/"
          >
            กลับ
          </Button>

          <Title level={4} className="!text-base !mb-0 truncate max-w-md text-center hidden sm:block">
            {story.title}
          </Title>

          <Space>
            <Button
              type="text"
              icon={<Type className="w-5 h-5" />}
              onClick={() => setShowSettings(true)}
            >
              <span className="hidden sm:inline">ตั้งค่า</span>
            </Button>
          </Space>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article>
          <header className="mb-8 text-center">
            <Title level={1} className="!text-2xl sm:!text-3xl !mb-4">
              {story.title}
            </Title>
            <Text className="text-gray-500">
              โดย {story.author}
            </Text>
          </header>

          <Divider />

          <div className={`${fontSizeClasses[fontSize]} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
            {formatContent(story.content)}
          </div>

          <Divider className="mt-12" />

          {/* Navigation */}
          <div className="flex justify-between items-center py-8">
            <Button
              disabled={currentChapter === 0}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              บทก่อนหน้า
            </Button>

            <Text className="text-gray-500">
              จบเรื่อง
            </Text>

            <Button
              disabled
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="end"
            >
              บทถัดไป
            </Button>
          </div>
        </article>
      </main>

      {/* Settings Drawer */}
      <Drawer
        title="ตั้งค่าการอ่าน"
        placement="right"
        onClose={() => setShowSettings(false)}
        open={showSettings}
        width={320}
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">ธีม</h4>
            <div className="flex gap-2">
              {(['light', 'sepia', 'dark'] as Theme[]).map((t) => (
                <Button
                  key={t}
                  type={theme === t ? 'primary' : 'default'}
                  onClick={() => setTheme(t)}
                  className="flex-1"
                >
                  {t === 'light' && <Sun className="w-4 h-4" />}
                  {t === 'sepia' && 'ซีเปีย'}
                  {t === 'dark' && <Moon className="w-4 h-4" />}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">ขนาดตัวอักษร</h4>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                <Button
                  key={size}
                  type={fontSize === size ? 'primary' : 'default'}
                  onClick={() => setFontSize(size)}
                  className="flex-1"
                >
                  {size === 'small' && 'เล็ก'}
                  {size === 'medium' && 'กลาง'}
                  {size === 'large' && 'ใหญ่'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">ข้อมูล</h4>
            <div className="text-sm text-gray-500 space-y-1">
              <p>ผู้เขียน: {story.author}</p>
              <p>หมวดหมู่: {story.category}</p>
              <p>อ่าน: {story.views.toLocaleString()} ครั้ง</p>
              <p>อัพเดทล่าสุด: {new Date(story.updatedAt).toLocaleDateString('th-TH')}</p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
