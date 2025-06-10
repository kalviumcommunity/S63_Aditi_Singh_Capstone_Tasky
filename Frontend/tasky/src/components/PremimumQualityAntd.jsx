import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { motion } from 'framer-motion';
import {
    RocketOutlined,
    ThunderboltOutlined,
    SafetyOutlined,
    GlobalOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const PremiumQualityAntd = () => {
    const features = [
        {
            icon: <RocketOutlined />,
            title: "Lightning Fast",
            description: "Optimized performance for instant task updates and real-time collaboration."
        },
        {
            icon: <ThunderboltOutlined />,
            title: "Powerful Features",
            description: "Advanced tools and capabilities to handle complex project requirements."
        },
        {
            icon: <SafetyOutlined />,
            title: "Enterprise Ready",
            description: "Built with security and scalability in mind for business use."
        },
        {
            icon: <GlobalOutlined />,
            title: "Global Access",
            description: "Access your tasks from anywhere, anytime with cloud synchronization."
        }
    ];

  return (
        <div style={{ 
            padding: '60px 0',
            background: 'var(--bg-secondary)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background gradient effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(251, 191, 36, 0.05), rgba(245, 158, 11, 0.05))',
                zIndex: 0
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                style={{ 
                    textAlign: 'center', 
                    marginBottom: 60,
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Title level={2} style={{ 
                    color: 'var(--text-primary)',
                    marginBottom: 20,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    Premium Quality Experience
                </Title>
                <Text style={{ 
                    fontSize: 18,
                    color: 'var(--text-secondary)',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Built with the latest technologies for optimal performance
                </Text>
            </motion.div>

            <Row gutter={[24, 24]} justify="center" style={{ position: 'relative', zIndex: 1 }}>
                {features.map((feature, index) => (
                    <Col xs={24} sm={12} md={6} key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                        >
                            <Card
                                hoverable
                                style={{
                                    height: '100%',
                                    flex: 1,
                                    background: 'white',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease'
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
                                        color: 'var(--accent-secondary)',
                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                    }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <Title level={4} style={{ 
                                    marginBottom: '12px',
                                    color: 'var(--text-primary)',
                                    fontWeight: 600
                                }}>
                                    {feature.title}
                                </Title>
                                <Text style={{ 
                                    color: 'var(--text-secondary)',
                                    fontSize: '16px',
                                    lineHeight: 1.6,
                                    flexGrow: 1
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

export default PremiumQualityAntd;
