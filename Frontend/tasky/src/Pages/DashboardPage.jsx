// DashboardPage.jsx
import React from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";  // Adjust path as needed
import UserNavbar from "../components/UserNavbar";  // Your sticky nav
import TaskSummary from "../components/TaskSummary";
import { useAuth } from "../contexts/AuthContext";  // Hook to get auth info

const { Content } = Layout;

const DashboardPage = () => {
  const { user } = useAuth();  // Get the user info from AuthContext

  if (!user) {
    return <div>Loading...</div>;  // Show loading while user is being fetched
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Sidebar role={user?.role} />  {/* Pass the role to Sidebar */}

      <Layout>
        <UserNavbar />
        <Content style={{ padding: "24px" }}>
          <TaskSummary />
          {user?.role === "admin" && (
  <div style={{ marginTop: "32px" }}>
   
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      
      <button
        style={{
          backgroundColor: "#3b82f6", // blue-500
          color: "white",
          padding: "12px 20px",
          border: "none",
          borderRadius: "12px",
          fontWeight: "500",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "background 0.2s ease",
        }}
      >
        Assign Tasks
      </button>
    </div>
  </div>
)}

        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
