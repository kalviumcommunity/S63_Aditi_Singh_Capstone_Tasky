import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  Upload,
  message,
  Card,
  Space,
  Modal,
} from "antd";
import { 
  UploadOutlined, 
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
  SolutionOutlined,
  TeamOutlined 
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Layout } from "antd";
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from '../api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Signup = () => {
  const [role, setRole] = useState("user");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, updateUser } = useAuth();
  const { isDark } = useTheme();
  const [googleUser, setGoogleUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalRole, setModalRole] = useState('user');
  const [modalOccupation, setModalOccupation] = useState('');

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("role", role);
      formData.append("occupation", values.occupation);

      if (file) {
        formData.append("profilePic", file);
      }

      await register(formData);
      message.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      message.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info) => {
    if (info.file.status !== "removed") {
      setFile(info.file.originFileObj);
    }
  };

  // Google Sign Up handler
  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Check if user exists in backend
      const checkRes = await axios.post('/users/check-google', { email: user.email });
      if (checkRes.data.exists) {
        // User exists, log them in
        const loginRes = await axios.post('/users/google-login', { email: user.email });
        const userData = loginRes.data.user;
        updateUser(userData);
        message.success('Welcome back!');
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
        return;
      }
      // If not exists, show modal
      setGoogleUser(user);
      setIsModalVisible(true);
    } catch (error) {
      message.error(error.message || 'Google sign up failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal submit
  const handleModalOk = async () => {
    if (!modalOccupation) {
      message.error('Please enter your occupation');
      return;
    }
    setLoading(true);
    try {
      // Send Google user info + role + occupation to backend
      const formData = new FormData();
      formData.append('name', googleUser.displayName);
      formData.append('email', googleUser.email);
      formData.append('role', modalRole);
      formData.append('occupation', modalOccupation);
      formData.append('profileImage', googleUser.photoURL);
      // You may want to generate a random password or handle passwordless
      formData.append('password', googleUser.uid); // Use UID as a placeholder
      await register(formData);
      message.success('Registration successful!');
      setIsModalVisible(false);
      setGoogleUser(null);
      if (modalRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setGoogleUser(null);
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
          style={{ width: '100%', maxWidth: 500 }}
        >
          <Card
            style={{
              background: isDark ? 'var(--card-bg)' : 'white',
              border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '16px',
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
                Create Your Account
              </Title>
              <Text style={{ 
                color: 'var(--text-secondary)',
                fontSize: 16
              }}>
                Join Tasky and start managing your tasks efficiently
              </Text>
            </div>

            <Form
              name="signup"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select your role!' }]}
              >
                <Select
                  value={role}
                  onChange={(val) => setRole(val)}
                  style={{
                    background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                  }}
                >
                  <Option value="user">
                    <Space>
                      <UserOutlined />
                      User
                    </Space>
                  </Option>
                  <Option value="admin">
                    <Space>
                      <TeamOutlined />
                      Admin
                    </Space>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: 'var(--text-secondary)' }} />}
                  placeholder="Enter your full name"
                  size="large"
                  style={{
                    background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                    color: 'var(--text-primary)',
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Occupation"
                name="occupation"
                rules={[{ required: true, message: 'Please input your occupation!' }]}
              >
                <Input
                  prefix={<SolutionOutlined style={{ color: 'var(--text-secondary)' }} />}
                  placeholder="e.g., Student, Developer, Manager"
                  size="large"
                  style={{
                    background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                    color: 'var(--text-primary)',
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: 'var(--text-secondary)' }} />}
                  placeholder="Enter your email"
                  size="large"
                  style={{
                    background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                    color: 'var(--text-primary)',
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'var(--text-secondary)' }} />}
                  placeholder="Create a password"
                  size="large"
                  style={{
                    background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                    color: 'var(--text-primary)',
                  }}
                />
              </Form.Item>

              <Form.Item label="Profile Picture" name="profilePic">
                <Upload
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button 
                    icon={<UploadOutlined />}
                    style={{
                      background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                      border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Upload Profile Picture
                  </Button>
                </Upload>

                {file && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={URL.createObjectURL(file)}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginTop: "10px",
                      border: `2px solid ${isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)'}`,
                    }}
                  />
                )}
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
                  Create Account
                </Button>
              </Form.Item>

              {/* Google Sign Up Button */}
              <Button
                block
                size="large"
                icon={<img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" style={{ width: 20, marginRight: 8 }} />}
                style={{
                  marginTop: 16,
                  background: '#fff',
                  color: '#23232a',
                  border: '1.5px solid #fbbf24',
                  fontWeight: 600,
                  fontSize: 16,
                  height: 45,
                  boxShadow: '0 2px 8px rgba(251,191,36,0.09)'
                }}
                onClick={handleGoogleSignUp}
                loading={loading}
              >
                Sign up with Google
              </Button>

              <div style={{ textAlign: 'center' }}>
                <Text style={{ color: 'var(--text-secondary)' }}>
                  Already have an account?{' '}
                  <motion.span
                    whileHover={{ color: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}
                    style={{ 
                      color: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </motion.span>
                </Text>
              </div>
            </Form>

            {/* Google Role Selection Modal */}
            <Modal
              title="Complete Your Registration"
              open={isModalVisible}
              onOk={handleModalOk}
              onCancel={handleModalCancel}
              okText="Register"
              confirmLoading={loading}
              cancelButtonProps={{ disabled: loading }}
            >
              <div style={{ marginBottom: 16 }}>
                <b>Name:</b> {googleUser?.displayName}<br />
                <b>Email:</b> {googleUser?.email}
              </div>
              <div style={{ marginBottom: 16 }}>
                <b>Role:</b>
                <Select
                  value={modalRole}
                  onChange={setModalRole}
                  style={{ width: 120, marginLeft: 8 }}
                >
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </div>
              <div>
                <b>Occupation:</b>
                <Input
                  value={modalOccupation}
                  onChange={e => setModalOccupation(e.target.value)}
                  placeholder="e.g., Student, Developer, Manager"
                  style={{ marginTop: 8 }}
                />
              </div>
            </Modal>
          </Card>
        </motion.div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Signup;
