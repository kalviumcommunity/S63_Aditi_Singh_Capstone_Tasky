import React from 'react';
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
    overdue: 0
  };

  // Use the provided summary or default values
  const safeSummary = summary || defaultSummary;

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
    return (
      <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Empty description="Invalid data format" />
      </div>
    );
  }

  const data = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [safeSummary.completed, safeSummary.pending, safeSummary.overdue],
        backgroundColor: [
          '#52c41a', // Completed - green
          '#faad14', // Pending - yellow
          '#ff4d4f', // Overdue - red
        ],
        borderColor: [
          '#52c41a',
          '#faad14',
          '#ff4d4f',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
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
  };

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
    overdue: PropTypes.number
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
    overdue: 0
  },
  loading: false,
  error: null
};

export default PieChartComponent; 