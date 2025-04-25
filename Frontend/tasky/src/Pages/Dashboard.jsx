import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, List, Typography, Tag, Space } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksResponse, projectsResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/tasks/user', { withCredentials: true }),
          axios.get('http://localhost:3000/api/projects/user', { withCredentials: true })
        ]);

        setTasks(tasksResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'in-progress': 'blue',
      'completed': 'green',
      'delayed': 'red'
    };
    return colors[status.toLowerCase()] || 'default';
  };

  return (
    <Content style={{ padding: '24px' }}>
      <Title level={2}>Welcome back, {user?.name}</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="My Tasks">
            <List
              dataSource={tasks}
              renderItem={(task) => (
                <List.Item>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text strong>{task.title}</Text>
                      <Tag color={getStatusColor(task.status)}>{task.status}</Tag>
                    </Space>
                    <Text type="secondary">{task.description}</Text>
                    <Text type="secondary">Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="My Projects">
            <List
              dataSource={projects}
              renderItem={(project) => (
                <List.Item>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text strong>{project.name}</Text>
                      <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
                    </Space>
                    <Text type="secondary">{project.description}</Text>
                    <Text type="secondary">Team Size: {project.teamSize}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboard; 