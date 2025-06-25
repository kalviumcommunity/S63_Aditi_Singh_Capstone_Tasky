// src/App.jsx
import React from 'react';
import { Button, Layout, Typography, Space, Row, Col } from 'antd';
import { DashboardOutlined, TeamOutlined, BarChartOutlined, ArrowRightOutlined, RightCircleOutlined, InfoCircleOutlined, ReadOutlined } from '@ant-design/icons';
import logo from '../assets/logo.png'; // Adjust the path if needed
import Features from '../components/Features'; // ✅ Import Features here
import PremiumQualityAntd from '../components/PremimumQualityAntd';
import Subscribe from '../components/Subscribe';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackgroundEffect from '../components/BackgroundEffect';
import { motion } from 'framer-motion';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function LandingPage() {
    const navigate = useNavigate();

  return (
        <Layout style={{ 
            minHeight: '100vh',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)'
        }}>
            <BackgroundEffect />
      <Navbar />

            <Content style={{
              padding: '80px 100px',
              position: 'relative',
              zIndex: 1,
              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--hover-bg) 100%)',
            }}>
                <Row
                    gutter={[48, 48]}
                    align="middle"
                    justify="center"
                >
          {/* Left Section */}
                    <Col xs={24} md={12} lg={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Title level={1} style={{ 
                                fontSize: 'clamp(40px, 6vw, 64px)',
                                fontWeight: 800,
                                marginBottom: '20px',
                                lineHeight: 1.2,
                                color: 'var(--text-primary)'
                             }}>
                                Manage Your Tasks <br /> with Ease
                            </Title>
                            <Paragraph style={{ 
                                fontSize: 'clamp(18px, 2.2vw, 20px)',
                                color: 'var(--text-secondary)',
                                marginBottom: '50px'
                            }}>
                                {`From simple to complex, `}
                                <strong style={{ color: 'var(--accent-primary)' }}>organize, track, and conquer</strong>
                                {` your tasks with our intuitive platform. `}
                                <strong style={{ color: 'var(--accent-primary)' }}>Collaborate seamlessly, visualize progress</strong>
                                {`, and achieve your goals faster.`}
                            </Paragraph>
                            <Space size="large" wrap>
                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        shape="round" 
                                        onClick={() => navigate('/signup')} 
                                        style={{
                                            background: 'var(--accent-primary)',
                                            borderColor: 'var(--accent-primary)',
                                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                                            height: '55px',
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            padding: '0 40px'
                                        }}
                                        icon={<ArrowRightOutlined />}
                                    >
                                        Get Started
                                    </Button>
                                </motion.div>
                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button 
                                        size="large" 
                                        shape="round" 
                                        onClick={() => navigate('/login')} 
                                        style={{
                                            background: 'transparent',
                                            borderColor: 'var(--button-secondary)',
                                            color: 'var(--text-primary)',
                                            height: '55px',
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            padding: '0 40px'
                                        }}
                                        icon={<ReadOutlined />}
                                    >
                                        Learn More
                                    </Button>
                                </motion.div>
                            </Space>
                        </motion.div>
                    </Col>

                    {/* Right Section */}
                    <Col xs={24} md={12} lg={10}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                padding: '20px',
                            }}
                        >
                            <motion.img
                                src={logo} 
                                alt="Tasky Illustration" 
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '12px',
                                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                                }}
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </Col>
                </Row>
            </Content>

            <Features />
            <PremiumQualityAntd />
            <Subscribe />
            <Footer />
        </Layout>
  );
}
  