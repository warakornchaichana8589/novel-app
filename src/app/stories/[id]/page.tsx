import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ReadingViewer } from '@/components/reading-viewer';
import { mockStories } from '@/lib/mock-data';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = mockStories.find(s => s.id === id);
  
  if (!story) {
    return {
      title: 'ไม่พบหน้านี้ - NovelHub',
    };
  }
  
  return {
    title: `${story.title} - NovelHub`,
    description: story.description,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const story = mockStories.find(s => s.id === id);
  
  if (!story) {
    notFound();
  }
  
  return <ReadingViewer story={story} />;
}
