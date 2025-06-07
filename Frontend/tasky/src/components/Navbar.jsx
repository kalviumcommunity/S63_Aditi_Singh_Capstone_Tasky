import React from "react";
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from "antd";
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleMenuClick = (key) => {
        if (key === 'features') {
            const featuresSection = document.querySelector('#features-section');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (key === 'contact') {
            const subscribeSection = document.querySelector('#subscribe-section');
            if (subscribeSection) {
                subscribeSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const menuItems = [
        { key: 'features', label: 'Features' },
        { key: 'contact', label: 'Contact' },
    ];

    if (user) {
        if (user.role === 'admin') {
            menuItems.unshift({ key: 'admin-dashboard', label: 'Admin Dashboard', onClick: () => navigate('/admin/dashboard') });
            menuItems.splice(2, 0, { key: 'manage-users', label: 'Manage Users', onClick: () => navigate('/admin/manage-users') });
        } else {
            menuItems.unshift({ key: 'dashboard', label: 'Dashboard', onClick: () => navigate('/dashboard') });
        }
        menuItems.push({ key: 'profile', label: 'Profile', onClick: () => navigate('/profile') });
    }

    if (user) {
        menuItems.push({
            key: 'logout',
            label: 'Logout',
            onClick: logout,
            danger: true,
        });
    } else {
        menuItems.push({ key: 'login', label: 'Login', onClick: () => navigate('/login') });
        menuItems.push({ key: 'signup', label: 'Signup', onClick: () => navigate('/signup') });
    }

  return (
    <Header
      style={{
                position: "sticky",
                top: 0,
        zIndex: 1000, 
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
                background: "rgba(255, 255, 255, 0.8)",
        padding: "0 40px",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)"
      }}
    >
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
        style={{
          fontSize: 34,
          fontWeight: 600,
          fontFamily: "serif",
                    color: "#1a1a1a",
                    cursor: "pointer",
        }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/')}
      >
        TASKY
            </motion.div>

            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px' 
            }}>
      <Menu
        mode="horizontal"
        selectable={false}
        style={{
          flexGrow: 1,
          justifyContent: "flex-end",
          fontWeight: 500,
          borderBottom: "none",
                        background: "transparent",
        }}
                    onClick={({ key }) => handleMenuClick(key)}
                    items={menuItems}
                />

            </div>
    </Header>
  );
};

export default Navbar;
