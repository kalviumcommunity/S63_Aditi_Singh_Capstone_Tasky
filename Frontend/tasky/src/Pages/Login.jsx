import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // For redirection
import { useAuth } from "../contexts/AuthContext"; // Access AuthContext
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Layout } from "antd";
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();
  const { isDark } = useTheme();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await login(values.email, values.password);
      message.success("Login successful!");
      // Navigation is handled by AuthContext useEffect
    } catch (error) {
      message.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
      color: 'var(--text-primary)'
    }}>
      <Navbar />
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <Card
            style={{
              background: isDark ? 'var(--card-bg)' : 'white',
              border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: isDark
                ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2} style={{ 
                color: 'var(--text-primary)',
                marginBottom: 8
              }}>
                Welcome Back
              </Title>
              <Text style={{ 
                color: 'var(--text-secondary)',
                fontSize: 16
              }}>
                Sign in to continue to Tasky
              </Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: 'var(--text-secondary)' }} />}
                  placeholder="Email"
                  size="large"
                  style={{
                    background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                    color: 'var(--text-primary)',
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'var(--text-secondary)' }} />}
                  placeholder="Password"
                  size="large"
                  style={{
                    background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                    color: 'var(--text-primary)',
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    backgroundColor: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    borderColor: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    boxShadow: `0 4px 14px 0 ${isDark ? 'rgba(251, 191, 36, 0.39)' : 'rgba(245, 158, 11, 0.39)'}`,
                    height: 45,
                    fontSize: 16,
                    fontWeight: 500
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>

             

              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: 'var(--text-secondary)' }}>
                  Don't have an account?{' '}
                  <motion.span
                    whileHover={{ color: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}
                    style={{ 
                      color: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </motion.span>
                </Text>
              </div>
            </Form>
          </Card>
        </motion.div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Login;
