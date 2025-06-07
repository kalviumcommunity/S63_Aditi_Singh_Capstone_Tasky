import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Statistic, Typography, List, Tag, Progress, Spin, Space, Modal, Button, Select, message, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CalendarOutlined, LoadingOutlined, PaperClipOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from '../api';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import '../styles/theme.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const MotionCard = motion(Card);
const MotionRow = motion(Row);
const MotionCol = motion(Col);

// Professional color palette
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

// Custom card component with professional styling
const DashboardCard = ({ children, title, icon, ...props }) => (
  <MotionCard
    whileHover={{ scale: 1.02, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
    whileTap={{ scale: 0.98 }}
    style={{
      background: COLORS.card,
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      border: `1px solid ${COLORS.border}`,
      height: '100%',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
    }}
    {...props}
  >
    {title && (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '16px',
        gap: '8px',
        padding: '16px 16px 0',
      }}>
        {icon}
        <Title level={5} style={{ 
          margin: 0, 
          color: COLORS.text.primary,
          fontWeight: 600,
          fontSize: '15px',
          letterSpacing: '0.025em',
        }}>
          {title}
        </Title>
      </div>
    )}
    <div style={{ padding: '0 16px 16px' }}>
      {children}
    </div>
  </MotionCard>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userId = user?._id;

      if (!userId) {
        message.error('Please log in to view your tasks.');
        setLoading(false);
        return;
      }

      setLoading(true);
      const [statsResponse, tasksResponse] = await Promise.all([
        axios.get(`/tasks/stats?userId=${userId}`, { 
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get(`/tasks/user/${userId}`, { 
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (statsResponse.data && tasksResponse.data) {
        setStats(statsResponse.data);
        setRecentTasks(tasksResponse.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        message.error('Please log in again to continue.');
        logout();
      } else {
        message.error('Failed to load dashboard data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskDetails = async (taskId) => {
    setModalLoading(true);
    try {
      const response = await axios.get(`/tasks/task/${taskId}`, { withCredentials: true });
      setSelectedTask(response.data.task);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching task details:', error);
      message.error('Failed to load task details.');
      setSelectedTask(null);
      setIsModalVisible(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleTaskClick = (taskId) => {
    fetchTaskDetails(taskId);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  const handleStatusChange = async (status) => {
    if (!selectedTask) return;

    try {
      setSelectedTask(prevTask => ({ ...prevTask, status }));

      await axios.put(`/tasks/status/${selectedTask._id}`, { status }, { withCredentials: true });
      message.success(`Task status updated to ${status}.`);

      fetchDashboardData();

    } catch (error) {
      console.error('Error updating task status:', error);
      message.error('Failed to update task status.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.5
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
        stiffness: 100,
        damping: 15
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'overdue':
        return COLORS.danger;
      case 'in progress':
        return COLORS.primary;
      default:
        return COLORS.text.subtle;
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
      case 'in progress':
        return <LoadingOutlined />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        background: COLORS.background 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <Layout style={{ minHeight: '100vh', background: COLORS.background }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ 
          padding: '24px',
          background: COLORS.background,
          minHeight: '100vh',
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '32px' }}
          >
            <Space direction="vertical" size={8}>
              <Title level={2} style={{ 
                margin: 0,
                color: COLORS.text.primary,
                fontWeight: 700,
                fontSize: '24px',
                letterSpacing: '-0.025em',
              }}>
                Welcome back{user?.name ? `, ${user.name}` : ''}
              </Title>
              <Text style={{
                color: COLORS.text.secondary,
                fontSize: '15px',
                fontWeight: 400,
              }}>
                Here's your task overview and progress
              </Text>
            </Space>
          </motion.div>

          <MotionRow 
            gutter={[24, 24]} 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: 32 }}
          >
            <MotionCol xs={24} sm={12} lg={6} variants={itemVariants}>
              <DashboardCard
                icon={<BarChartOutlined style={{ color: COLORS.primary, fontSize: '18px' }} />}
                title="Total Tasks"
              >
                <Statistic
                  value={stats.totalTasks}
                  valueStyle={{ 
                    color: COLORS.text.primary,
                    fontSize: '28px',
                    fontWeight: 700,
                  }}
                />
              </DashboardCard>
            </MotionCol>

            <MotionCol xs={24} sm={12} lg={6} variants={itemVariants}>
              <DashboardCard
                icon={<CheckCircleOutlined style={{ color: COLORS.success, fontSize: '18px' }} />}
                title="Completed"
              >
                <Statistic
                  value={stats.completedTasks}
                  valueStyle={{ 
                    color: COLORS.success,
                    fontSize: '28px',
                    fontWeight: 700,
                  }}
                />
              </DashboardCard>
            </MotionCol>

            <MotionCol xs={24} sm={12} lg={6} variants={itemVariants}>
              <DashboardCard
                icon={<ClockCircleOutlined style={{ color: COLORS.warning, fontSize: '18px' }} />}
                title="Pending"
              >
                <Statistic
                  value={stats.pendingTasks}
                  valueStyle={{ 
                    color: COLORS.warning,
                    fontSize: '28px',
                    fontWeight: 700,
                  }}
                />
              </DashboardCard>
            </MotionCol>

            <MotionCol xs={24} sm={12} lg={6} variants={itemVariants}>
              <DashboardCard
                icon={<ExclamationCircleOutlined style={{ color: COLORS.danger, fontSize: '18px' }} />}
                title="Overdue"
              >
                <Statistic
                  value={stats.overdueTasks}
                  valueStyle={{ 
                    color: COLORS.danger,
                    fontSize: '28px',
                    fontWeight: 700,
                  }}
                />
              </DashboardCard>
            </MotionCol>
          </MotionRow>

          <MotionRow gutter={[24, 24]} variants={containerVariants} initial="hidden" animate="visible">
            <MotionCol xs={24} lg={12} variants={itemVariants}>
              <DashboardCard
                icon={<BarChartOutlined style={{ color: COLORS.primary, fontSize: '18px' }} />}
                title="Task Completion Rate"
                style={{ height: '100%' }}
              >
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px 0'
                }}>
                  <Progress
                    type="circle"
                    percent={completionRate}
                    size={160}
                    strokeColor={{
                      '0%': COLORS.primary,
                      '100%': COLORS.success,
                    }}
                    trailColor={COLORS.border}
                    strokeWidth={10}
                    format={percent => (
                      <div style={{ textAlign: 'center' }}>
                        <Text style={{
                          color: COLORS.text.primary,
                          fontSize: '32px',
                          fontWeight: 700,
                          lineHeight: 1.2,
                        }}>
                          {`${percent}%`}
                        </Text>
                        <Text style={{
                          color: COLORS.text.secondary,
                          fontSize: '14px',
                          display: 'block',
                          marginTop: '4px'
                        }}>
                          Completion Rate
                        </Text>
                      </div>
                    )}
                  />
                </div>
              </DashboardCard>
            </MotionCol>

            <MotionCol xs={24} lg={12} variants={itemVariants}>
              <DashboardCard
                icon={<CalendarOutlined style={{ color: COLORS.primary, fontSize: '18px' }} />}
                title="Recent Tasks"
                style={{ height: '100%' }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={recentTasks}
                  style={{ 
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '0 4px'
                  }}
                  renderItem={task => (
                    <List.Item
                      key={task._id}
                      style={{
                        padding: '12px',
                        margin: '8px 0',
                        borderRadius: '8px',
                        border: `1px solid ${COLORS.border}`,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        background: COLORS.card,
                      }}
                      onClick={() => handleTaskClick(task._id)}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                        e.currentTarget.style.background = COLORS.hover;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background = COLORS.card;
                      }}
                    >
                      <List.Item.Meta
                        title={
                          <Text style={{ 
                            color: COLORS.text.primary,
                            fontWeight: 600,
                            fontSize: '15px',
                            marginBottom: '4px',
                            display: 'block'
                          }}>
                            {task.title}
                          </Text>
                        }
                        description={
                          <Space direction="vertical" size={8} style={{ width: '100%' }}>
                            <Space>
                              <UserOutlined style={{ color: COLORS.text.secondary }} />
                              <Text style={{ color: COLORS.text.secondary, fontSize: '14px' }}>
                                {task.assignedTo?.name || 'Unassigned'}
                              </Text>
                            </Space>
                            <Tag 
                              color={getStatusColor(task.status)} 
                              icon={getStatusIcon(task.status)}
                              style={{
                                margin: 0,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: 500,
                                fontSize: '12px',
                                border: 'none',
                                color: task.status === 'completed' ? '#fff' : (task.status === 'in progress' ? '#fff' : COLORS.text.primary)
                              }}
                            >
                              {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'Unknown'}
                            </Tag>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </DashboardCard>
            </MotionCol>
          </MotionRow>
        </Content>
      </Layout>

      {/* Task Details Modal */}
      <Modal
        title={
          <Space>
            <CalendarOutlined style={{ color: COLORS.primary, fontSize: '18px' }} />
            <Title level={4} style={{ margin: 0, color: COLORS.text.primary, fontWeight: 600 }}>
              {selectedTask?.title}
            </Title>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button 
            key="back" 
            onClick={handleModalClose}
            style={{ 
              padding: '6px 16px',
              height: '36px',
              borderRadius: '6px',
              fontWeight: 500,
              background: COLORS.background,
              borderColor: COLORS.border,
              color: COLORS.text.primary,
            }}
          >
            Close
          </Button>,
        ]}
        centered
        width={600}
        bodyStyle={{ 
          padding: '24px',
          background: COLORS.card,
          borderRadius: '0 0 12px 12px'
        }}
        style={{ borderRadius: '12px' }}
      >
        {modalLoading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 200 
          }}>
            <Spin size="large" />
          </div>
        ) : selectedTask ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={5} style={{ 
                color: COLORS.text.primary,
                marginBottom: '12px',
                fontWeight: 600,
                fontSize: '15px'
              }}>
                Description
              </Title>
              <Paragraph style={{ 
                color: COLORS.text.secondary,
                fontSize: '14px',
                lineHeight: 1.6,
                margin: 0
              }}>
                {selectedTask.description || 'No description provided.'}
              </Paragraph>
            </div>

            <Divider style={{ margin: '16px 0', borderColor: COLORS.border }} />

            <div>
              <Title level={5} style={{ 
                color: COLORS.text.primary,
                marginBottom: '12px',
                fontWeight: 600,
                fontSize: '15px'
              }}>
                Task Details
              </Title>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ color: COLORS.text.secondary, display: 'block', marginBottom: '4px' }}>
                    Assigned To
                  </Text>
                  <Space>
                    <UserOutlined style={{ color: COLORS.text.secondary }} />
                    <Text style={{ color: COLORS.text.secondary }}>
                      {selectedTask.assignedTo?.name || 'Unassigned'}
                    </Text>
                  </Space>
                </div>

                <div>
                  <Text strong style={{ color: COLORS.text.secondary, display: 'block', marginBottom: '4px' }}>
                    Status
                  </Text>
                  <Tag 
                    color={getStatusColor(selectedTask.status)} 
                    icon={getStatusIcon(selectedTask.status)}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 500,
                      fontSize: '12px',
                      border: 'none',
                      color: selectedTask.status === 'completed' ? '#fff' : (selectedTask.status === 'in progress' ? '#fff' : COLORS.text.primary)
                    }}
                  >
                    {selectedTask.status ? selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1) : 'Unknown'}
                  </Tag>
                </div>

                <div>
                  <Text strong style={{ color: COLORS.text.secondary, display: 'block', marginBottom: '4px' }}>
                    Update Status
                  </Text>
                  <Select
                    defaultValue={selectedTask.status}
                    style={{ 
                      width: 200,
                      borderRadius: '6px'
                    }}
                    onChange={handleStatusChange}
                    disabled={modalLoading}
                  >
                    {selectedTask.status === 'completed' ? null : (
                      <Option value="in progress">In Progress</Option>
                    )}
                    {selectedTask.status === 'completed' ? null : (
                      <Option value="completed">Completed</Option>
                    )}
                    {selectedTask.status === 'overdue' ? (
                      <Option value="in progress">In Progress</Option>
                    ) : null}
                  </Select>
                </div>
              </Space>
            </div>

            {selectedTask.attachments && selectedTask.attachments.length > 0 && (
              <>
                <Divider style={{ margin: '16px 0', borderColor: COLORS.border }} />
                <div>
                  <Title level={5} style={{ 
                    color: COLORS.text.primary,
                    marginBottom: '12px',
                    fontWeight: 600,
                    fontSize: '15px'
                  }}>
                    Attachments
                  </Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={selectedTask.attachments}
                    renderItem={attachment => (
                      <List.Item
                        style={{
                          padding: '12px',
                          borderRadius: '6px',
                          border: `1px solid ${COLORS.border}`,
                          marginBottom: '8px',
                          background: COLORS.background
                        }}
                        actions={[
                          <Button 
                            type="link" 
                            href={`http://localhost:9000/uploads/tasks/${attachment.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              color: COLORS.primary,
                              padding: '4px 8px'
                            }}
                          >
                            Download
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<PaperClipOutlined style={{ color: COLORS.text.secondary, fontSize: '16px' }} />}
                          title={
                            <Text style={{ 
                              color: COLORS.text.primary,
                              fontSize: '14px',
                              fontWeight: 500
                            }}>
                              {attachment.originalName}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </>
            )}
          </Space>
        ) : null}
      </Modal>
    </Layout>
  );
};

export default Dashboard; 