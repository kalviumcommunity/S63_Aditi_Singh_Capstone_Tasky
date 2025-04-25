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
                background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
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
                    color: 'var(--text-primary)',
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 'bold'
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
                    marginTop: '16px'
                }}
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
                        border: 'none'
                    }}
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
