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

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Signup = () => {
  const [role, setRole] = useState("user");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isDark } = useTheme();

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
          </Card>
        </motion.div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Signup;
