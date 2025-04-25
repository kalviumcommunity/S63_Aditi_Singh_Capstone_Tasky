import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, message, Avatar, Typography, Row, Col, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
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
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
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
        form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
      } else {
        message.error(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
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
    <Content style={{ padding: '24px' }}>
      <Title level={2}>Profile Settings</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Profile Information">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {imageUrl ? (
                <Avatar 
                  size={100} 
                  src={`http://localhost:9000${imageUrl}`}
                />
              ) : (
                <Avatar size={100} icon={<UserOutlined />} />
              )}
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                label="Profile Picture"
              >
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  fileList={fileList}
                  onChange={handleChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>

              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Change Password">
            <Form
              layout="vertical"
              onFinish={onPasswordChange}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please input your current password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please input your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
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
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Profile; 