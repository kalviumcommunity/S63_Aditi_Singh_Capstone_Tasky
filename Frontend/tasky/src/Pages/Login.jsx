   import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // For redirection
import { useAuth } from "../contexts/AuthContext"; // Access AuthContext
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

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // You may want to send user info to your backend here for session/token
      updateUser({
        name: user.displayName,
        email: user.email,
        profileImage: user.photoURL,
        // Add more fields as needed
      });
      message.success('Google sign-in successful!');
      navigate('/');
    } catch (error) {
      message.error(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />
      <Content style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card
            bordered={false}
            style={{
              width: 400,
              background: 'var(--card-bg)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>Login</Title>
              <Text style={{
                color: 'var(--text-secondary)'
              }}>Access your TASKY account</Text>
            </div>
            <Form
              name="login"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your Email!' },
                  { type: 'email', message: 'Please enter a valid Email!' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your Password!' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{
                  width: '100%',
                  background: '#f97316',
                  borderColor: '#f97316',
                  boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.39)'
                }}>
                  Log in
                </Button>
              </Form.Item>

              {/* Optional: Google Sign-In Button */}
              <Form.Item>
                 <Button type="default" onClick={handleGoogleSignIn} style={{
                  width: '100%',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                 }}>
                   {/* Add Google icon here if you have one */} 
                   Sign in with Google
                 </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: 'var(--text-secondary)' }}>
                  Or <a href="/signup">register now!</a>
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
 