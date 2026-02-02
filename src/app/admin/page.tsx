'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Button,
  Modal,
  message,
  Card,
  Statistic,
  Badge,
  Avatar,
  Dropdown,
} from 'antd';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  BookOpen,
  Users,
  TrendingUp,
  MoreVertical,
  ChevronRight,
} from 'lucide-react';
import { MainLayout } from '@/components/main-layout';
import { StoryForm } from '@/components/story-form';
import {
  useStories,
  useCreateStory,
  useUpdateStory,
  useDeleteStory,
} from '@/hooks/use-stories';
import { Story } from '@/lib/types';

const { Title } = Typography;

// Mobile Story Card Component
function MobileStoryCard({ 
  story, 
  onEdit, 
  onDelete,
  onView 
}: { 
  story: Story; 
  onEdit: (s: Story) => void;
  onDelete: (s: Story) => void;
  onView: (id: string) => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  const menuItems = [
    {
      key: 'view',
      label: 'ดูหน้านี้',
      icon: <Eye className="w-4 h-4" />,
      onClick: () => onView(story.id),
    },
    {
      key: 'edit',
      label: 'แก้ไข',
      icon: <Edit className="w-4 h-4" />,
      onClick: () => onEdit(story),
    },
    {
      key: 'delete',
      label: 'ลบ',
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: () => onDelete(story),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex gap-3">
        {/* Cover */}
        <div 
          className="w-20 h-28 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0 overflow-hidden"
          onClick={() => onView(story.id)}
        >
          {story.coverImage ? (
            <img 
              src={story.coverImage} 
              alt={story.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{story.title[0]}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 line-clamp-1">{story.title}</h4>
              <p className="text-sm text-gray-500">{story.author}</p>
            </div>
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </Dropdown>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-purple-100 text-purple-700 border-0">
              {story.category}
            </Badge>
          </div>

          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {formatViews(story.views)}
              </span>
              <span>{formatDate(story.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { data: stories, isLoading } = useStories();
  const createMutation = useCreateStory();
  const updateMutation = useUpdateStory();
  const deleteMutation = useDeleteStory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);

  const handleCreate = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        message.success('สร้างนิยายสำเร็จ');
        setIsFormOpen(false);
      },
      onError: () => {
        message.error('เกิดข้อผิดพลาดในการสร้างนิยาย');
      },
    });
  };

  const handleUpdate = (values: any) => {
    updateMutation.mutate(values, {
      onSuccess: () => {
        message.success('อัพเดทนิยายสำเร็จ');
        setIsFormOpen(false);
        setEditingStory(null);
      },
      onError: () => {
        message.error('เกิดข้อผิดพลาดในการอัพเดทนิยาย');
      },
    });
  };

  const handleDelete = () => {
    if (!storyToDelete) return;
    
    deleteMutation.mutate(storyToDelete.id, {
      onSuccess: () => {
        message.success('ลบนิยายสำเร็จ');
        setStoryToDelete(null);
      },
      onError: () => {
        message.error('เกิดข้อผิดพลาดในการลบนิยาย');
      },
    });
  };

  const openCreateForm = () => {
    setEditingStory(null);
    setIsFormOpen(true);
  };

  const openEditForm = (story: Story) => {
    setEditingStory(story);
    setIsFormOpen(true);
  };

  const totalViews = stories?.reduce((acc, s) => acc + s.views, 0) || 0;
  const uniqueAuthors = new Set(stories?.map(s => s.author)).size || 0;

  return (
    <MainLayout>
      <div className="min-h-screen bg-white md:bg-gray-50">
        {/* Mobile View */}
        <div className="md:hidden">
          {/* Header */}
          <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-100 sticky top-14 z-30">
            <button 
              onClick={() => router.push('/')}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">แดชบอร์ด</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 p-4">
            <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-700">{stories?.length || 0}</div>
              <div className="text-xs text-blue-600">นิยาย</div>
            </Card>
            
            <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-700">
                {totalViews >= 1000 ? `${(totalViews/1000).toFixed(1)}k` : totalViews}
              </div>
              <div className="text-xs text-green-600">ยอดอ่าน</div>
            </Card>
            
            <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-700">{uniqueAuthors}</div>
              <div className="text-xs text-purple-600">ผู้เขียน</div>
            </Card>
          </div>

          {/* Story List */}
          <div className="px-4 pb-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">รายการนิยาย</h2>
              <Button 
                type="primary" 
                size="small"
                icon={<Plus className="w-4 h-4" />}
                onClick={openCreateForm}
                className="bg-gradient-to-r from-purple-600 to-pink-500 border-0 rounded-full"
              >
                เพิ่ม
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {stories?.map((story) => (
                  <MobileStoryCard
                    key={story.id}
                    story={story}
                    onEdit={openEditForm}
                    onDelete={setStoryToDelete}
                    onView={(id) => router.push(`/stories/${id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Button
                type="text"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => router.push('/')}
                className="mb-2"
              >
                กลับหน้าหลัก
              </Button>
              <Title level={2} className="!text-2xl !mb-0">
                แดชบอร์ดผู้ดูแล
              </Title>
            </div>
            
            <Button
              type="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={openCreateForm}
              size="large"
            >
              เขียนนิยายใหม่
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card>
              <Statistic
                title="นิยายทั้งหมด"
                value={stories?.length || 0}
                prefix={<BookOpen className="w-5 h-5 text-blue-500" />}
              />
            </Card>
            <Card>
              <Statistic
                title="ยอดอ่านรวม"
                value={totalViews}
                prefix={<TrendingUp className="w-5 h-5 text-green-500" />}
              />
            </Card>
            <Card>
              <Statistic
                title="ผู้เขียน"
                value={uniqueAuthors}
                prefix={<Users className="w-5 h-5 text-purple-500" />}
              />
            </Card>
          </div>

          {/* Table */}
          <Card title="รายการนิยาย" bodyStyle={{ padding: 0 }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ชื่อเรื่อง</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 w-28">หมวดหมู่</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 w-24">ยอดวิว</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 w-28">อัพเดท</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 w-28">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {stories?.map((story) => (
                    <tr key={story.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium truncate max-w-[200px]">{story.title}</div>
                        <div className="text-sm text-gray-500">{story.author}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-purple-100 text-purple-700 border-0">{story.category}</Badge>
                      </td>
                      <td className="py-3 px-4">{story.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(story.updatedAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button
                            type="text"
                            size="small"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => router.push(`/stories/${story.id}`)}
                          />
                          <Button
                            type="text"
                            size="small"
                            icon={<Edit className="w-4 h-4" />}
                            onClick={() => openEditForm(story)}
                          />
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => setStoryToDelete(story)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Create/Edit Modal */}
        <Modal
          title={<span className="text-xl font-semibold">
            {editingStory ? 'แก้ไขนิยาย' : 'สร้างนิยายใหม่'}
          </span>}
          open={isFormOpen}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingStory(null);
          }}
          footer={null}
          width={800}
          destroyOnClose
          className="admin-modal"
        >
          <StoryForm
            story={editingStory}
            onSubmit={editingStory ? handleUpdate : handleCreate}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingStory(null);
            }}
            loading={createMutation.isPending || updateMutation.isPending}
          />
        </Modal>

        {/* Delete Confirmation */}
        <Modal
          title="ยืนยันการลบ"
          open={!!storyToDelete}
          onCancel={() => setStoryToDelete(null)}
          onOk={handleDelete}
          okText="ลบ"
          cancelText="ยกเลิก"
          okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
        >
          <p>
            คุณแน่ใจหรือไม่ว่าต้องการลบนิยาย "<strong>{storyToDelete?.title}</strong>"?
          </p>
          <p className="text-gray-500">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
        </Modal>
      </div>
    </MainLayout>
  );
}
