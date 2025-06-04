import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView = ({ tasks }) => {
  const tasksByDate = {};
  tasks.forEach(task => {
    const dateStr = new Date(task.dueDate).toISOString().split('T')[0];
    if (!tasksByDate[dateStr]) tasksByDate[dateStr] = [];
    tasksByDate[dateStr].push(task);
  });

  const tileContent = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayTasks = tasksByDate[dateStr] || [];
    return (
      <div style={{ display: 'flex', gap: 2 }}>
        {dayTasks.map((task, idx) => (
          <span
            key={idx}
            title={task.title}
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: task.status === 'completed'
                ? '#52c41a'
                : (new Date(task.dueDate) < new Date() && task.status !== 'completed')
                  ? '#f5222d'
                  : '#faad14'
            }}
          />
        ))}
      </div>
    );
  };

  return <Calendar tileContent={tileContent} />;
};

export default CalendarView; 