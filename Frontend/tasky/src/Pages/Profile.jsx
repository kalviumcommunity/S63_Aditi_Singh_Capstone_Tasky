import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, message, Avatar, Typography, Upload, Tabs } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import ThemeSwitcher from '../components/ThemeSwitcher';
import axios from 'axios';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [fileList, setFileList] = useState([]);
  const { isDark } = useTheme();

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
        'http://localhost:9000/api/users/profile',
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
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    return false; // Return false to prevent auto upload
  };

  const onPasswordChange = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(
        'http://localhost:9000/api/users/profile/password',
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
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250, transition: 'margin 0.3s' }}>
        <Content style={{ padding: '32px 0', minHeight: '100vh', background: isDark ? 'linear-gradient(135deg, #18181c 0%, #23232a 100%)' : '#f7fafd', position: 'relative' }}>
          {/* Theme Switcher at top right */}
          <div style={{ position: 'absolute', right: 40, top: 32, zIndex: 2 }}>
            <ThemeSwitcher />
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <Title level={1} style={{ textAlign: 'center', fontWeight: 800, marginBottom: 0, color: isDark ? '#fbbf24' : '#23232a', letterSpacing: 1, fontSize: 36 }}>Your Profile</Title>
            <Text style={{ display: 'block', textAlign: 'center', color: isDark ? '#a3a3a3' : '#64748b', marginBottom: 32, fontSize: 18 }}>
              Manage your account settings and preferences
            </Text>
            <Card style={{
              borderRadius: 20,
              boxShadow: isDark ? '0 8px 32px 0 rgba(0,0,0,0.45)' : '0 2px 16px rgba(0,0,0,0.04)',
              border: isDark ? '1.5px solid #3a2e13' : '1.5px solid #fbbf24',
              background: isDark ? 'rgba(36, 36, 40, 0.85)' : '#fff',
              backdropFilter: isDark ? 'blur(10px)' : undefined,
              marginTop: 16
            }}>
              <Tabs
                defaultActiveKey="profile"
                centered
                size="large"
                style={{ marginBottom: 24 }}
                tabBarStyle={{ fontWeight: 700, fontSize: 18 }}
                tabBarGutter={48}
                moreIcon={null}
                tabBarExtraContent={null}
                indicator={{
                  style: {
                    background: isDark ? '#fbbf24' : '#f59e0b',
                    height: 4,
                    borderRadius: 2
                  }
                }}
              >
                <TabPane tab={<span style={{ fontWeight: 700, fontSize: 18, color: isDark ? '#fbbf24' : '#f59e0b' }}>Profile</span>} key="profile">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                    <Avatar
                      size={120}
                      src={imageUrl ? `http://localhost:9000${imageUrl}` : undefined}
                      icon={!imageUrl && <UserOutlined />}
                      style={{ marginBottom: 8, border: `3px solid ${isDark ? '#fbbf24' : '#f59e0b'}` }}
                    />
                    <Upload
                      listType="picture-circle"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      maxCount={1}
                      style={{ marginBottom: 0 }}
                    >
                      <Button icon={<UploadOutlined />} shape="circle" style={{ marginTop: -40, marginLeft: 80, background: isDark ? '#fbbf24' : '#f59e0b', color: isDark ? '#23232a' : '#fff', border: 'none', boxShadow: isDark ? '0 2px 8px #fbbf24' : '0 2px 8px #f59e0b' }} />
                    </Upload>
                    <Text style={{ color: isDark ? '#a3a3a3' : '#64748b', marginTop: 8, fontSize: 16 }}>Upload a new profile photo</Text>
                  </div>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ maxWidth: 400, margin: '0 auto' }}
                  >
                    <Form.Item
                      name="name"
                      label={<span style={{ fontWeight: 700, color: isDark ? '#fbbf24' : '#23232a', fontSize: 16 }}>Full Name</span>}
                      rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                      <Input size="large" style={{ background: isDark ? '#23232a' : '#f7fafd', border: `1.5px solid ${isDark ? '#fbbf24' : '#f59e0b'}`, color: isDark ? '#fbbf24' : '#23232a', fontWeight: 600, fontSize: 16 }} />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label={<span style={{ fontWeight: 700, color: isDark ? '#fbbf24' : '#23232a', fontSize: 16 }}>Email Address</span>}
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                      ]}
                    >
                      <Input size="large" disabled style={{ background: isDark ? '#23232a' : '#f7fafd', border: `1.5px solid ${isDark ? '#fbbf24' : '#f59e0b'}`, color: isDark ? '#fbbf24' : '#23232a', fontWeight: 600, fontSize: 16 }} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ fontWeight: 700, fontSize: 18, background: isDark ? '#fbbf24' : '#f59e0b', borderColor: isDark ? '#fbbf24' : '#f59e0b', color: isDark ? '#23232a' : '#fff', boxShadow: isDark ? '0 4px 14px 0 rgba(251,191,36,0.19)' : '0 4px 14px 0 rgba(245,158,11,0.19)' }}>
                        Update Profile
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
                <TabPane tab={<span style={{ fontWeight: 700, fontSize: 18, color: isDark ? '#fbbf24' : '#f59e0b' }}>Security</span>} key="security">
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={onPasswordChange}
                    style={{ maxWidth: 400, margin: '0 auto', marginTop: 32 }}
                  >
                    <Form.Item
                      name="currentPassword"
                      label={<span style={{ fontWeight: 700, color: isDark ? '#fbbf24' : '#23232a', fontSize: 16 }}>Current Password</span>}
                      rules={[{ required: true, message: 'Please input your current password!' }]}
                    >
                      <Input.Password size="large" style={{ background: isDark ? '#23232a' : '#f7fafd', border: `1.5px solid ${isDark ? '#fbbf24' : '#f59e0b'}`, color: isDark ? '#fbbf24' : '#23232a', fontWeight: 600, fontSize: 16 }} />
                    </Form.Item>
                    <Form.Item
                      name="newPassword"
                      label={<span style={{ fontWeight: 700, color: isDark ? '#fbbf24' : '#23232a', fontSize: 16 }}>New Password</span>}
                      rules={[
                        { required: true, message: 'Please input your new password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                      ]}
                    >
                      <Input.Password size="large" style={{ background: isDark ? '#23232a' : '#f7fafd', border: `1.5px solid ${isDark ? '#fbbf24' : '#f59e0b'}`, color: isDark ? '#fbbf24' : '#23232a', fontWeight: 600, fontSize: 16 }} />
                    </Form.Item>
                    <Form.Item
                      name="confirmPassword"
                      label={<span style={{ fontWeight: 700, color: isDark ? '#fbbf24' : '#23232a', fontSize: 16 }}>Confirm Password</span>}
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords do not match!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password size="large" style={{ background: isDark ? '#23232a' : '#f7fafd', border: `1.5px solid ${isDark ? '#fbbf24' : '#f59e0b'}`, color: isDark ? '#fbbf24' : '#23232a', fontWeight: 600, fontSize: 16 }} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ fontWeight: 700, fontSize: 18, background: isDark ? '#fbbf24' : '#f59e0b', borderColor: isDark ? '#fbbf24' : '#f59e0b', color: isDark ? '#23232a' : '#fff', boxShadow: isDark ? '0 4px 14px 0 rgba(251,191,36,0.19)' : '0 4px 14px 0 rgba(245,158,11,0.19)' }}>
                        Change Password
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Profile; 