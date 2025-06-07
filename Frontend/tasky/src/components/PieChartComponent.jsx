import React, { useEffect, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Spin, Empty } from 'antd';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const PieChartComponent = ({ summary, loading, error }) => {
  // Default values if summary is undefined or incomplete
  const defaultSummary = {
    completed: 0,
    pending: 0,
    overdue: 0,
    inProgress: 0,
  };

  // Use the provided summary or default values, ensuring all expected properties are present
  const safeSummary = {
      completed: Number(summary?.completed) || 0,
      pending: Number(summary?.pending) || 0,
      overdue: Number(summary?.overdue) || 0,
      inProgress: Number(summary?.inProgress) || 0,
  };

  // Validate that all required values are numbers
  const isValidData = Object.values(safeSummary).every(value => typeof value === 'number');

  if (loading) {
    return (
      <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin tip="Loading chart data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Empty description="Failed to load chart data" />
      </div>
    );
  }

  if (!isValidData) {
    console.warn('PieChartComponent: Invalid data structure received', safeSummary);
    console.log('Pie chart safeSummary data:', safeSummary);
    return (
      <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Empty description="Invalid data format" />
      </div>
    );
  }

  console.log('Pie chart safeSummary data:', safeSummary);

  // Log the incoming summary prop
  useEffect(() => {
    console.log('PieChartComponent received summary prop:', summary);
  }, [summary]);

  const data = useMemo(() => ({
    labels: ['Completed', 'Pending', 'Overdue', 'In Progress'],
    datasets: [
      {
        data: [safeSummary.completed, safeSummary.pending, safeSummary.overdue, safeSummary.inProgress],
        backgroundColor: [
          '#52c41a', // Completed - green
          '#faad14', // Pending - yellow
          '#ff4d4f', // Overdue - red
          '#1890ff', // In Progress - blue (Ant Design default blue)
        ],
        borderColor: [
          '#52c41a',
          '#faad14',
          '#ff4d4f',
          '#1890ff', // Border color for In Progress
        ],
        borderWidth: 1,
      },
    ],
  }), [safeSummary.completed, safeSummary.pending, safeSummary.overdue, safeSummary.inProgress]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  }), []);

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

PieChartComponent.propTypes = {
  summary: PropTypes.shape({
    completed: PropTypes.number,
    pending: PropTypes.number,
    overdue: PropTypes.number,
    inProgress: PropTypes.number,
  }),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool
  ])
};

PieChartComponent.defaultProps = {
  summary: {
    completed: 0,
    pending: 0,
    overdue: 0,
    inProgress: 0,
  },
  loading: false,
  error: null
};

export default PieChartComponent; 