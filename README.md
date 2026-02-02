# Novel Publishing Platform

A modern web application for storing and publishing novels/stories built with Next.js 16, Ant Design, TanStack Query, and Tailwind CSS.

## Features

- 📚 **Story Management**: Add, edit, delete novels/stories
- 🏷️ **Categories**: Organize stories by categories
- 📱 **Responsive Reading Experience**: Optimized for both mobile and desktop
- 🔐 **Admin Authentication**: Login system for content management
- 🎨 **Modern UI**: Built with Ant Design + Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Ant Design 6.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: TanStack Query v5
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/
├── page.tsx                 # Home page (story listing)
├── layout.tsx               # Root layout with providers
├── globals.css              # Global styles
├── stories/
│   ├── page.tsx             # Story listing page
│   └── [id]/
│       └── page.tsx         # Story detail/reading page
├── admin/
│   └── page.tsx             # Admin dashboard
├── api/
│   └── stories/
│       ├── route.ts         # GET/POST stories API
│       └── [id]/
│           └── route.ts     # GET/PUT/DELETE single story
├── components/
│   ├── providers.tsx        # QueryClient provider
│   ├── login-modal.tsx      # Admin login modal
│   ├── story-card.tsx       # Story card component
│   ├── story-form.tsx       # Add/Edit story form
│   ├── reading-viewer.tsx   # Story reading component
│   └── category-filter.tsx  # Category filter sidebar
├── hooks/
│   └── use-stories.ts       # TanStack Query hooks
├── lib/
│   ├── mock-data.ts         # Mock data for development
│   └── types.ts             # TypeScript types
└── docs/
    ├── for-frontend.md      # Frontend implementation guide
    └── for-backend.md       # Backend API requirements
```

## Mock Data

Default admin credentials:
- **Username**: `admin`
- **Password**: `admin123`

## Documentation

- [Frontend Implementation Guide](./docs/for-frontend.md)
- [Backend API Requirements](./docs/for-backend.md)

## License

MIT
