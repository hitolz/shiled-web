'use client'

import React, { useState } from 'react';
import { Layout, ConfigProvider, Button, Modal, Form, Radio, InputNumber, message, Space, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import enUS from 'antd/locale/en_US';
import './globals.css';
import UserManagement from './components/UserManagement';

const { Content } = Layout;

type BusinessType = 'adapundi' | 'SINGA' | 'KAT';

export default function Home() {
  const [activeTab] = useState<string>('user');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | undefined>(undefined);
  const [form] = Form.useForm();

  // Load system settings
  const loadSettings = async (businessType?: BusinessType) => {
    try {
      setLoading(true);
      const systemApi = (window as any).system;
      const targetBusinessType = businessType !== undefined ? businessType : selectedBusinessType;
      if (systemApi && targetBusinessType && systemApi.getSyncTimeConfigByBusiness) {
        const config = await systemApi.getSyncTimeConfigByBusiness(targetBusinessType);
        form.setFieldsValue(config);
      } else if (systemApi && systemApi.getSyncTimeConfig) {
        const config = await systemApi.getSyncTimeConfig();
        form.setFieldsValue(config);
      } else {
        message.warning('System API not initialized');
      }
    } catch (error: any) {
      message.error('Failed to load system settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle business type change
  const handleBusinessTypeChange = async (businessType: BusinessType | undefined) => {
    setSelectedBusinessType(businessType);
    if (isSettingsModalOpen) {
      // Reload settings when business type changes
      await loadSettings(businessType);
    }
  };

  // Open settings modal
  const openSettingsModal = async () => {
    setIsSettingsModalOpen(true);
    // Reset business type selection when opening modal
    if (!selectedBusinessType) {
      setSelectedBusinessType(undefined);
    }
    await loadSettings();
  };

  // Close settings modal
  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
    form.resetFields();
    setSelectedBusinessType(undefined);
  };

  // Save system settings
  const handleSaveSettings = async () => {
    try {
      const values = await form.validateFields();
      const systemApi = (window as any).system;
      if (systemApi && selectedBusinessType && systemApi.saveSyncTimeConfigByBusiness) {
        await systemApi.saveSyncTimeConfigByBusiness(selectedBusinessType, values);
        message.success(`System settings for ${selectedBusinessType} saved successfully`);
        closeSettingsModal();
      } else if (systemApi && systemApi.saveSyncTimeConfig) {
        await systemApi.saveSyncTimeConfig(values);
        message.success('System settings saved successfully');
        closeSettingsModal();
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to save system settings');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'user':
        return <UserManagement />;
      default:
        return null;
    }
  };

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          colorPrimary: '#667eea',
          borderRadius: 12,
        },
      }}
    >
      <Layout className="app-layout">
        <div className="app-container">
          <Content className="app-content">
            <div className="tab-content-wrapper user-content-wrapper">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <Button
                  type="primary"
                  icon={<SettingOutlined />}
                  onClick={openSettingsModal}
                  className="gradient-btn"
                >
                  System Settings
                </Button>
              </div>
              {renderTabContent()}
            </div>
          </Content>
        </div>
      </Layout>

      <Modal
        title="System Settings"
        open={isSettingsModalOpen}
        onOk={handleSaveSettings}
        onCancel={closeSettingsModal}
        okText="Save"
        cancelText="Cancel"
        width={500}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            type: 'daily',
            hour: 0,
            minute: 0,
          }}
        >
          <Form.Item
            label="Business Type"
            name="businessType"
          >
            <Select
              placeholder="Select business type (optional)"
              value={selectedBusinessType}
              onChange={handleBusinessTypeChange}
              allowClear
            >
              <Select.Option value="adapundi">Adapundi</Select.Option>
              <Select.Option value="SINGA">SIGINT</Select.Option>
              <Select.Option value="KAT">KAT</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Sync Time"
            name="type"
            rules={[{ required: true, message: 'Please select sync time type' }]}
          >
            <Radio.Group>
              <Radio value="daily">Daily</Radio>
              <Radio value="monthly">Monthly</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              return type === 'monthly' ? (
                <Form.Item
                  label="Day of Month"
                  name="day"
                  rules={[
                    { required: true, message: 'Please enter day' },
                    { type: 'number', min: 1, max: 31, message: 'Day must be between 1-31' },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={31}
                    placeholder="Enter day (1-31)"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label="Hour"
              name="hour"
              rules={[
                { required: true, message: 'Please enter hour' },
                { type: 'number', min: 0, max: 23, message: 'Hour must be between 0-23' },
              ]}
            >
              <InputNumber
                min={0}
                max={23}
                placeholder="Hour (0-23)"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="Minute"
              name="minute"
              rules={[
                { required: true, message: 'Please enter minute' },
                { type: 'number', min: 0, max: 59, message: 'Minute must be between 0-59' },
              ]}
            >
              <InputNumber
                min={0}
                max={59}
                placeholder="Minute (0-59)"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}