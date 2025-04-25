import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Sider } = Layout;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      key: '/admin/dashboard',
      label: 'Dashboard',
    },
    {
      key: '/admin/reports',
      label: 'Reports',
    },
    {
      key: '/admin/profile',
      label: 'Profile',
    },
    {
      key: '/admin/manage-users',
      label: 'Manage Users',
    },
  ];

  const handleMenuClick = (key) => {
    navigate(key);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Sider
      width={200}
      style={{
        background: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '24px', 
          margin: '0',
          fontWeight: 'bold',
          color: '#000'
        }}>
          TASKY
        </h1>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ 
          flex: 1,
          borderRight: 0,
        }}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        theme="light"
      />

      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid #f0f0f0',
        marginTop: 'auto'
      }}>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            width: '100%',
            textAlign: 'left',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            color: '#000'
          }}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};

export default AdminSidebar; 