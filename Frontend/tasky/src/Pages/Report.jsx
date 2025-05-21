import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Table, Spin, Empty, Select } from 'antd';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
// We will import chart components later
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, // For Pie and Doughnut charts
  Tooltip,
  Legend,
  CategoryScale, // For Bar charts
  LinearScale, // For Bar charts
  BarElement,
  Title as ChartTitle // Avoid conflict with Ant Design Title
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle
);

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

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/users/users', {
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
        const response = await axios.get('http://localhost:9000/api/reports/summary', {
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

  if (loading) {
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

  if (!reportData) {
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

  // Define columns for tables
  const overdueTasksColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
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
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      render: (name) => name || 'Unassigned',
    },
     {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
      render: (email) => email || 'N/A',
    },
    {
      title: 'Total Tasks',
      dataIndex: 'totalTasks',
      key: 'totalTasks',
    },
    {
      title: 'Completed',
      dataIndex: 'completedTasks',
      key: 'completedTasks',
    },
    {
      title: 'Pending',
      dataIndex: 'pendingTasks',
      key: 'pendingTasks',
    },
     {
      title: 'In Progress',
      dataIndex: 'inProgressTasks',
      key: 'inProgressTasks',
    },
  ];

  // Prepare data for Task Status Chart (Pie Chart)
  const statusChartData = {
    labels: reportData.taskStatusSummary.map(item => item.status),
    datasets: [
      {
        label: 'Number of Tasks',
        data: reportData.taskStatusSummary.map(item => item.count),
        backgroundColor: [
          '#FF6384', // Completed
          '#FFCE56', // Pending
          '#36A2EB', // In Progress
          // Add more colors if you have other statuses
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#FFCE56',
          '#36A2EB',
          // Add more colors if you have other statuses
        ],
      },
    ],
  };

  // Prepare data for Task Priority Chart (Bar Chart)
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
          // Add more colors if you have other priorities
        ],
        borderColor: [
           'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          // Add more colors if you have other priorities
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
        text: 'Task Priority Distribution', // Title for the bar chart
      },
      legend: {
        position: 'top', // Position the legend at the top
      },
    },
     scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks', // Label for the y-axis
        },
      },
      x: {
        title: {
          display: true,
          text: 'Priority', // Label for the x-axis
        },
      },
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar />
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ padding: '24px' }}>
          <Title level={2}>Task Report</Title>

          {/* Filter Dropdowns */}
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

          {/* Task Status and Priority Summaries side-by-side */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}> {/* Takes full width on extra small, half width on large and above */}
              {/* Task Status Summary (Pie Chart) */}
              <Card title="Task Status Summary">
                 <div style={{ height: '300px' }}> {/* Adjust height as needed */}
                    <Pie data={statusChartData} />
                 </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}> {/* Takes full width on extra small, half width on large and above */}
              {/* Task Priority Summary (Bar Chart) */}
              <Card title="Task Priority Summary">
                 <div style={{ height: '300px' }}> {/* Adjust height as needed */}
                   <Bar data={priorityChartData} options={priorityChartOptions} />
                </div>
              </Card>
            </Col>
          </Row>

          {/* Overdue Tasks */}
          <Card title={`Overdue Tasks (${reportData.overdueTasks.length})`} style={{ marginBottom: '24px' }}>
            <Table
              dataSource={reportData.overdueTasks}
              columns={overdueTasksColumns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No overdue tasks" /> }}
            />
          </Card>

          {/* User Task Summary Table */}
           <Card title="User Task Summary" style={{ marginBottom: '24px' }}>
            <Table
              dataSource={reportData.userTaskSummary}
              columns={userTaskSummaryColumns}
               rowKey="userId"
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No user task data" /> }}
            />
          </Card>

          {/* This Week's Task Count */}
           <Card title="This Week's Task Count" style={{ marginBottom: '24px' }}>
             <Text><strong>Tasks Created in the Last 7 Days:</strong> {reportData.thisWeeksTasksCount}</Text>
          </Card>

        </Content>
      </Layout>
    </Layout>
  );
};

export default Report; 