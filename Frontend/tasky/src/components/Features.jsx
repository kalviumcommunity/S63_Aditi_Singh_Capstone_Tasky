import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { motion } from 'framer-motion';
import {
    CalendarOutlined,
    TeamOutlined,
    BarChartOutlined,
    BellOutlined,
    SecurityScanOutlined,
    CloudSyncOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Features = () => {
    const features = [
  {
            icon: <CalendarOutlined />,
            title: "Task Management",
            description: "Organize and track tasks efficiently with our intuitive interface."
  },
  {
            icon: <TeamOutlined />,
            title: "Team Collaboration",
            description: "Work together seamlessly with real-time updates and shared workspaces."
  },
  {
            icon: <BarChartOutlined />,
            title: "Progress Analytics",
            description: "Get detailed insights into your team's performance and project progress."
  },
  {
            icon: <BellOutlined />,
            title: "Smart Notifications",
            description: "Stay updated with intelligent notifications and reminders."
  },
  {
            icon: <SecurityScanOutlined />,
            title: "Secure Platform",
            description: "Your data is protected with enterprise-grade security measures."
  },
  {
            icon: <CloudSyncOutlined />,
            title: "Cloud Sync",
            description: "Access your tasks from anywhere with cloud synchronization."
        }
    ];

    return (
        <div id="features-section" style={{ padding: '60px 0', background: '#fff' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: 40 }}
            >
                <Title level={2} style={{ color: '#333' }}>Features</Title>
                <Text style={{ fontSize: 18, color: '#555' }}>Discover the key features that make TASKY stand out</Text>
            </motion.div>
            <Row gutter={[24, 24]} justify="center">
                {features.map((feature, index) => (
                    <Col xs={24} sm={12} md={8} lg={8} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card
                                bordered={false}
                                style={{
                                    textAlign: 'center',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    background: '#fff',
                                    height: '100%'
                                }}
                            >
                                <div style={{ fontSize: '40px', color: '#f59e0b', marginBottom: '16px' }}>{feature.icon}</div>
                                <Title level={4} style={{ color: '#333' }}>{feature.title}</Title>
                                <Text style={{ color: '#555' }}>{feature.description}</Text>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Features;
