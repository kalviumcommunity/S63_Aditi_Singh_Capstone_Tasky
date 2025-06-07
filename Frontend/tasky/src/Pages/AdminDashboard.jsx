import React, { useState, useEffect, useContext } from 'react';
import { Layout, Card, Table, Typography, Row, Col, Progress, Button, Empty, Switch, Popconfirm, message } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import axios from '../api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';
import CreateTaskModal from '../components/CreateTaskModal';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalUsers: 7
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskProgress, setTaskProgress] = useState({
    overallCompletion: 0,
    weeklyCompletion: 0
  });
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
    fetchTasks();
    fetchTaskProgress();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/stats', {
        withCredentials: true
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get('/admin/recent-activity', {
        withCredentials: true
      });
      setRecentActivity(response.data);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks/all', {
        withCredentials: true
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchTaskProgress = async () => {
    try {
      const response = await axios.get('/admin/task-progress', {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTaskProgress(response.data);
    } catch (error) {
      console.error('Error fetching task progress:', error);
      setTaskProgress({ overallCompletion: 0, weeklyCompletion: 0 });
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  // Columns for the Tasks Table
  const taskColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo) => assignedTo?.name || 'Unassigned', // Display assigned user's name
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate) => dueDate ? new Date(dueDate).toLocaleDateString() : 'No Due Date',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy) => createdBy?.name || 'N/A', // Display creator's name
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleString() : 'N/A', // Display creation date and time
    },
  ];

  // Add Actions column only if the user is admin
  if (isAdmin) {
    taskColumns.push({
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={() => handleDeleteTask(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    });
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/admin/task/${taskId}`, {
        withCredentials: true,
      });
      message.success('Task deleted successfully');
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar />
      <Layout style={{ marginLeft: 200 }}>
        <Content className="dashboard-content">
          <div className="dashboard-header">
            <div className="header-left">
              <Title level={2}>Dashboard Overview</Title>
              <Text className="header-subtitle">Welcome back! Here's what's happening</Text>
            </div>
            <div className="header-right">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                className="create-task-btn"
                onClick={() => setIsCreateTaskModalVisible(true)}
              >
                Create Task
              </Button>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <div className="stat-content">
                  <FileTextOutlined className="stat-icon" style={{ color: 'var(--icon-tasks)' }} />
                  <div className="stat-info">
                    <Text className="stat-value">{stats.totalTasks}</Text>
                    <Text className="stat-title">Total Tasks</Text>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <div className="stat-content">
                  <CheckCircleOutlined className="stat-icon" style={{ color: 'var(--icon-completed)' }} />
                  <div className="stat-info">
                    <Text className="stat-value">{stats.completedTasks}</Text>
                    <Text className="stat-title">Completed</Text>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <div className="stat-content">
                  <ClockCircleOutlined className="stat-icon" style={{ color: 'var(--icon-progress)' }} />
                  <div className="stat-info">
                    <Text className="stat-value">{stats.inProgressTasks}</Text>
                    <Text className="stat-title">In Progress</Text>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <div className="stat-content">
                  <UserOutlined className="stat-icon" style={{ color: 'var(--icon-users)' }} />
                  <div className="stat-info">
                    <Text className="stat-value">{stats.totalUsers}</Text>
                    <Text className="stat-title">Total Users</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24} lg={16}>
              <Card className="activity-card" title="Recent Activity">
                <Table
                  columns={columns}
                  dataSource={recentActivity}
                  pagination={{ pageSize: 5 }}
                  className="custom-table"
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No recent activity"
                      />
                    ),
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="progress-card" title="Task Progress">
                <div className="progress-item">
                  <div className="progress-info">
                    <Text>Overall Completion</Text>
                    <Text strong>{taskProgress.overallCompletion}%</Text>
                  </div>
                  <Progress 
                    percent={taskProgress.overallCompletion}
                    strokeColor="var(--primary-orange)"
                    trailColor="rgba(249, 115, 22, 0.1)"
                  />
                </div>
                <div className="progress-item">
                  <div className="progress-info">
                    <Text>This Week's Progress</Text>
                    <Text strong>{taskProgress.weeklyCompletion}%</Text>
                  </div>
                  <Progress 
                    percent={taskProgress.weeklyCompletion}
                    strokeColor="var(--primary-orange)"
                    trailColor="rgba(249, 115, 22, 0.1)"
                  />
                </div>
              </Card>
            </Col>
          </Row>

          {/* All Tasks Section */}
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24}>
              <Card className="tasks-card" title="All Tasks">
                <Table
                  columns={taskColumns}
                  dataSource={tasks}
                  pagination={{ pageSize: 10 }} // Adjust as needed
                  className="custom-table"
                  rowKey="_id" // Assuming tasks have an _id field
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No tasks created yet"
                      />
                    ),
                  }}
                />
              </Card>
            </Col>
          </Row>

          <CreateTaskModal
            visible={isCreateTaskModalVisible}
            onClose={() => setIsCreateTaskModalVisible(false)}
            onSuccess={(task) => {
              // Refresh task list or update state as needed
              setIsCreateTaskModalVisible(false);
              fetchTasks(); // Call fetchTasks to refresh the list
            }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard; 