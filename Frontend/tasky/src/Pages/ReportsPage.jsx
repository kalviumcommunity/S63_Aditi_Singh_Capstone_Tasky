import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Spin, Row, Col, Card, message, Empty, Layout, Table } from 'antd';
import CalendarView from '../components/CalendarView';
import PieChartComponent from '../components/PieChartComponent';
import AdminSidebar from '../components/AdminSidebar';
import axios from '../api';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { Option } = Select;
const { Content } = Layout;

// Define columns for in-progress tasks table
const inProgressTaskColumns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (dueDate) => dueDate ? dayjs.utc(dueDate).format('YYYY-MM-DD') : 'N/A',
  },
  {
    title: 'Assigned To',
    dataIndex: ['assignedTo', 'name'],
    key: 'assignedTo',
    render: (assignedTo) => assignedTo ? assignedTo.name : 'Unassigned',
  },
];

// Define report types as constants
const REPORT_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

const ReportsPage = () => {
  const [reportType, setReportType] = useState(REPORT_TYPES.DAILY);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [reportData, setReportData] = useState({
    tasks: [],
    statusData: { completed: 0, pending: 0, overdue: 0 },
    inProgressTasks: [],
  });
  const [summary, setSummary] = useState({
    completed: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateParam = dayjs(selectedDate).utc().toISOString();
        const res = await axios.get(`/reports/${reportType}?date=${dateParam}`);
        
        console.log('Report API response data:', res.data);

        // Validate the response data and set reportData state
        if (!res.data || typeof res.data !== 'object') {
          throw new Error('Invalid response format from server');
        }

        // Ensure the statusData and inProgressTasks are present
        const fetchedReportData = {
          tasks: Array.isArray(res.data.tasks) ? res.data.tasks : [],
          statusData: res.data.statusData || {},
          inProgressTasks: Array.isArray(res.data.inProgressTasks) ? res.data.inProgressTasks : [],
        };

        setReportData(fetchedReportData);
        setTasks(fetchedReportData.tasks);

        // Construct and set summary with explicit keys
        setSummary({
          completed: Number(fetchedReportData.statusData.completed) || 0,
          pending: Number(fetchedReportData.statusData.pending) || 0,
          overdue: Number(fetchedReportData.statusData.overdue) || 0,
          inProgress: Number(fetchedReportData.statusData.inProgress) || 0, // Use the correct lowercase key
        });

      } catch (err) {
        console.error('Error fetching report data:', err);
        setError(err.message || 'Failed to fetch report data');
        message.error('Failed to fetch report data');
        // Reset to default values on error
        setTasks([]);
        setSummary({
          completed: 0,
          pending: 0,
          overdue: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportType, selectedDate]); // Include reportType and selectedDate in dependency array

  return (
    <Layout style={{ minHeight: '100vh' }}> {/* Use Ant Design Layout */}
      <AdminSidebar /> {/* Add the AdminSidebar */}
      <Layout className="site-layout" style={{ marginLeft: 200 }}> {/* Use a nested Layout for content */}
        <Content style={{ margin: '0 16px' }}> {/* Add margin for spacing */}
          <div style={{ padding: 24 }}>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col>
                <Select 
                  value={reportType} 
                  onChange={setReportType}
                  disabled={loading}
                  aria-label="Select report type"
                >
                  <Option value={REPORT_TYPES.DAILY}>Daily</Option>
                  <Option value={REPORT_TYPES.WEEKLY}>Weekly</Option>
                  <Option value={REPORT_TYPES.MONTHLY}>Monthly</Option>
                </Select>
              </Col>
              <Col>
                <DatePicker
                  picker={reportType === REPORT_TYPES.MONTHLY ? 'month' : reportType === REPORT_TYPES.WEEKLY ? 'week' : 'date'}
                  value={dayjs(selectedDate)}
                  onChange={date => setSelectedDate(date ? date.toDate() : new Date())}
                  disabled={loading}
                  aria-label="Select report date"
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Card title="Task Status">
                  <PieChartComponent 
                    summary={summary}
                    loading={loading}
                    error={error}
                  />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Calendar">
                  {loading ? (
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Spin tip="Loading calendar data..." />
                    </div>
                  ) : error ? (
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Empty description="Failed to load calendar data" />
                    </div>
                  ) : tasks.length === 0 ? (
                     <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Empty description="No tasks for this date" />
                    </div>
                  ) : (
                    <CalendarView tasks={tasks} />
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ReportsPage; 