'use client';

import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { Lock, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = onLogin(values.username, values.password);
    
    if (success) {
      message.success('เข้าสู่ระบบสำเร็จ');
      form.resetFields();
      onClose();
    } else {
      message.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    
    setLoading(false);
  };

  return (
    <Modal
      title={<span className="text-xl font-semibold">เข้าสู่ระบบผู้ดูแล</span>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="username"
          label="ชื่อผู้ใช้"
          rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้' }]}
        >
          <Input
            prefix={<User className="w-4 h-4 text-gray-400" />}
            placeholder="admin"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="รหัสผ่าน"
          rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
        >
          <Input.Password
            prefix={<Lock className="w-4 h-4 text-gray-400" />}
            placeholder="••••••"
            size="large"
          />
        </Form.Item>

        <div className="text-sm text-gray-500 mb-4">
          <p>ทดสอบด้วย: </p>
          <p>ชื่อผู้ใช้: <code>admin</code></p>
          <p>รหัสผ่าน: <code>admin123</code></p>
        </div>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            เข้าสู่ระบบ
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
