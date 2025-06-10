import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, message, Avatar, Typography, Upload, Tabs, Space, Divider } from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import axios from '../api';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Professional color palette (Copy from Dashboard.jsx for consistency)
const COLORS = {
  primary: '#2563eb',      // Professional blue
  secondary: '#475569',    // Slate gray
  success: '#059669',      // Professional green
  warning: '#d97706',      // Professional amber
  danger: '#dc2626',       // Professional red
  background: '#f8fafc',   // Light gray background
  card: '#ffffff',         // White
  text: {
    primary: '#1e293b',    // Dark slate
    secondary: '#64748b',  // Medium slate
    subtle: '#94a3b8',     // Light slate
  },
  border: '#e2e8f0',       // Light border
  hover: '#f1f5f9',        // Hover state
};

const AdminProfile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
      setImageUrl(user.profileImage);
    }
  }, [user, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (fileList.length > 0) {
        formData.append('profileImage', fileList[0].originFileObj);
      }
      const response = await axios.put(
        '/users/profile',
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      updateUser(response.data.data);
      setImageUrl(response.data.data.profileImage);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false; // Return false to prevent auto upload, true to allow
  };

  const onPasswordChange = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(
        '/users/profile/password',
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        message.success('Password changed successfully');
        passwordForm.resetFields();
      } else {
        message.error(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: COLORS.background }}>
      <AdminSidebar />
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Content style={{ padding: '24px', minHeight: '100vh', background: COLORS.background }}>
          <div style={{ maxWidth: 700, margin: '24px auto', padding: '24px', background: COLORS.card, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Title level={2} style={{ 
              textAlign: 'center',
              fontWeight: 700,
              marginBottom: '8px',
              color: COLORS.text.primary,
              fontSize: '24px',
              letterSpacing: '-0.025em'
             }}>
              Your Profile
            </Title>
            <Text style={{ 
              display: 'block',
              textAlign: 'center',
              color: COLORS.text.secondary,
              marginBottom: '32px',
              fontSize: '15px'
            }}>
              Manage your account settings and preferences
            </Text>
            
            <Tabs
              defaultActiveKey="profile"
              centered
              size="large"
              style={{ marginBottom: '24px' }}
              tabBarStyle={{
                fontWeight: 600,
                fontSize: '16px',
                color: COLORS.text.secondary,
              }}
              tabBarGutter={32}
              indicator={{
                style: {
                  background: COLORS.primary,
                  height: 3,
                  borderRadius: 2
                }
              }}
              renderTabBar={(props, DefaultTabBar) => (
                <DefaultTabBar {...props}>
                  {node => (
                    React.cloneElement(node, {
                      style: {
                        ...node.props.style,
                        color: props.activeKey === node.key ? COLORS.primary : COLORS.text.secondary,
                      },
                    })
                  )}
                </DefaultTabBar>
              )}
            >
              <TabPane tab="Profile" key="profile">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                  <Avatar
                    size={120}
                    src={imageUrl ? `http://localhost:9000${imageUrl}` : undefined}
                    icon={!imageUrl && <UserOutlined style={{ fontSize: '60px' }} />}
                    style={{ marginBottom: '16px', border: `4px solid ${COLORS.primary}`, background: COLORS.border }}
                  />
                  <Upload
                    listType="picture-circle"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    maxCount={1}
                    style={{ marginBottom: 0 }}
                  >
                    <Button 
                      icon={<UploadOutlined style={{ fontSize: '16px' }} />}
                      shape="circle"
                      style={{ 
                        marginTop: -45,
                        marginLeft: 80,
                        background: COLORS.primary,
                        color: COLORS.card,
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </Upload>
                  <Text style={{ color: COLORS.text.secondary, marginTop: '8px', fontSize: '14px' }}>Upload a new profile photo</Text>
                </div>

                <Divider style={{ margin: '0 0 24px 0', borderColor: COLORS.border }} />

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  style={{ maxWidth: 400, margin: '0 auto' }}
                >
                  <Form.Item
                    name="name"
                    label={<span style={{ fontWeight: 600, color: COLORS.text.primary, fontSize: 14 }}>Full Name</span>}
                    rules={[{ required: true, message: 'Please input your name!' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input 
                      size="large"
                      prefix={<UserOutlined style={{ color: COLORS.text.subtle, fontSize: '16px' }} />}
                      style={{ 
                        background: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.text.primary,
                        fontWeight: 400,
                        fontSize: 15,
                        borderRadius: '6px',
                        padding: '8px 12px'
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label={<span style={{ fontWeight: 600, color: COLORS.text.primary, fontSize: 14 }}>Email Address</span>}
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input 
                      size="large"
                      prefix={<MailOutlined style={{ color: COLORS.text.subtle, fontSize: '16px' }} />}
                      style={{ 
                        background: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.text.primary,
                        fontWeight: 400,
                        fontSize: 15,
                        borderRadius: '6px',
                        padding: '8px 12px'
                      }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: '0' }}>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      size="large"
                      style={{
                        width: '100%',
                        marginTop: '16px',
                        height: '48px',
                        fontWeight: 600,
                        fontSize: 16,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane tab="Change Password" key="password">
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={onPasswordChange}
                  style={{ maxWidth: 400, margin: '0 auto' }}
                >
                  <Form.Item
                    name="currentPassword"
                    label={<span style={{ fontWeight: 600, color: COLORS.text.primary, fontSize: 14 }}>Current Password</span>}
                    rules={[{ required: true, message: 'Please input your current password!' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input.Password 
                      size="large"
                      prefix={<LockOutlined style={{ color: COLORS.text.subtle, fontSize: '16px' }} />}
                      style={{
                        background: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.text.primary,
                        fontWeight: 400,
                        fontSize: 15,
                        borderRadius: '6px',
                        padding: '8px 12px'
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="newPassword"
                    label={<span style={{ fontWeight: 600, color: COLORS.text.primary, fontSize: 14 }}>New Password</span>}
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input.Password 
                      size="large"
                      prefix={<LockOutlined style={{ color: COLORS.text.subtle, fontSize: '16px' }} />}
                      style={{
                        background: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.text.primary,
                        fontWeight: 400,
                        fontSize: 15,
                        borderRadius: '6px',
                        padding: '8px 12px'
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmNewPassword"
                    label={<span style={{ fontWeight: 600, color: COLORS.text.primary, fontSize: 14 }}>Confirm New Password</span>}
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                      { required: true, message: 'Please confirm your new password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                      }),
                    ]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input.Password 
                      size="large"
                      prefix={<LockOutlined style={{ color: COLORS.text.subtle, fontSize: '16px' }} />}
                      style={{
                        background: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.text.primary,
                        fontWeight: 400,
                        fontSize: 15,
                        borderRadius: '6px',
                        padding: '8px 12px'
                      }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: '0' }}>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      size="large"
                      style={{
                        width: '100%',
                        marginTop: '16px',
                        height: '48px',
                        fontWeight: 600,
                        fontSize: 16,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminProfile; 