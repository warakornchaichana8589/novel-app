# Frontend Implementation Guide

เอกสารสำหรับ Frontend Developer ในการพัฒนาให้ระบบพร้อมใช้งานจริง

## 📋 สิ่งที่ทำเสร็จแล้ว

### ✅ UI Components
- [x] MainLayout - Header, Search, Navigation, Login Modal
- [x] StoryCard - การ์ดแสดงนิยายพร้อม Cover Image
- [x] StoryForm - ฟอร์มสร้าง/แก้ไขนิยาย
- [x] ReadingViewer - หน้าอ่านนิยายพร้อม Theme Settings
- [x] CategoryFilter - Sidebar กรองหมวดหมู่
- [x] LoginModal - Modal สำหรับ Admin Login

### ✅ Pages
- [x] Home Page - หน้าแรกแสดงรายการนิยาย
- [x] Story Detail Page - หน้าอ่านนิยาย
- [x] Admin Dashboard - หน้าจัดการนิยาย

### ✅ State Management
- [x] TanStack Query Setup
- [x] Custom Hooks (useStories, useStory, useCreateStory, etc.)
- [x] Mock Data สำหรับการพัฒนา

## 🔧 สิ่งที่ต้องทำเพิ่มเติม

### 1. Authentication System

**ปัจจุบัน:** Mock login (username: admin, password: admin123)

**ที่ต้องทำ:**
```typescript
// ต้องเชื่อมต่อกับ Backend API
- POST /api/auth/login - รับ JWT token
- POST /api/auth/logout - ลบ token
- GET /api/auth/me - ดึงข้อมูลผู้ใช้ปัจจุบัน
- เก็บ token ใน httpOnly cookie หรือ localStorage
- สร้าง Protected Route สำหรับ /admin
```

**ไฟล์ที่ต้องแก้ไข:**
- `src/components/login-modal.tsx` - เรียก API จริง
- `src/components/main-layout.tsx` - เช็ค auth state จาก API
- สร้าง `src/middleware.ts` - ป้องกันการเข้าถึง /admin โดยไม่ได้ล็อกอิน

### 2. API Integration

**ปัจจุบัน:** ใช้ Mock Data

**ที่ต้องทำ:** แก้ไข hooks ใน `src/hooks/use-stories.ts`

```typescript
// ตัวอย่างการเรียก API จริง
const fetchStories = async (filters) => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  
  const res = await fetch(`/api/stories?${params}`);
  if (!res.ok) throw new Error('Failed to fetch stories');
  return res.json();
};
```

### 3. Image Upload

**ปัจจุบัน:** ใช้ Unsplash URL

**ที่ต้องทำ:**
- สร้าง Image Upload Component
- เชื่อมต่อกับ Cloud Storage (Cloudinary, AWS S3, หรือ Supabase Storage)
- แสดง Preview ก่อนอัพโหลด

**ไฟล์ที่ต้องแก้ไข:**
- `src/components/story-form.tsx` - เพิ่ม Image Upload

### 4. Error Handling & Loading States

**ที่ต้องทำ:**
- Error Boundary Component
- Skeleton Loading สำหรับทุกหน้า
- Toast notifications สำหรับ success/error
- Retry mechanism สำหรับ failed requests

### 5. SEO & Performance

**ที่ต้องทำ:**
- Open Graph meta tags สำหรับ social sharing
- Sitemap.xml
- robots.txt
- Lazy loading สำหรับ images
- Code splitting สำหรับ heavy components

### 6. Responsive Improvements

**ที่ต้องทำ:**
- ปรับ Reading Viewer สำหรับ mobile ให้ดีขึ้น
- ทำ Pull-to-refresh สำหรับ mobile
- Optimize touch targets

### 7. Features เพิ่มเติม

**ที่ควรมี:**
- Bookmark/Favorite นิยาย
- Reading History
- Comment/Review ระบบ
- Share to Social Media
- Dark Mode (system preference)
- Font customization (font family)
- Text-to-speech (optional)

## 📁 Project Structure ที่แนะนำ

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── stories/
│   │   └── [id]/
│   │       └── page.tsx          # Story detail
│   └── admin/
│       └── page.tsx              # Admin dashboard
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── providers.tsx             # QueryClient provider
│   ├── main-layout.tsx           # Main layout wrapper
│   ├── login-modal.tsx           # Login modal
│   ├── story-card.tsx            # Story card
│   ├── story-form.tsx            # Create/Edit form
│   ├── reading-viewer.tsx        # Reading page
│   └── category-filter.tsx       # Category sidebar
├── hooks/
│   ├── use-stories.ts            # Story data hooks
│   └── use-auth.ts               # Auth hooks (ต้องสร้าง)
├── lib/
│   ├── types.ts                  # TypeScript types
│   ├── api.ts                    # API client (ต้องสร้าง)
│   └── utils.ts                  # Utilities
└── middleware.ts                 # Route protection (ต้องสร้าง)
```

## 🎨 Design System

### Colors
- Primary: #1890ff (Ant Design Blue)
- Success: #52c41a
- Warning: #faad14
- Error: #f5222d
- Background: #f0f2f5

### Typography
- Heading: System font / Noto Sans Thai
- Body: System font / Noto Sans Thai
- Reading: Serif font (for better readability)

### Spacing
- ใช้ Ant Design Grid system (24 columns)
- Standard spacing: 8px, 16px, 24px, 32px, 48px

## 🔌 API Endpoints ที่ต้องใช้

ดูรายละเอียดใน `for-backend.md`

## 📝 Checklist ก่อน Deploy

- [ ] ตั้งค่า Environment Variables (.env.local)
- [ ] ตรวจสอบ Types (TypeScript)
- [ ] รัน Build ทดสอบ (`pnpm build`)
- [ ] ตรวจสอบ Accessibility (a11y)
- [ ] ทดสอบบน Mobile devices
- [ ] ตั้งค่า Analytics (Google Analytics / Vercel Analytics)

## 🚀 Deployment

แนะนำใช้:
- **Vercel** - สำหรับ Next.js (ง่ายที่สุด)
- **Netlify** - Alternative
- **AWS Amplify** - ถ้าใช้ AWS services

---

*อัพเดทล่าสุด: 2 กุมภาพันธ์ 2025*
