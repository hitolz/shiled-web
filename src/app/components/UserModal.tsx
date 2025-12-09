'use client'

import React from 'react';
import { Modal } from 'antd';
import { UserInfo } from '@/api';
import UserForm from './UserForm';

interface UserModalProps {
  open: boolean;
  editingUser: UserInfo | null;
  form: any;
  onOk: () => void;
  onCancel: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  editingUser,
  form,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title={editingUser ? 'Edit User' : 'Add User'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
      cancelText="Cancel"
      width={500}
    >
      <UserForm form={form} editingUser={editingUser} />
    </Modal>
  );
};

export default UserModal;

