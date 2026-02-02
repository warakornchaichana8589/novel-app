# Backend API Requirements

เอกสารสำหรับ Backend Developer ในการสร้าง API รองรับระบบ Novel Publishing Platform

## 🎯 ภาพรวมระบบ

ระบบต้องรองรับ:
- การจัดการนิยาย (CRUD)
- การจัดการหมวดหมู่
- ระบบ Authentication (Admin)
- การนับยอดวิว
- การค้นหาและกรองข้อมูล

## 📡 API Endpoints

### 1. Stories API

#### GET /api/stories
ดึงรายการนิยายทั้งหมด

**Query Parameters:**
```typescript
{
  category?: string;    // กรองตาม slug หมวดหมู่
  search?: string;      // ค้นหาจาก title, author, description
  page?: number;        // หน้าปัจจุบัน (default: 1)
  limit?: number;       // จำนวนต่อหน้า (default: 20, max: 100)
  sortBy?: 'createdAt' | 'updatedAt' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": "string",
        "title": "string",
        "author": "string",
        "description": "string",
        "category": "string",
        "tags": ["string"],
        "coverImage": "string (URL)",
        "createdAt": "ISO date string",
        "updatedAt": "ISO date string",
        "views": 1234
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### GET /api/stories/:id
ดึงข้อมูลนิยายรายเล่ม (พร้อมเนื้อหาเต็ม)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "author": "string",
    "description": "string",
    "content": "string (full content)",
    "category": "string",
    "tags": ["string"],
    "coverImage": "string (URL)",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string",
    "views": 1234
  }
}
```

**Side Effect:** ควรเพิ่ม view count ทุกครั้งที่เรียก API นี้ (rate limited)

#### POST /api/stories
สร้างนิยายใหม่ (Admin only)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (required, min: 1, max: 200)",
  "author": "string (required, max: 100)",
  "description": "string (required, max: 500)",
  "content": "string (required)",
  "category": "string (required, valid category slug)",
  "tags": ["string"],
  "coverImage": "string (URL, optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    // ... all story fields
  },
  "message": "Story created successfully"
}
```

#### PUT /api/stories/:id
อัพเดทนิยาย (Admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (same as POST, all fields optional except in requirements)

**Response:** คืนค่า story ที่อัพเดทแล้ว

#### DELETE /api/stories/:id
ลบนิยาย (Admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Story deleted successfully"
}
```

### 2. Categories API

#### GET /api/categories
ดึงรายการหมวดหมู่ทั้งหมด

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "storyCount": 12
    }
  ]
}
```

**Note:** `storyCount` ควรเป็น computed field หรือ update ทุกครั้งที่สร้าง/ลบ story

#### POST /api/categories
สร้างหมวดหมู่ใหม่ (Admin only)

**Request Body:**
```json
{
  "name": "string (required)",
  "slug": "string (required, unique, URL-friendly)",
  "description": "string (optional)"
}
```

### 3. Authentication API

#### POST /api/auth/login
เข้าสู่ระบบ

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "role": "admin"
    },
    "token": "JWT token string"
  }
}
```

#### POST /api/auth/logout
ออกจากระบบ (Optional - ถ้าใช้ token blacklist)

**Headers:**
```
Authorization: Bearer <token>
```

#### GET /api/auth/me
ดึงข้อมูลผู้ใช้ปัจจุบัน

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "role": "admin"
  }
}
```

## 🗄️ Database Schema

### Stories Table
```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  tags TEXT[], -- Array of strings
  cover_image VARCHAR(500),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stories_category ON stories(category_id);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_stories_views ON stories(views DESC);
-- Full-text search index (PostgreSQL)
CREATE INDEX idx_stories_search ON stories USING gin(to_tsvector('thai', title || ' ' || description));
```

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
```

### Users Table (Admin only)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security Requirements

### Authentication
- ใช้ JWT (JSON Web Tokens)
- Token มีอายุ 24 ชั่วโมง (หรือตามที่กำหนด)
- เก็บ password ด้วย bcrypt (cost factor 10-12)
- ตรวจสอบ token ทุก endpoint ที่ต้องการ auth

### Authorization
- Middleware ตรวจสอบ role ก่อนเข้าถึง admin endpoints
- Return 401 ถ้าไม่มี token
- Return 403 ถ้า role ไม่ถูกต้อง

### Rate Limiting
- Public endpoints: 100 requests/minute
- Auth endpoints: 10 requests/minute (ป้องกัน brute force)
- Story view increment: 1 time/5 minutes per IP

### Input Validation
- Validate ทุก input ด้วย schema (zod, joi, หรือ class-validator)
- Sanitize HTML content (ถ้ามี rich text editor)
- Limit content length (ป้องกัน DoS)
- Validate file uploads (type, size)

## 📊 Caching Strategy

### Redis Cache Keys
```
stories:list:{category}:{search}:{page}:{limit}  # 5 นาที
stories:detail:{id}                               # 10 นาที
categories:all                                    # 1 ชั่วโมง
```

### Cache Invalidation
- Clear stories:list:* เมื่อสร้าง/แก้ไข/ลบ story
- Clear stories:detail:{id} เมื่อแก้ไข story

## 🚀 Performance Optimization

### Database
- ใช้ connection pooling
- Add indexes ตาม query patterns
- Pagination ด้วย cursor-based (ถ้ามีข้อมูลมาก)

### API Response
- Compress responses (gzip/brotli)
- Use HTTP/2
- Return only necessary fields

### File Storage
- ใช้ CDN สำหรับ images (Cloudinary, AWS CloudFront)
- Optimize images (WebP format, multiple sizes)

## 🧪 Testing

### Unit Tests
- Test ทุก endpoint handler
- Test validation logic
- Test auth middleware

### Integration Tests
- Test การทำงานร่วมกับ database
- Test authentication flow

### Load Tests
- Test concurrent requests
- Test การโหลด stories จำนวนมาก

## 📋 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` - Input ไม่ถูกต้อง
- `AUTHENTICATION_ERROR` - ไม่มี token หรือ token หมดอายุ
- `AUTHORIZATION_ERROR` - ไม่มี permission
- `NOT_FOUND` - ไม่พบ resource
- `RATE_LIMIT_ERROR` - เรียก API ถี่เกินไป
- `INTERNAL_ERROR` - Server error

## 🔧 Recommended Tech Stack

### Option 1: Node.js + Express
- **Runtime:** Node.js 20+
- **Framework:** Express.js / Fastify / NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma / TypeORM
- **Auth:** jsonwebtoken + bcrypt
- **Validation:** Zod
- **Cache:** Redis

### Option 2: Serverless
- **Platform:** Vercel Functions / AWS Lambda
- **Database:** Supabase / PlanetScale (MySQL)
- **Auth:** Supabase Auth / Clerk
- **Storage:** Cloudinary / AWS S3

### Option 3: Full-stack Framework
- **Next.js API Routes** - ถ้าอยู่ในโปรเจคเดียวกัน
- **Database:** Supabase / Prisma + PostgreSQL

## 📚 Documentation Tools

แนะนำใช้:
- **Swagger/OpenAPI** - API Documentation
- **Postman Collection** - สำหรับ testing

---

*อัพเดทล่าสุด: 2 กุมภาพันธ์ 2025*
