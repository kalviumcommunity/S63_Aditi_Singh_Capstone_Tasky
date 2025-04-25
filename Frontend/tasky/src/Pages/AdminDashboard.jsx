import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Typography, Row, Col, Progress, Button, Empty, Switch } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';

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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', !isDark ? 'dark' : 'light');
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/admin/stats', {
        withCredentials: true
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/admin/recent-activity', {
        withCredentials: true
      });
      setRecentActivity(response.data);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
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
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                className="theme-switch"
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                className="create-task-btn"
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
                    <Text strong>70%</Text>
                  </div>
                  <Progress 
                    percent={70} 
                    strokeColor="var(--primary-orange)"
                    trailColor="rgba(249, 115, 22, 0.1)"
                  />
                </div>
                <div className="progress-item">
                  <div className="progress-info">
                    <Text>This Week's Progress</Text>
                    <Text strong>85%</Text>
                  </div>
                  <Progress 
                    percent={85} 
                    strokeColor="var(--primary-orange)"
                    trailColor="rgba(249, 115, 22, 0.1)"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard; 