import React, { useState } from "react";
import { Form, Input, Button, Typography, Select } from "antd";
import "./Signup.css";
import axios from "axios";

const { Title, Text, Link } = Typography;
const { Option } = Select;

const Signup = () => {
  const [role, setRole] = useState("user");

  const onFinish = async (values) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        ...values,
        role,
      });
      console.log("Registered:", res.data);
      alert("Registration Successful!");
    } catch (err) {
      console.error("Registration Error:", err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="signup-background">
      {/* Decorative Squares */}
      <div className="square one"></div>
      <div className="square two"></div>
      <div className="square three"></div>
      <div className="square four"></div>
      <div className="square five"></div>
      <div className="square six"></div>

      <div className="signup-box">
        <Title level={2} style={{ color: "#000", textAlign: "center" }}>
          TASKY <Text style={{ fontSize: "12px" }}>{role}</Text>
        </Title>

        <Form name="signup" onFinish={onFinish} layout="vertical">
          {/* Role */}
          <Form.Item label="Role" name="role">
            <Select value={role} onChange={(val) => setRole(val)}>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          {/* Name */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          {/* Occupation */}
          <Form.Item
            label="Occupation"
            name="occupation"
            rules={[{ required: true, message: "Please input your occupation!" }]}
          >
            <Input placeholder="e.g., Student, Developer, Manager" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          {/* Password */}
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text>Already have an account? </Text>
          <Link href="/login" style={{ color: "#f5b556" }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
