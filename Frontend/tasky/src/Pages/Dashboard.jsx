import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Statistic, Typography, List, Tag, Progress, Spin, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const MotionCard = motion(Card);
const MotionRow = motion(Row);
const MotionCol = motion(Col);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { isDark } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, tasksResponse] = await Promise.all([
        axios.get('http://localhost:9000/api/tasks/stats', { withCredentials: true }),
        axios.get('http://localhost:9000/api/tasks/recent', { withCredentials: true })
      ]);

      setStats(statsResponse.data);
      setRecentTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#52c41a';
      case 'pending':
        return '#faad14';
      case 'overdue':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      case 'overdue':
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <Content style={{ 
      padding: '32px', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} style={{ 
          marginBottom: '32px',
          color: '#f59e0b',
          fontWeight: '900',
          letterSpacing: 1,
          fontSize: 38,
        }}>
          Dashboard Overview
        </Title>
        <Text style={{
          color: '#23232a',
          fontSize: 20,
          fontWeight: 500,
          marginBottom: 24,
          display: 'block',
        }}>
          Welcome back! Here's what's happening
        </Text>
        <button onClick={logout} style={{ 
          background: '#ff4d4f',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          marginTop: '20px'
        }}>
          Logout
        </button>
      </motion.div>

      <MotionRow 
        gutter={[32, 32]} 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ marginBottom: 16 }}
      >
        <MotionCol xs={24} sm={12} lg={6} variants={itemVariants}>
          <MotionCard
            whileHover={{ scale: 1.05, y: -8, boxShadow: '0 8px 32px 0 #fbbf24' }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)',
              border: '2px solid #fbbf24',
              minHeight: 120,
              transition: 'all 0.3s',
            }}
          >
            <Statistic
              title={<Text style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700', letterSpacing: 0.5 }}>Total Tasks</Text>}
              value={stats.totalTasks}
              valueStyle={{ 
                color: '#f59e0b',
                fontSize: '40px',
                fontWeight: '900',
              }}
            />
          </MotionCard>
        </MotionCol>

        <MotionCol xs={24} sm={12} lg={6} variants={itemVariants}>
          <MotionCard
            whileHover={{ scale: 1.05, y: -8, boxShadow: '0 8px 32px 0 #fbbf24' }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)',
              border: '2px solid #fbbf24',
              minHeight: 120,
              transition: 'all 0.3s',
            }}
          >
            <Statistic
              title={<Text style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700', letterSpacing: 0.5 }}>Completed</Text>}
              value={stats.completedTasks}
              valueStyle={{ 
                color: '#52c41a',
                fontSize: '40px',
                fontWeight: '900',
              }}
            />
          </MotionCard>
        </MotionCol>

        <MotionCol xs={24} sm={12} lg={6} variants={itemVariants}>
          <MotionCard
            whileHover={{ scale: 1.05, y: -8, boxShadow: '0 8px 32px 0 #fbbf24' }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)',
              border: '2px solid #fbbf24',
              minHeight: 120,
              transition: 'all 0.3s',
            }}
          >
            <Statistic
              title={<Text style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700', letterSpacing: 0.5 }}>Pending</Text>}
              value={stats.pendingTasks}
              valueStyle={{ 
                color: '#faad14',
                fontSize: '40px',
                fontWeight: '900',
              }}
            />
          </MotionCard>
        </MotionCol>

        <MotionCol xs={24} sm={12} lg={6} variants={itemVariants}>
          <MotionCard
            whileHover={{ scale: 1.05, y: -8, boxShadow: '0 8px 32px 0 #fbbf24' }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)',
              border: '2px solid #fbbf24',
              minHeight: 120,
              transition: 'all 0.3s',
            }}
          >
            <Statistic
              title={<Text style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700', letterSpacing: 0.5 }}>Overdue</Text>}
              value={stats.overdueTasks}
              valueStyle={{ 
                color: '#ff4d4f',
                fontSize: '40px',
                fontWeight: '900',
              }}
            />
          </MotionCard>
        </MotionCol>
      </MotionRow>

      <MotionRow 
        gutter={[32, 32]} 
        style={{ marginTop: '32px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCol xs={24} lg={12} variants={itemVariants}>
          <MotionCard
            title={
              <Space>
                <CalendarOutlined style={{ color: '#fbbf24', fontSize: 22 }} />
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#fbbf24' }}>Task Completion Rate</span>
              </Space>
            }
            whileHover={{ scale: 1.02, boxShadow: '0 8px 32px 0 #fbbf24' }}
            whileTap={{ scale: 0.99 }}
            style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)',
              border: '2px solid #fbbf24',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Progress
                type="circle"
                percent={completionRate}
                width={200}
                strokeColor={'#fbbf24'}
                trailColor={'#f7fafd'}
                strokeWidth={10}
              />
              <Text style={{ 
                marginTop: '16px',
                fontSize: '18px',
                color: '#fbbf24',
                fontWeight: '700'
              }}>
                {completionRate}% of tasks completed
              </Text>
            </div>
          </MotionCard>
        </MotionCol>

        <MotionCol xs={24} lg={12} variants={itemVariants}>
          <MotionCard
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#fbbf24', fontSize: 22 }} />
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#fbbf24' }}>Recent Tasks</span>
              </Space>
            }
            whileHover={{ scale: 1.02, boxShadow: '0 8px 32px 0 #fbbf24' }}
            whileTap={{ scale: 0.99 }}
            style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)',
              border: '2px solid #fbbf24',
            }}
          >
            <List
              dataSource={recentTasks}
              renderItem={(task) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Text style={{ 
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#fbbf24'
                        }}>
                          {task.title}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary" style={{ fontSize: '15px', color: '#23232a' }}>
                            {task.description}
                          </Text>
                          <Tag 
                            color={getStatusColor(task.status)} 
                            icon={getStatusIcon(task.status)}
                            style={{
                              borderRadius: '12px',
                              padding: '4px 12px',
                              fontSize: '13px',
                              fontWeight: '600',
                              background: '#f7fafd',
                              color: '#fbbf24',
                              border: '1.5px solid #fbbf24'
                            }}
                          >
                            {task.status}
                          </Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                </motion.div>
              )}
            />
          </MotionCard>
        </MotionCol>
      </MotionRow>
    </Content>
  );
};

export default Dashboard; 