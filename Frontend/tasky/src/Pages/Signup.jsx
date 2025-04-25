import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Signup.css";

const { Title, Text, Link } = Typography;
const { Option } = Select;

axios.defaults.withCredentials = true;

const Signup = () => {
  const [role, setRole] = useState("user");
  const [file, setFile] = useState(null);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("role", role);
      formData.append("occupation", values.occupation);

      if (file) {
        formData.append("profilePic", file); // Key matches backend field name
      }

      const res = await axios.post(
        "http://localhost:9000/api/users/register", // updated as per original file
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Registration successful!");
      console.log("Registered:", res.data);
    } catch (err) {
      console.error("Registration Error:", err);
      message.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleFileChange = (info) => {
    if (info.file.status !== "removed") {
      setFile(info.file.originFileObj);
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
            rules={[
              { required: true, message: "Please input your occupation!" },
            ]}
          >
            <Input placeholder="e.g., Student, Developer, Manager" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Invalid email!" }]}
          >
            <Input />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Profile Image Upload */}
          <Form.Item label="Profile Image" name="profilePic">
            <Upload
              beforeUpload={() => false}
              onChange={handleFileChange}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
            </Upload>

            {/* Preview */}
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="Profile Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            )}
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#f5b556",
                borderColor: "#f5b556",
                width: "100%",
              }}
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
