import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Spin, Row, Col, Card, message, Empty, Layout } from 'antd';
import CalendarView from '../components/CalendarView';
import PieChartComponent from '../components/PieChartComponent';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';

import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { Option } = Select;
const { Content } = Layout;

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
  const [summary, setSummary] = useState({
    completed: 0,
    pending: 0,
    overdue: 0
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = user?._id;

        if (!userId) {
          message.error('Please log in to view reports.');
          setLoading(false);
          return;
        }

        // Use dayjs with UTC for timezone awareness
        const dateParam = dayjs(selectedDate).utc().toISOString();
        const res = await axios.get(`http://localhost:9000/api/reports/${reportType}/${userId}?date=${dateParam}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Validate the response data
        if (!res.data || typeof res.data !== 'object') {
          throw new Error('Invalid response format from server');
        }

        // Ensure the statusData has the required properties
        const statusData = res.data.statusData || {};
        const validatedSummary = {
          completed: Number(statusData.completed) || 0,
          pending: Number(statusData.pending) || 0,
          overdue: Number(statusData.overdue) || 0
        };

        setTasks(Array.isArray(res.data.tasks) ? res.data.tasks : []);
        setSummary(validatedSummary);
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
      <Sidebar /> {/* Add the regular Sidebar */}
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