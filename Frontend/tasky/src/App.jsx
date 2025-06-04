import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './Pages/LandingPage';
import AboutPage from './Pages/AboutPage';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import AdminDashboard from './Pages/AdminDashboard';
 import Report from './Pages/ReportsPage';
import ManageUsers from './Pages/ManageUsers';
import Unauthorized from './Pages/Unauthorized';
import './styles/theme.css';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

// Public Route Component - redirects to appropriate dashboard if already logged in
const PublicRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" />;
        }
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <ThemeProvider>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#fbbf24',
                        },
                    }}
                >
                    <AuthProvider>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                            <Route path="/unauthorized" element={<Unauthorized />} />

                            {/* Protected User Routes */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />

                            {/* Protected Admin Routes */}
                            <Route path="/admin/dashboard" element={
                                <ProtectedRoute requireAdmin>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/reports" element={
                                <ProtectedRoute requireAdmin>
                                    <Report />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/profile" element={
                                <ProtectedRoute requireAdmin>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/manage-users" element={
                                <ProtectedRoute requireAdmin>
                                    <ManageUsers />
                                </ProtectedRoute>
                            } />

                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </AuthProvider>
                </ConfigProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
