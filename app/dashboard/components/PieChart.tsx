// components/PieChart.tsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement, Title } from "chart.js";

ChartJS.register(Tooltip, Legend, ArcElement, Title);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Annual Asset Valuation Summary for the Past Three Years",
    },
  },
};

const PieChart: React.FC<{ data: number[] }> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const chartData = {
    labels: years,
    datasets: [
      {
        data: data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };
  return <Pie data={chartData} options={options} />;
};

export default PieChart;
