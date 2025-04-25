import React from "react";
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from "antd";
import { motion } from "framer-motion";
import { useTheme } from '../contexts/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;

const Navbar = () => {
    const { isDark } = useTheme();
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
        {
            label: (
                <motion.span
                    whileHover={{ color: isDark ? "#fbbf24" : "#f59e0b" }}
                    style={{ color: isDark ? "#fff" : "#1a1a1a" }}
                >
                    Home
                </motion.span>
            ),
            key: 'home',
            onClick: () => navigate('/')
        },
        {
            label: (
                <motion.span
                    whileHover={{ color: isDark ? "#fbbf24" : "#f59e0b" }}
                    style={{ color: isDark ? "#fff" : "#1a1a1a" }}
                >
                    About
                </motion.span>
            ),
            key: 'about',
            onClick: () => navigate('/about')
        },
        {
            label: (
                <motion.span
                    whileHover={{ color: isDark ? "#fbbf24" : "#f59e0b" }}
                    style={{ color: isDark ? "#fff" : "#1a1a1a" }}
                >
                    Features
                </motion.span>
            ),
            key: "features"
        },
        {
            label: (
                <motion.span
                    whileHover={{ color: isDark ? "#fbbf24" : "#f59e0b" }}
                    style={{ color: isDark ? "#fff" : "#1a1a1a" }}
                >
                    Product
                </motion.span>
            ),
            key: "product"
        },
        {
            label: (
                <motion.span
                    whileHover={{ color: isDark ? "#fbbf24" : "#f59e0b" }}
                    style={{ color: isDark ? "#fff" : "#1a1a1a" }}
                >
                    Contact
                </motion.span>
            ),
            key: "contact"
        },
    ];

    return (
        <Header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.8)",
                padding: "0 40px",
                backdropFilter: "blur(10px)",
                borderBottom: isDark 
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(0, 0, 0, 0.1)",
                boxShadow: isDark
                    ? "0 4px 30px rgba(0, 0, 0, 0.1)"
                    : "0 4px 30px rgba(0, 0, 0, 0.05)"
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
                    color: isDark ? "#fff" : "#1a1a1a",
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

                <ThemeSwitcher />

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => navigate('/signup')}
                        style={{
                            background: isDark ? "#fbbf24" : "#f59e0b",
                            borderColor: isDark ? "#fbbf24" : "#f59e0b",
                            boxShadow: isDark
                                ? "0 4px 14px 0 rgba(251, 191, 36, 0.39)"
                                : "0 4px 14px 0 rgba(245, 158, 11, 0.39)"
                        }}
                    >
                        Sign Up
                    </Button>
                </motion.div>
            </div>
        </Header>
    );
};

export default Navbar;
