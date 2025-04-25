import React from 'react';
import { Layout, Typography, Row, Col, Card, Space, Button } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
    TeamOutlined,
    RocketOutlined,
    SafetyOutlined,
    GlobalOutlined,
    HeartOutlined,
    BulbOutlined
} from '@ant-design/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const AboutPage = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const values = [
        {
            icon: <TeamOutlined />,
            title: "Collaboration",
            description: "We believe in the power of teamwork and seamless collaboration."
        },
        {
            icon: <RocketOutlined />,
            title: "Innovation",
            description: "Constantly pushing boundaries to deliver cutting-edge solutions."
        },
        {
            icon: <SafetyOutlined />,
            title: "Security",
            description: "Your data's security is our top priority."
        },
        {
            icon: <GlobalOutlined />,
            title: "Accessibility",
            description: "Making task management accessible to everyone, everywhere."
        }
    ];

    const team = [
        {
            name: "Aditi Singh",
            role: "Lead Developer",
            description: "Passionate about creating intuitive user experiences and robust solutions."
        },
        {
            name: "Development Team",
            role: "Backend & Frontend",
            description: "Dedicated team of experts working together to build the best task management system."
        }
    ];

    return (
        <Layout style={{ 
            minHeight: '100vh',
            background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
            color: 'var(--text-primary)'
        }}>
            <Navbar />
            <Content>
                {/* Hero Section */}
                <div style={{ 
                    padding: '100px 0 60px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: isDark 
                            ? 'linear-gradient(45deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))'
                            : 'linear-gradient(45deg, rgba(251, 191, 36, 0.05), rgba(245, 158, 11, 0.05))',
                        zIndex: 0
                    }} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ 
                            maxWidth: 1200,
                            margin: '0 auto',
                            padding: '0 24px',
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        <Title level={1} style={{ 
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            marginBottom: 24,
                            textShadow: isDark 
                                ? '0 2px 4px rgba(0,0,0,0.3)'
                                : '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            About Tasky
                        </Title>
                        <Paragraph style={{
                            fontSize: 20,
                            color: 'var(--text-secondary)',
                            textAlign: 'center',
                            maxWidth: 800,
                            margin: '0 auto 40px'
                        }}>
                            Tasky is a powerful task management system designed to help teams collaborate efficiently 
                            and track progress seamlessly. Our mission is to simplify project management while 
                            maintaining the highest standards of quality and user experience.
                        </Paragraph>
                    </motion.div>
                </div>

                {/* Values Section */}
                <div style={{ padding: '60px 0' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        style={{ 
                            maxWidth: 1200,
                            margin: '0 auto',
                            padding: '0 24px'
                        }}
                    >
                        <Title level={2} style={{ 
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            marginBottom: 60
                        }}>
                            Our Values
                        </Title>
                        <Row gutter={[24, 24]}>
                            {values.map((value, index) => (
                                <Col xs={24} sm={12} md={6} key={index}>
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
                                                background: isDark ? 'var(--card-bg)' : 'white',
                                                border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                boxShadow: isDark
                                                    ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                                                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
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
                                                    color: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                                    filter: isDark ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                                }}
                                            >
                                                {value.icon}
                                            </motion.div>
                                            <Title level={4} style={{ 
                                                marginBottom: '12px',
                                                color: 'var(--text-primary)',
                                                fontWeight: 600
                                            }}>
                                                {value.title}
                                            </Title>
                                            <Text style={{ 
                                                color: 'var(--text-secondary)',
                                                fontSize: '16px',
                                                lineHeight: 1.6
                                            }}>
                                                {value.description}
                                            </Text>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>
                </div>

                {/* Team Section */}
                <div style={{ 
                    padding: '60px 0',
                    background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        style={{ 
                            maxWidth: 1200,
                            margin: '0 auto',
                            padding: '0 24px'
                        }}
                    >
                        <Title level={2} style={{ 
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            marginBottom: 60
                        }}>
                            Our Team
                        </Title>
                        <Row gutter={[24, 24]} justify="center">
                            {team.map((member, index) => (
                                <Col xs={24} sm={12} key={index}>
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
                                                background: isDark ? 'var(--card-bg)' : 'white',
                                                border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                boxShadow: isDark
                                                    ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                                                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
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
                                            <Title level={3} style={{ 
                                                marginBottom: '12px',
                                                color: 'var(--text-primary)',
                                                fontWeight: 600
                                            }}>
                                                {member.name}
                                            </Title>
                                            <Text style={{ 
                                                color: 'var(--accent-primary)',
                                                fontSize: '18px',
                                                marginBottom: '16px'
                                            }}>
                                                {member.role}
                                            </Text>
                                            <Text style={{ 
                                                color: 'var(--text-secondary)',
                                                fontSize: '16px',
                                                lineHeight: 1.6
                                            }}>
                                                {member.description}
                                            </Text>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>
                </div>

                {/* CTA Section */}
                <div style={{ 
                    padding: '60px 0',
                    textAlign: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        style={{ 
                            maxWidth: 800,
                            margin: '0 auto',
                            padding: '0 24px'
                        }}
                    >
                        <Title level={2} style={{ 
                            color: 'var(--text-primary)',
                            marginBottom: 24
                        }}>
                            Ready to Get Started?
                        </Title>
                        <Paragraph style={{
                            fontSize: 18,
                            color: 'var(--text-secondary)',
                            marginBottom: 40
                        }}>
                            Join thousands of teams who are already using Tasky to streamline their workflow.
                        </Paragraph>
                        <Space size="large">
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/signup')}
                                style={{
                                    backgroundColor: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                    borderColor: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                    boxShadow: `0 4px 14px 0 ${isDark ? 'rgba(251, 191, 36, 0.39)' : 'rgba(245, 158, 11, 0.39)'}`
                                }}
                            >
                                Sign Up Now
                            </Button>
                            <Button
                                size="large"
                                onClick={() => navigate('/contact')}
                                style={{
                                    borderColor: 'var(--text-primary)',
                                    color: 'var(--text-primary)',
                                    background: 'transparent'
                                }}
                            >
                                Contact Us
                            </Button>
                        </Space>
                    </motion.div>
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

export default AboutPage; 