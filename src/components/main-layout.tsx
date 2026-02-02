'use client';

import { useState } from 'react';
import { Layout, Button, Input, Avatar, Drawer, Badge } from 'antd';
import {
  Search,
  Plus,
  User,
  LogOut,
  BookOpen,
  Heart,
  Compass,
  Home,
  Bell,
  Menu,
  Settings,
  Bookmark,
  Moon,
  Sun,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LoginModal } from './login-modal';

const { Header } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function MainLayout({ children, onSearch, searchQuery = '' }: MainLayoutProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const handleLogin = (username: string, password: string): boolean => {
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
    setDrawerOpen(false);
  };

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    onSearch?.(value);
  };

  const isActive = (path: string) => pathname === path;

  // Bottom Nav Items (Mobile App Style)
  const bottomNavItems = [
    { icon: Home, label: 'หน้าหลัก', path: '/' },
    { icon: Compass, label: 'สำรวจ', path: '/explore' },
    { icon: Plus, label: 'สร้าง', path: '/admin', isSpecial: true },
    { icon: Heart, label: 'กิจกรรม', path: '/activity' },
    { icon: User, label: 'โปรไฟล์', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      {/* Mobile Top Header - Instagram Style */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-gradient bg-gradient-to-r from-purple-600 to-pink-500" style={{ fill: 'url(#gradient)' }} />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              NovelHub
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-6 h-6 text-gray-800" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Heart className="w-6 h-6 text-gray-800" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button 
              onClick={() => setDrawerOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isAuthenticated ? (
                <Avatar size={28} className="bg-gradient-to-r from-purple-500 to-pink-500">
                  {user?.username[0].toUpperCase()}
                </Avatar>
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="px-4 pb-3 border-b border-gray-100 animate-in slide-in-from-top-2">
            <Input
              prefix={<Search className="w-5 h-5 text-gray-400" />}
              placeholder="ค้นหานิยาย..."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="bg-gray-100 border-0 rounded-full"
              size="large"
              autoFocus
            />
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <Header className="hidden md:block bg-white shadow-sm sticky top-0 z-50 px-4 sm:px-6 lg:px-8 h-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              NovelHub
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <Input
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              placeholder="ค้นหานิยาย..."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="bg-gray-100 border-0 rounded-full"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/" className={`p-2 rounded-lg transition-colors ${isActive('/') ? 'text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Home className="w-6 h-6" />
            </Link>
            <Link href="/explore" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Compass className="w-6 h-6" />
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/admin" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Plus className="w-6 h-6" />
                </Link>
                <button 
                  onClick={() => setDrawerOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Avatar size={32} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    {user?.username[0].toUpperCase()}
                  </Avatar>
                </button>
              </>
            ) : (
              <Button 
                type="primary" 
                shape="round"
                onClick={() => setIsLoginOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-500 border-0"
              >
                เข้าสู่ระบบ
              </Button>
            )}
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <main className="md:pt-0 pt-14 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation - Instagram Style */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around h-14">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            if (item.isSpecial) {
              // Create button in the middle
              return (
                <Link 
                  key={item.path}
                  href={isAuthenticated ? item.path : '#'}
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      setIsLoginOpen(true);
                    }
                  }}
                  className="relative -top-5"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                </Link>
              );
            }
            
            return (
              <Link 
                key={item.path}
                href={item.path === '/profile' && !isAuthenticated ? '#' : item.path}
                onClick={(e) => {
                  if (item.path === '/profile' && !isAuthenticated) {
                    e.preventDefault();
                    setIsLoginOpen(true);
                  }
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  active ? 'text-purple-600' : 'text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
              </Link>
            );
          })}
        </div>
        {/* Safe area for iOS */}
        <div className="h-safe-area-inset-bottom bg-white" />
      </nav>

      {/* Profile/Menu Drawer - Instagram Style */}
      <Drawer
        title={null}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={320}
        className="profile-drawer"
      >
        <div className="flex flex-col h-full">
          {/* Profile Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <Avatar size={64} className="bg-gradient-to-r from-purple-500 to-pink-500 text-xl">
              {isAuthenticated ? user?.username[0].toUpperCase() : '?'}
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {isAuthenticated ? user?.username : 'ผู้เยี่ยมชม'}
              </h3>
              <p className="text-gray-500 text-sm">
                {isAuthenticated ? 'ผู้ดูแลระบบ' : 'เข้าสู่ระบบเพื่อใช้งาน'}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 py-4 space-y-1">
            {isAuthenticated && (
              <>
                <Link 
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium">จัดการนิยาย</span>
                </Link>
                
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="font-medium">ที่บุ๊คมาร์คไว้</span>
                </button>

                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="font-medium">การแจ้งเตือน</span>
                  <Badge count={3} className="ml-auto" />
                </button>
              </>
            )}

            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Moon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium">ธีมมืด</span>
            </button>

            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium">ตั้งค่า</span>
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-100 pt-4 space-y-2">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-medium">ออกจากระบบ</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  setDrawerOpen(false);
                  setIsLoginOpen(true);
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">เข้าสู่ระบบ</span>
              </button>
            )}
          </div>
        </div>
      </Drawer>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
