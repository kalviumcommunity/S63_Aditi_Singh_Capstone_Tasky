import React, { useState, useEffect } from 'react';
import { UserOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function UserNavbar() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [users, setUsers] = useState([]); // Default to empty array
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  // Task form state
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#1e1e1e' : '#fff';
    document.body.style.color = darkMode ? '#f5f5f5' : '#000';
  }, [darkMode]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users/users');
        // Check if response is array or object with `users` array
        const userList = Array.isArray(res.data) ? res.data : res.data.users;
        setUsers(userList || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setUsers([]); // fallback to empty array
      } finally {
        setLoadingUsers(false);
      }
    };

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user?.role]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Task data:', taskData); // Placeholder for backend call
    setShowAssignModal(false);
    setTaskData({ title: '', description: '', assignedTo: '', dueDate: '', status: 'pending' });
    alert('Task assigned (mock only)');
  };

  return (
    <>
      <nav style={{ ...styles.navbar, background: darkMode ? '#2c2c2c' : '#fff', color: darkMode ? '#f5f5f5' : '#000' }}>
        <div style={styles.titleWrapper}>
          <h1 style={styles.title}>Dashboard</h1>
          <span style={{ ...styles.userTag, color: darkMode ? '#bbb' : '#777' }}>{user?.role}</span>
        </div>

        <div style={styles.iconWrapper}>
          {user?.role === 'admin' && (
            <button style={styles.assignButton} onClick={() => setShowAssignModal(true)}>
              Assign Tasks
            </button>
          )}

          <div
            style={{ ...styles.circleIcon, background: darkMode ? '#444' : '#f9f9f9' }}
            onClick={() => setDarkMode(prev => !prev)}
            title="Toggle Night Mode"
          >
            {darkMode ? (
              <BulbFilled style={{ fontSize: '16px', color: '#facc15' }} />
            ) : (
              <BulbOutlined style={{ fontSize: '16px', color: '#555' }} />
            )}
          </div>

          <div style={{ ...styles.circleIcon, background: darkMode ? '#444' : '#f9f9f9' }}>
            <UserOutlined style={{ fontSize: '18px', color: darkMode ? '#ddd' : '#333' }} />
          </div>
        </div>
      </nav>

      {showAssignModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h3>Assign New Task</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={taskData.title}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={taskData.description}
                onChange={handleInputChange}
                required
              />
              <select name="assignedTo" value={taskData.assignedTo} onChange={handleInputChange} required>
                <option value="">Assign to</option>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name || 'Unnamed User'}
                    </option>
                  ))
                ) : (
                  <option disabled>No users found</option>
                )}
              </select>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleInputChange}
                required
              />
              <select name="status" value={taskData.status} onChange={handleInputChange}>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div style={styles.modalActions}>
                <button type="submit" style={styles.assignButton}>Assign</button>
                <button type="button" onClick={() => setShowAssignModal(false)} style={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  navbar: {
    width: '100%',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    borderBottom: '1px solid #eee',
    transition: 'all 0.3s ease',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 400,
    margin: 0,
    fontFamily: 'serif',
  },
  userTag: {
    fontSize: '10px',
    marginTop: '6px',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  circleIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  assignButton: {
    padding: '8px 16px',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'background 0.2s ease',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#ccc',
    color: '#333',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
  }
};
