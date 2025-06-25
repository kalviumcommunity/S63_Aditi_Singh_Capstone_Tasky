import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Table, Spin, Empty, Select } from 'antd';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import PieChartComponent from '../components/PieChartComponent';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title as ChartTitle
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartTitle);

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://s63-aditi-singh-capstone-tasky-1.onrender.com/api/users/users', {
        withCredentials: true,
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const fetchReportSummary = async (userId, priority) => {
      try {
        const response = await axios.get('https://s63-aditi-singh-capstone-tasky-1.onrender.com/api/reports/summary', {
          withCredentials: true,
          params: { userId, priority },
        });
        setReportData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching report summary:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchReportSummary(selectedUser, selectedPriority);
    fetchUsers();
  }, [selectedUser, selectedPriority]);

  if (loading || !reportData) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <AdminSidebar />
        <Layout style={{ marginLeft: 200 }}>
          <Content style={{ padding: '24px' }}>
            <Spin tip="Loading Report...">
              <div style={{ minHeight: '500px' }} />
            </Spin>
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <AdminSidebar />
        <Layout style={{ marginLeft: 200 }}>
          <Content style={{ padding: '24px' }}>
            <Title level={4} type="danger">Error Loading Report</Title>
            <Text>Failed to load report data. Please try again later.</Text>
          </Content>
        </Layout>
      </Layout>
    );
  }

  const overdueTasksColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate) => dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Assigned To',
      dataIndex: ['assignedTo', 'name'],
      key: 'assignedTo',
      render: (name) => name || 'Unassigned',
    },
  ];

  const userTaskSummaryColumns = [
    { title: 'User Name', dataIndex: 'userName', key: 'userName', render: (name) => name || 'Unassigned' },
    { title: 'User Email', dataIndex: 'userEmail', key: 'userEmail', render: (email) => email || 'N/A' },
    { title: 'Total Tasks', dataIndex: 'totalTasks', key: 'totalTasks' },
    { title: 'Completed', dataIndex: 'completedTasks', key: 'completedTasks' },
    { title: 'Pending', dataIndex: 'pendingTasks', key: 'pendingTasks' },
    { title: 'In Progress', dataIndex: 'inProgressTasks', key: 'inProgressTasks' },
  ];

  const priorityChartData = {
    labels: reportData.taskPrioritySummary.map(item => item.priority),
    datasets: [
      {
        label: 'Number of Tasks',
        data: reportData.taskPrioritySummary.map(item => item.count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const priorityChartOptions = {
    responsive: true,
    plugins: {
      chartTitle: {
        display: true,
        text: 'Task Priority Distribution',
      },
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Tasks' },
      },
      x: {
        title: { display: true, text: 'Priority' },
      },
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar />
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ padding: '24px' }}>
          <Title level={2}>Task Report</Title>

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col>
              <Text strong>Filter by User:</Text>
              <Select
                allowClear
                style={{ width: 200, marginLeft: '8px' }}
                placeholder="Select User"
                onChange={value => setSelectedUser(value)}
                value={selectedUser}
              >
                {users.map(user => (
                  <Option key={user._id} value={user._id}>{user.name} ({user.email})</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Text strong>Filter by Priority:</Text>
              <Select
                allowClear
                style={{ width: 200, marginLeft: '8px' }}
                placeholder="Select Priority"
                onChange={value => setSelectedPriority(value)}
                value={selectedPriority}
              >
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
                <Option value="Urgent">Urgent</Option>
              </Select>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title="Task Status Summary">
                <PieChartComponent
                  summary={{
                    completed: reportData.taskStatusSummary.find(t => t.status === 'Completed')?.count || 0,
                    pending: reportData.taskStatusSummary.find(t => t.status === 'Pending')?.count || 0,
                    inProgress: reportData.taskStatusSummary.find(t => t.status === 'In Progress')?.count || 0,
                    overdue: reportData.overdueTasks.length || 0
                  }}
                  loading={loading}
                  error={error}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Task Priority Summary">
                <div style={{ height: '300px' }}>
                  <Bar data={priorityChartData} options={priorityChartOptions} />
                </div>
              </Card>
            </Col>
          </Row>

          <Card title={`Overdue Tasks (${reportData.overdueTasks.length})`} style={{ marginBottom: '24px' }}>
            <Table
              dataSource={reportData.overdueTasks}
              columns={overdueTasksColumns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No overdue tasks" /> }}
            />
          </Card>

          <Card title="User Task Summary" style={{ marginBottom: '24px' }}>
            <Table
              dataSource={reportData.userTaskSummary}
              columns={userTaskSummaryColumns}
              rowKey="userId"
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No user task data" /> }}
            />
          </Card>

          <Card title="This Week's Task Count" style={{ marginBottom: '24px' }}>
            <Text><strong>Tasks Created in the Last 7 Days:</strong> {reportData.thisWeeksTasksCount}</Text>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Report;
