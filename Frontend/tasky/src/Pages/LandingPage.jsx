// src/App.jsx
import React from 'react';
import { Button, Layout, Typography, Space } from 'antd';
import { DashboardOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import logo from '../assets/logo.png'; // Adjust the path if needed
import Features from '../components/Features'; // ✅ Import Features here
import PremiumQualityAntd from '../components/PremimumQualityAntd';
import Subscribe from '../components/Subscribe';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackgroundEffect from '../components/BackgroundEffect';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function LandingPage() {
    const navigate = useNavigate();
    const { isDark } = useTheme();

  return (
        <Layout style={{ 
            minHeight: '50vh', 
            background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
            color: 'var(--text-primary)'
        }}>
            <BackgroundEffect />
      <Navbar />

            <Content style={{ padding: '60px 100px', position: 'relative' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ display: 'flex', gap: '50px', alignItems: 'stretch' }}
                >
          {/* Left Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ 
                                color: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                fontWeight: 600 
                            }}
                        >
                            • Streamline your workflow
                        </motion.span>
                        <Title style={{
                            marginTop: 10,
                            fontSize: 46,
                            color: 'var(--text-primary)',
                            textShadow: isDark 
                                ? '0 2px 4px rgba(0,0,0,0.3)' 
                                : '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
              FOR TEAMS AND INDIVIDUALS
            </Title>
                        <Paragraph style={{
                            fontSize: 26,
                            color: 'var(--text-secondary)'
                        }}>
              A powerful, intuitive task management system
              designed to help teams collaborate efficiently and track progress seamlessly.
            </Paragraph>

            <Space size="middle" style={{ marginTop: 20 }}>
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
                                Sign Up
                            </Button>
                            <Button
                                size="large"
                                style={{
                                    borderColor: 'var(--text-primary)',
                                    color: 'var(--text-primary)',
                                    background: 'transparent',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Button>
            </Space>

            <Space style={{ marginTop: 40 }} size="large">
                            {[
                                { icon: <DashboardOutlined />, text: "Track progress easily" },
                                { icon: <TeamOutlined />, text: "Team collaboration" },
                                { icon: <BarChartOutlined />, text: "Insightful analytics" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    style={{ 
                                        textAlign: 'center', 
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <div style={{ fontSize: '20px' }}>{item.icon}</div>
                                    <div>{item.text}</div>
                                </motion.div>
                            ))}
            </Space>
          </div>

                    {/* Right Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 30px',
                            background: isDark ? 'var(--card-bg)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
                            border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                            boxShadow: isDark
                                ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                                : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
            minHeight: '400px'
                        }}
                    >
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{ 
                                color: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                fontWeight: 600,
                                fontSize: '20px',
                                marginBottom: 10
                            }}
                        >
                            • Dashboard
                        </motion.p>

                        <motion.img
              src={logo}
              alt="Tasky Logo"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'contain',
                marginBottom: 10,
                                filter: isDark 
                                    ? 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.3))'
                                    : 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.3))'
                            }}
                            animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.02, 0.98, 1]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
              }}
            />

                        <Title level={1} style={{
                            marginTop: 10,
                            fontSize: '40px',
                            color: 'var(--text-primary)',
                            letterSpacing: 2,
                            textShadow: isDark 
                                ? '0 2px 4px rgba(0,0,0,0.3)'
                                : '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            TASKY
                        </Title>
                    </motion.div>
                </motion.div>

                <div style={{ marginTop: '100px' }}>
          <Features />
        </div>
      </Content>

            <div style={{ padding: '0px', position: 'relative', zIndex: 1 }}>
      <PremiumQualityAntd />
    </div>
    
            <div id="subscribe-section">
      <Subscribe />
            </div>
            <Footer />
    </Layout>
  );
}
