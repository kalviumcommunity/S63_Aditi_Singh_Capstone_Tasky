import React from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";        // Adjust path as needed
import UserNavbar from "../components/UserNavbar";  // Your sticky nav
import TaskSummary from "../components/TaskSummary";

const { Content } = Layout;

const DashboardPage = () => {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Sidebar />

      <Layout>
        <UserNavbar />

        <Content style={{ padding: "24px" }}>
          <TaskSummary />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
