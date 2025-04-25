import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Select, DatePicker, Button, Table, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const Reports = () => {
  const [reportType, setReportType] = useState('tasks');
  const [dateRange, setDateRange] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    if (!dateRange[0] || !dateRange[1]) return;

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/reports', {
        params: {
          type: reportType,
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].format('YYYY-MM-DD')
        },
        withCredentials: true
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = {
    tasks: [
      { title: 'Task Name', dataIndex: 'name', key: 'name' },
      { title: 'Status', dataIndex: 'status', key: 'status' },
      { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo' },
      { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
      { title: 'Priority', dataIndex: 'priority', key: 'priority' }
    ],
    projects: [
      { title: 'Project Name', dataIndex: 'name', key: 'name' },
      { title: 'Status', dataIndex: 'status', key: 'status' },
      { title: 'Team Size', dataIndex: 'teamSize', key: 'teamSize' },
      { title: 'Progress', dataIndex: 'progress', key: 'progress' },
      { title: 'Deadline', dataIndex: 'deadline', key: 'deadline' }
    ]
  };

  return (
    <Content style={{ padding: '24px' }}>
      <Title level={2}>Reports</Title>
      
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Select
              style={{ width: '100%' }}
              value={reportType}
              onChange={setReportType}
              options={[
                { value: 'tasks', label: 'Tasks Report' },
                { value: 'projects', label: 'Projects Report' }
              ]}
            />
          </Col>
          <Col xs={24} sm={12}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={setDateRange}
            />
          </Col>
          <Col xs={24} sm={4}>
            <Button type="primary" onClick={fetchReportData} loading={loading}>
              Generate Report
            </Button>
          </Col>
        </Row>
      </Card>

      {reportData.length > 0 && (
        <>
          <Card style={{ marginBottom: '24px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <Table
              columns={columns[reportType]}
              dataSource={reportData}
              rowKey="id"
              loading={loading}
            />
          </Card>
        </>
      )}
    </Content>
  );
};

export default Reports; 