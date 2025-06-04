import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
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
                background: 'var(--bg-secondary-light, #f9f9f9)',
                color: 'var(--text-primary-light, #333333)',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                borderRadius: '0',
                margin: '0',
                borderRight: '1px solid rgba(0, 0, 0, 0.1)',
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
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{ 
                    color: 'var(--accent-primary-light, #f59e0b)',
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
                    color: 'var(--text-primary-light, #333333)',
                    fontWeight: 500,
                    fontSize: 16,
                    borderRadius: '0',
                }}
                theme='light'
                items={menuItems}
                onClick={({ key }) => navigate(key)}
            />

            <div style={{ 
                position: 'absolute',
                bottom: 0,
                width: '100%',
                padding: '16px',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
                <Menu
                    mode="inline"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary-light, #333333)',
                        fontWeight: 500,
                        fontSize: 16
                    }}
                    theme='light'
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
