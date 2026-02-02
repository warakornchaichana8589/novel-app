'use client';

import { useState } from 'react';
import { Layout, Button, Input, Space, Typography, Badge, Avatar, Dropdown } from 'antd';
import {
  Search,
  Plus,
  User,
  LogOut,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { LoginModal } from './login-modal';
import { useQueryClient } from '@tanstack/react-query';

const { Header } = Layout;
const { Title, Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function MainLayout({ children, onSearch, searchQuery = '' }: MainLayoutProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const queryClient = useQueryClient();

  const handleLogin = (username: string, password: string): boolean => {
    // Mock authentication
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setUser({ username });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    onSearch?.(value);
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'โปรไฟล์',
      icon: <User className="w-4 h-4" />,
    },
    {
      key: 'logout',
      label: 'ออกจากระบบ',
      icon: <LogOut className="w-4 h-4" />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header className="bg-white shadow-sm sticky top-0 z-50 px-4 sm:px-6 lg:px-8 h-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <Title level={4} className="!text-xl !mb-0 hidden sm:block">
              NovelHub
            </Title>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <Input
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              placeholder="ค้นหานิยาย..."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="w-full"
            />
          </div>

          {/* Right Side Actions */}
          <Space className="hidden md:flex">
            {isAuthenticated ? (
              <>
                <Link href="/admin">
                  <Button type="primary" icon={<Plus className="w-4 h-4" />}>
                    เขียนนิยาย
                  </Button>
                </Link>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <Button type="text" className="flex items-center gap-2">
                    <Avatar size="small" icon={<User className="w-4 h-4" />} />
                    <span>{user?.username}</span>
                  </Button>
                </Dropdown>
              </>
            ) : (
              <Button onClick={() => setIsLoginOpen(true)}>
                เข้าสู่ระบบ
              </Button>
            )}
          </Space>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            className="md:hidden"
            icon={mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
            <Input
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              placeholder="ค้นหานิยาย..."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link href="/admin" className="block">
                  <Button type="primary" block icon={<Plus className="w-4 h-4" />}>
                    เขียนนิยาย
                  </Button>
                </Link>
                <Button block onClick={handleLogout}>
                  ออกจากระบบ
                </Button>
              </div>
            ) : (
              <Button block onClick={() => setIsLoginOpen(true)}>
                เข้าสู่ระบบ
              </Button>
            )}
          </div>
        )}
      </Header>

      <main>{children}</main>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
