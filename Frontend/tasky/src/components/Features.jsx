import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
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
    const { isDark } = useTheme();

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
        <div id="features-section" style={{ padding: '40px 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: 60 }}
            >
                <Title level={2} style={{ 
                    color: 'var(--text-primary)',
                    marginBottom: 20 
                }}>
                    Features that Empower Your Workflow
                </Title>
                <Text style={{ 
                    fontSize: 18,
                    color: 'var(--text-secondary)'
                }}>
                    Discover the tools that will transform your task management experience
                </Text>
            </motion.div>

            <Row gutter={[24, 24]}>
                {features.map((feature, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card
                                hoverable
                                style={{
                                    height: '100%',
                                    background: isDark ? 'var(--card-bg)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}
                                bodyStyle={{
                                    padding: '24px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    style={{
                                        fontSize: '36px',
                                        marginBottom: '16px',
                                        color: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                    }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <Title level={4} style={{ 
                                    marginBottom: '12px',
                                    color: 'var(--text-primary)'
                                }}>
                                    {feature.title}
                                </Title>
                                <Text style={{ 
                                    color: 'var(--text-secondary)',
                                    fontSize: '16px'
                                }}>
                                    {feature.description}
                                </Text>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Features;
