'use client'

import React from 'react';
import { Input, Select, Button, Checkbox } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { BusinessType } from '@/api';

interface UserSearchBarProps {
  searchText: string;
  selectedBusinessType: BusinessType;
  enableDeduplication: boolean;
  enableResume: boolean;
  onSearchChange: (value: string) => void;
  onBusinessTypeChange: (value: BusinessType) => void;
  onDeduplicationChange: (value: boolean) => void;
  onResumeChange: (value: boolean) => void;
  onAddClick: () => void;
  onRefresh: () => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  searchText,
  selectedBusinessType,
  enableDeduplication,
  enableResume,
  onSearchChange,
  onBusinessTypeChange,
  onDeduplicationChange,
  onResumeChange,
  onAddClick,
  onRefresh,
}) => {
  return (
    <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <Select
        placeholder="Select business type"
        value={selectedBusinessType}
        onChange={onBusinessTypeChange}
        style={{ width: 180 }}
      >
        <Select.Option value="adapundi">Adapundi</Select.Option>
        <Select.Option value="SINGA">SINGA</Select.Option>
        <Select.Option value="KAT">KAT</Select.Option>
      </Select>
      <Input
        placeholder="Search by username or remark"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ width: 300 }}
        allowClear
      />
      <Checkbox
        checked={enableDeduplication}
        onChange={(e) => onDeduplicationChange(e.target.checked)}
      >
        Daily Deduplication
      </Checkbox>
      <Checkbox
        checked={enableResume}
        onChange={(e) => onResumeChange(e.target.checked)}
      >
        Daily Resume
      </Checkbox>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddClick}
        className="gradient-btn"
      >
        Add User
      </Button>
      <Button onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
};

export default UserSearchBar;

