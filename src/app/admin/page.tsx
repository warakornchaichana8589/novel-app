'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Button,
  Table,
  Space,
  Modal,
  message,
  Card,
  Row,
  Col,
  Statistic,
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

const { Title, Text } = Typography;

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

  const columns = [
    {
      title: 'ชื่อเรื่อง',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Story) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.author}</div>
        </div>
      ),
    },
    {
      title: 'หมวดหมู่',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'ยอดวิว',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      sorter: (a: Story, b: Story) => a.views - b.views,
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: 'อัพเดทล่าสุด',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('th-TH'),
    },
    {
      title: 'การจัดการ',
      key: 'actions',
      width: 150,
      render: (_: any, record: Story) => (
        <Space>
          <Button
            type="text"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => router.push(`/stories/${record.id}`)}
          />
          <Button
            type="text"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => openEditForm(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setStoryToDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const totalViews = stories?.reduce((acc, s) => acc + s.views, 0) || 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="นิยายทั้งหมด"
                value={stories?.length || 0}
                prefix={<BookOpen className="w-5 h-5 text-blue-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="ยอดอ่านรวม"
                value={totalViews}
                prefix={<TrendingUp className="w-5 h-5 text-green-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="ผู้เขียน"
                value={new Set(stories?.map(s => s.author)).size || 0}
                prefix={<Users className="w-5 h-5 text-purple-500" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Stories Table */}
        <Card title="รายการนิยาย">
          <Table
            columns={columns}
            dataSource={stories}
            rowKey="id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>

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
