import React from 'react';
import { Card } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const taskData = [
  { title: 'Total', count: 40, color: '#facc15', icon: <ClockCircleOutlined /> },
  { title: 'Completed', count: 25, color: '#22c55e', icon: <CheckCircleOutlined /> },
  { title: 'In Progress', count: 10, color: '#3b82f6', icon: <SyncOutlined spin /> },
  { title: 'Overdue', count: 5, color: '#f97316', icon: <ExclamationCircleOutlined /> },
];

export default function TaskSummary() {
  return (
    <div style={{ padding: '40px 60px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '28px', marginBottom: '30px' }}>My Tasks</h2>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {taskData.map((task, index) => (
          <Card
            key={index}
            bordered={false}
            style={{
              flex: '1 1 180px',
              boxShadow: `0 4px 20px rgba(0,0,0,0.06)`,
              borderLeft: `6px solid ${task.color}`,
              borderRadius: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              padding: '20px 24px',
              background: 'white'
            }}
            hoverable
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '22px', color: task.color }}>{task.icon}</div>
              <div>
                <div style={{ fontSize: '14px', color: '#888' }}>{task.title}</div>
                <div style={{ fontSize: '20px', fontWeight: 600 }}>{task.count}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
