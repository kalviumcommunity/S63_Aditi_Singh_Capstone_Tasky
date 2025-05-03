import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
    DashboardOutlined,
    BarChartOutlined,
    UserOutlined,
    TeamOutlined,
    LogoutOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark } = useTheme();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminMenuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
        },
        {
            key: '/admin/reports',
            icon: <BarChartOutlined />,
            label: 'Reports'
        },
        {
            key: '/admin/profile',
            icon: <UserOutlined />,
            label: 'Profile'
        },
        {
            key: '/admin/manage-users',
            icon: <TeamOutlined />,
            label: 'Manage Users'
        }
    ];

    const userMenuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
        },
        {
            key: '/profile',
            icon: <UserOutlined />,
            label: 'Profile'
        }
    ];

    const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

    return (
        <Sider
            width={250}
            style={{
                background: isDark ? 'rgba(24, 24, 28, 0.85)' : 'var(--bg-secondary)',
                color: isDark ? '#e5e7eb' : 'var(--text-primary)',
                backdropFilter: isDark ? 'blur(12px)' : undefined,
                boxShadow: isDark ? '0 8px 32px 0 rgba(0,0,0,0.45)' : '0 1px 2px 0 rgba(0,0,0,0.05)',
                borderRadius: isDark ? '18px' : '0',
                margin: isDark ? '18px 0 18px 18px' : '0',
                borderRight: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                overflow: 'auto'
            }}
        >
            <div style={{ 
                padding: '24px 16px',
                textAlign: 'center',
                borderBottom: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>
                <h1 style={{ 
                    color: isDark ? '#fbbf24' : 'var(--text-primary)',
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 'bold',
                    letterSpacing: 2
                }}>
                    Tasky
                </h1>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                style={{
                    background: 'transparent',
                    border: 'none',
                    marginTop: '16px',
                    color: isDark ? '#e5e7eb' : 'var(--text-primary)',
                    fontWeight: 500,
                    fontSize: 16,
                    borderRadius: isDark ? '12px' : '0',
                    overflow: 'hidden'
                }}
                theme={isDark ? 'dark' : 'light'}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
            />

            <div style={{ 
                position: 'absolute',
                bottom: 0,
                width: '100%',
                padding: '16px',
                borderTop: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>
                <Menu
                    mode="inline"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: isDark ? '#e5e7eb' : 'var(--text-primary)',
                        fontWeight: 500,
                        fontSize: 16
                    }}
                    theme={isDark ? 'dark' : 'light'}
                    items={[
                        {
                            key: 'logout',
                            icon: <LogoutOutlined />,
                            label: 'Logout',
                            onClick: handleLogout
                        }
                    ]}
                />
            </div>
        </Sider>
    );
};

export default Sidebar;
