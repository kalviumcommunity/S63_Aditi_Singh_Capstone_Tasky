import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Space,
  Tag
} from 'antd';
import {
  UserAddOutlined,
  DeleteOutlined,
  TeamOutlined
} from '@ant-design/icons';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/ManageUsers.css';

const { Content } = Layout;
const { Title } = Typography;

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:9000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      message.error('Please login again');
      // You might want to redirect to login page here
    }
    return Promise.reject(error);
  }
);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team-members');
      const teamMembers = response.data.data.map(member => ({
        ...member.userId,
        teamMemberId: member._id,
        role: 'team_member'
      }));
      setUsers(teamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      message.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (values) => {
    try {
      setLoading(true);
      await api.post('/team-members', {
        email: values.email
      });
      message.success('Team member added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error('Error adding team member:', error.response?.data || error.message);
      message.error(error.response?.data?.message || 'Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (teamMemberId) => {
    try {
      setLoading(true);
      await api.delete(`/team-members/${teamMemberId}`);
      message.success('Team member removed successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting team member:', error.response?.data || error.message);
      message.error('Failed to remove team member');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'team_member' ? 'green' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.teamMemberId)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar />
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ margin: '24px', background: 'var(--bg-content)', padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>Manage Team Members</Title>
          </div>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsModalVisible(true)}
              style={{ background: 'var(--primary-orange)', borderColor: 'var(--primary-orange)' }}
            >
              Add User
            </Button>
        </div>

          <Card>
            <Table
              columns={columns}
              dataSource={users}
              loading={loading}
              rowKey="teamMemberId"
              className="custom-table"
            />
          </Card>

        <Modal
            title="Add New User"
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form
              form={form}
              onFinish={handleAddUser}
              layout="vertical"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input the email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input placeholder="Enter user email" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Add User
                </Button>
              </Form.Item>
            </Form>
        </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageUsers;
