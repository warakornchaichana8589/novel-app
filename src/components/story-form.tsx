'use client';

import { useEffect } from 'react';
import { Form, Input, Select, Button, Upload, message } from 'antd';
import { Save } from 'lucide-react';
import { UploadOutlined } from '@ant-design/icons';
import { Story, CreateStoryInput, UpdateStoryInput } from '@/lib/types';
import { useCategories } from '@/hooks/use-stories';

const { TextArea } = Input;

interface StoryFormProps {
  story?: Story | null;
  onSubmit: (values: CreateStoryInput | UpdateStoryInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function StoryForm({ story, onSubmit, onCancel, loading }: StoryFormProps) {
  const [form] = Form.useForm();
  const { data: categories } = useCategories();

  useEffect(() => {
    if (story) {
      form.setFieldsValue({
        title: story.title,
        author: story.author,
        description: story.description,
        content: story.content,
        category: story.category,
        tags: story.tags.join(', '),
      });
    } else {
      form.resetFields();
    }
  }, [story, form]);

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      tags: values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
    };

    if (story) {
      onSubmit({ id: story.id, ...formattedValues });
    } else {
      onSubmit(formattedValues);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="title"
          label="ชื่อเรื่อง"
          rules={[{ required: true, message: 'กรุณากรอกชื่อเรื่อง' }]}
          className="md:col-span-2"
        >
          <Input placeholder="ชื่อเรื่องนิยาย" size="large" />
        </Form.Item>

        <Form.Item
          name="author"
          label="ผู้เขียน"
          rules={[{ required: true, message: 'กรุณากรอกชื่อผู้เขียน' }]}
        >
          <Input placeholder="ชื่อผู้เขียน" size="large" />
        </Form.Item>

        <Form.Item
          name="category"
          label="หมวดหมู่"
          rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่' }]}
        >
          <Select placeholder="เลือกหมวดหมู่" size="large">
            {categories?.map((cat) => (
              <Select.Option key={cat.slug} value={cat.slug}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <Form.Item
        name="description"
        label="คำอธิบาย"
        rules={[{ required: true, message: 'กรุณากรอกคำอธิบาย' }]}
      >
        <TextArea
          placeholder="คำอธิบายสั้นๆ เกี่ยวกับเรื่อง"
          rows={3}
          showCount
          maxLength={500}
        />
      </Form.Item>

      <Form.Item
        name="tags"
        label="แท็ก (คั่นด้วยเครื่องหมายจุลภาค)"
      >
        <Input placeholder="เช่น: ความรัก, โรแมนติก, วัยรุ่น" size="large" />
      </Form.Item>

      <Form.Item
        name="content"
        label="เนื้อหา"
        rules={[{ required: true, message: 'กรุณากรอกเนื้อหา' }]}
      >
        <TextArea
          placeholder="เนื้อหาของนิยาย"
          rows={20}
          className="font-mono"
        />
      </Form.Item>

      <Form.Item>
        <div className="flex gap-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<Save className="w-4 h-4" />}
            size="large"
          >
            {story ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างนิยาย'}
          </Button>
          
          <Button
            onClick={onCancel}
            size="large"
          >
            ยกเลิก
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
