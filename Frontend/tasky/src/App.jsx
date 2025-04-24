import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Sidebar from './components/Sidebar';
import TaskSummary from './components/TaskSummary';
import UserNavbar from './components/UserNavbar';
import DashboardPage from './Pages/DashboardPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ManageUsers from './Pages/ManageUsers';
import Unauthorized from './Pages/Unauthorized';
import AboutPage from './Pages/AboutPage';
import './styles/theme.css';
import { ConfigProvider } from 'antd';

export default function App() {
  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#fbbf24',
          },
        }}
      >
        <AuthProvider> 
          <Router>
            <Routes>
              {/* Define the home route */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasksummary" element={<TaskSummary />} />
              <Route path="/usernavbar" element={<UserNavbar/>} />
              <Route path="/manageUsers" element={<ManageUsers/>} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}
