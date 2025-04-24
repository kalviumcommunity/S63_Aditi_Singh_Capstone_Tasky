import React, { useState } from "react";
import { Layout, Menu, Button, Typography } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Title } = Typography;
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    console.log("Navigating to:", e.key);
  };

  return (
    <Sider
      width={220}
      style={{
        height: "100vh",
        backgroundColor: "#fdf4e7",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 16px",
      }}
    >
      <div>
        <Title
          level={3}
          style={{
            textAlign: "center",
            fontWeight: 700,
            color: "#000",
            marginBottom: 40,
          }}
        >
          TASKY
        </Title>

        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          style={{
            backgroundColor: "transparent",
            border: "none",
            fontWeight: 500,
          }}
        >
          <Menu.Item
            key="dashboard"
            icon={<DashboardOutlined />}
            onClick={() => navigate('/dashboard')}
            style={{
              borderRadius: "30px",
              marginBottom: "12px",
              padding: "10px 20px",
              backgroundColor: selectedKey === "dashboard" ? "#f5b556" : "transparent",
              fontWeight: selectedKey === "dashboard" ? "bold" : "normal",
            }}
          >
            Dashboard
          </Menu.Item>

          <Menu.Item
            key="reports"
            icon={<FileTextOutlined />}
            style={{
              borderRadius: "30px",
              marginBottom: "12px",
              padding: "10px 20px",
              backgroundColor: selectedKey === "reports" ? "#f5b556" : "transparent",
              fontWeight: selectedKey === "reports" ? "bold" : "normal",
            }}
          >
            Reports
          </Menu.Item>

          {/* Conditionally render profile based on role */}
          {role === "admin" && (
            <Menu.Item
            key="manage-users"
            icon={<UserOutlined />}
            onClick={() => navigate('/manageusers')}
            style={{
              borderRadius: "30px",
              marginBottom: "12px",
              padding: "10px 20px",
              backgroundColor: selectedKey === "manage-users" ? "#f5b556" : "transparent",
              fontWeight: selectedKey === "manage-users" ? "bold" : "normal",
            }}
          >
            Manage Users
          </Menu.Item>
          )}

          <Menu.Item
            key="profile"
            icon={<UserOutlined />}
            style={{
              borderRadius: "30px",
              padding: "10px 20px",
              backgroundColor: selectedKey === "profile" ? "#f5b556" : "transparent",
              fontWeight: selectedKey === "profile" ? "bold" : "normal",
            }}
          >
            Profile
          </Menu.Item>
        </Menu>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            fontWeight: "bold",
            color: "#000",
          }}
          onClick={() => console.log("Logging out...")}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
