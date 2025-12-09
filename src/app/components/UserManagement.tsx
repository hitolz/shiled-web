'use client'

import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { UserApi, UserInfo, BusinessType } from '@/api';
import UserSearchBar from './UserSearchBar';
import UserStats from './UserStats';
import UserTable from './UserTable';
import UserModal from './UserModal';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInfo | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType>('adapundi'); // 默认选择第一个
  const [enableDeduplication, setEnableDeduplication] = useState<boolean>(true); // 默认选中
  const [enableResume, setEnableResume] = useState<boolean>(false); // 默认不选中
  const [runningUsers, setRunningUsers] = useState<Set<string>>(new Set());
  const [form] = Form.useForm();
  const userApi = new UserApi();

  // Load users from HTTP API
  const loadUsers = async () => {
    try {
      setLoading(true);
      const userList = await userApi.getUserInfoList();
      setUsers(userList || []);
      setFilteredUsers(userList || []);
    } catch (error: any) {
      message.error('Failed to load user list: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    
    // Poll userList every 2 seconds
    const interval = setInterval(() => {
      loadUsers();
    }, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Filter users based on search text and business type
  useEffect(() => {
    let filtered = users;
    
    // Filter by business type
    if (selectedBusinessType) {
      filtered = filtered.filter(user => user.businessType === selectedBusinessType);
    }
    
    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        (user.remark && user.remark.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchText, selectedBusinessType, users]);

  // Open add/edit modal
  const openModal = (user?: UserInfo) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue(user);
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  // Save user (add or update)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await userApi.updateUser({ ...editingUser, ...values });
        message.success('User updated successfully');
      } else {
        await userApi.addUser(values);
        message.success('User added successfully');
      }
      closeModal();
      loadUsers();
    } catch (error: any) {
      message.error(error.message || 'Failed to save user');
    }
  };

  // Delete user
  const handleDelete = async (username: string) => {
    try {
      await userApi.deleteUser(username);
      message.success('User deleted successfully');
      loadUsers();
    } catch (error: any) {
      message.error('Failed to delete user: ' + error.message);
    }
  };

  // Run user sync
  const handleRun = async (username: string) => {
    try {
      setRunningUsers(prev => new Set(prev).add(username));
      await userApi.runUser(username, enableDeduplication, enableResume);
      message.success(`User ${username} sync started successfully`);
    } catch (error: any) {
      message.error('Failed to run user sync: ' + error.message);
    } finally {
      setRunningUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });
    }
  };

  // Stop user sync
  const handleStop = async (username: string) => {
    try {
      await userApi.stopUser(username);
      message.success(`User ${username} sync stopped`);
    } catch (error: any) {
      message.error('Failed to stop user sync: ' + error.message);
    }
  };

  return (
    <div className="app-card user-management-container">
      <div className="card-title">User Management</div>
      <UserSearchBar
        searchText={searchText}
        selectedBusinessType={selectedBusinessType}
        enableDeduplication={enableDeduplication}
        enableResume={enableResume}
        onSearchChange={setSearchText}
        onBusinessTypeChange={setSelectedBusinessType}
        onDeduplicationChange={setEnableDeduplication}
        onResumeChange={setEnableResume}
        onAddClick={() => openModal()}
        onRefresh={loadUsers}
      />
      <UserStats
        users={filteredUsers}
        businessType={selectedBusinessType}
      />
      <UserTable
        users={filteredUsers}
        loading={loading}
        runningUsers={runningUsers}
        onEdit={openModal}
        onDelete={handleDelete}
        onRun={handleRun}
        onStop={handleStop}
      />
      <UserModal
        open={isModalOpen}
        editingUser={editingUser}
        form={form}
        onOk={handleSave}
        onCancel={closeModal}
      />
    </div>
  );
};

export default UserManagement;

