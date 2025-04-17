import React, { useState } from "react";
import { Form, Input, Button, Typography, Select } from "antd";
import "./Login.css";

const { Title, Text, Link } = Typography;
const { Option } = Select;

const Login = () => {
  const [role, setRole] = useState("user");

  const onFinish = (values) => {
    console.log("Form Values:", { ...values, role });
  };

  return (
    <div className="login-background">
      {/* Decorative Squares */}
      <div className="square one"></div>
      <div className="square two"></div>
      <div className="square three"></div>
      <div className="square four"></div>
      <div className="square five"></div>
      <div className="square six"></div>

      <div className="login-box">
        <Title level={2} style={{ color: "#000", textAlign: "center" }}>
          TASKY <Text style={{ fontSize: "12px" }}>{role}</Text>
        </Title>

        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item label="Role" name="role">
            <Select value={role} onChange={(val) => setRole(val)}>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#f5b556", borderColor: "#f5b556", width: "100%" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text>New to Tasky? </Text>
          <Link href="/signup" style={{ color: "#f5b556" }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
