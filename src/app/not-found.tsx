import Link from 'next/link';
import { BookOpen, Home, Search } from 'lucide-react';
import { Button } from 'antd';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="w-40 h-40 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-200">
            <BookOpen className="w-20 h-20 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-gray-800">404</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          ไม่พบหน้านี้
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-2">
          โอ๊ะ! ดูเหมือนว่าหน้าที่คุณกำลังหาจะไม่มีอยู่
        </p>
        <p className="text-gray-500 mb-8">
          อาจจะถูกย้าย ลบ หรือ URL ผิดพลาด
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button
              type="primary"
              size="large"
              icon={<Home className="w-5 h-5" />}
              className="bg-gradient-to-r from-purple-600 to-pink-500 border-0 rounded-full h-12 px-8"
            >
              กลับหน้าหลัก
            </Button>
          </Link>
          
          <Link href="/">
            <Button
              size="large"
              icon={<Search className="w-5 h-5" />}
              className="rounded-full h-12 px-8"
            >
              ค้นหานิยาย
            </Button>
          </Link>
        </div>

        {/* Suggested Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-4">หรือลองดูหน้าเหล่านี้:</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'นิยายรัก', href: '/?category=romance' },
              { label: 'แฟนตาซี', href: '/?category=fantasy' },
              { label: 'สืบสวน', href: '/?category=mystery' },
              { label: 'ทั้งหมด', href: '/' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 hover:text-purple-600 hover:shadow-md transition-all border border-gray-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
