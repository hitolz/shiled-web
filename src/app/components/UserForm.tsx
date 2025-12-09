'use client'

import React from 'react';
import { Form, Input, Select } from 'antd';
import { UserInfo } from '@/api';

interface UserFormProps {
  form: any;
  editingUser: UserInfo | null;
}

const UserForm: React.FC<UserFormProps> = ({ form, editingUser }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: 'Please enter username' },
          { min: 3, message: 'Username must be at least 3 characters' },
        ]}
      >
        <Input
          placeholder="Enter username"
          disabled={!!editingUser}
        />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Please enter password' },
          { min: 6, message: 'Password must be at least 6 characters' },
        ]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>
      <Form.Item
        label="Business Type"
        name="businessType"
        rules={[{ required: true, message: 'Please select business type' }]}
      >
        <Select placeholder="Select business type">
          <Select.Option value="adapundi">Adapundi</Select.Option>
          <Select.Option value="SINGA">SIGINT</Select.Option>
          <Select.Option value="KAT">KAT</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Remark"
        name="remark"
      >
        <Input.TextArea
          placeholder="Enter remark"
          rows={3}
        />
      </Form.Item>
    </Form>
  );
};

export default UserForm;

