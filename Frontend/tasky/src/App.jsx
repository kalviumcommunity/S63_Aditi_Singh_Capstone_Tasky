import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Sidebar from './components/Sidebar';
import TaskSummary from './components/TaskSummary';
import UserNavbar from './components/UserNavbar';
import DashboardPage from './Pages/DashboardPage';
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Define the home route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasksummary" element={<TaskSummary />} />
        <Route path="/usernavbar" element={<UserNavbar/>} />


        
      </Routes>
    </Router>
  );
}
