// components/PieChart.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  Title
} from 'chart.js';

ChartJS.register(
  Tooltip,
  Legend,
  ArcElement,
  Title
);

const data = {
  labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
  datasets: [{
    data: [300, 50, 100, 80, 60, 70],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#F77825',
      '#9658A9'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#F77825',
      '#9658A9'
    ]
  }]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

const PieChart: React.FC = () => {
  return <Pie data={data} options={options} />;
}

export default PieChart;
