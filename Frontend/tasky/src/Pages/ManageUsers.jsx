import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import { Modal, Input, message } from 'antd';
import axios from 'axios';

export default function ManageUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#1e1e1e' : '#fff';
    document.body.style.color = darkMode ? '#f5f5f5' : '#000';
  }, [darkMode]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
      } catch (error) {
        message.error('Failed to load users.');
      }
      setLoadingUsers(false);
    };

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserName) {
      message.error('Please enter both name and email.');
      return;
    }

    try {
      const response = await axios.post('/api/users/add', {
        name: newUserName,
        email: newUserEmail
      });

      message.success('User added successfully!');
      setShowAddUser(false);
      setNewUserEmail('');
      setNewUserName('');
      setUsers(prev => [...prev, response.data]);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to add user.';
      message.error(errMsg);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role={user?.role} />

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h2 style={styles.title}>Manage users</h2>
            <span style={{ ...styles.roleTag, color: darkMode ? '#aaa' : '#666' }}>{user?.role}</span>
          </div>

          <div style={styles.actions}>
            <div
              style={{ ...styles.iconBtn, background: darkMode ? '#333' : '#f2f2f2' }}
              onClick={() => setDarkMode(prev => !prev)}
            >
              {darkMode ? <BulbFilled style={{ color: '#facc15' }} /> : <BulbOutlined style={{ color: '#333' }} />}
            </div>
            <button style={styles.addUserBtn} onClick={() => setShowAddUser(true)}>+ Add user</button>
          </div>
        </div>

        <div style={styles.userGrid}>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            users.map(u => (
              <div key={u._id} style={styles.userCard}>
                <img src={u.avatar || 'https://via.placeholder.com/48'} alt="avatar" style={styles.avatar} />
                <div>
                  <div style={styles.userName}>{u.name}</div>
                  <div style={styles.userRole}>{u.role}</div>
                  <div style={styles.userEmail}>{u.email}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add User Modal */}
        <Modal
          title="Add Existing User"
          open={showAddUser}
          onCancel={() => setShowAddUser(false)}
          onOk={handleAddUser}
          okText="Add User"
          cancelText="Cancel"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input
              placeholder="Enter name"
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
            />
            <Input
              placeholder="Enter registered email"
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    fontFamily: 'sans-serif',
    minHeight: '100vh',
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    margin: 0,
  },
  roleTag: {
    fontSize: '12px',
    marginTop: '4px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: '0.3s',
  },
  addUserBtn: {
    padding: '8px 16px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '12px',
    background: '#f9f9f9',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userName: {
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: '12px',
    color: '#999',
  },
  userEmail: {
    fontSize: '12px',
    color: '#666',
  },
};
