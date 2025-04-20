import React from 'react';
import { UserOutlined } from '@ant-design/icons';

export default function UserNavbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.titleWrapper}>
        <h1 style={styles.title}>Dashboard</h1>
        <span style={styles.userTag}>user</span>
      </div>
      <div style={styles.iconWrapper}>
        <div style={styles.circleIcon}>
          <UserOutlined style={{ fontSize: '18px', color: '#333' }} />
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    width: '100%',
    padding: '16px 24px',
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    borderBottom: '1px solid #eee',
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
    color: '#777',
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
    background: '#f9f9f9',
  },
};
