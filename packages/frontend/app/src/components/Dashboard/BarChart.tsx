import React from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartDataLabels
);

interface BarChartProps {
  data: {
    month: string;
    amount: number;
  }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const labels = data.map((d) => d.month);
  const values = data.map((d) => d.amount);
  const average = values.length === 0 ? 0 : (
    values.reduce((sum, val) => sum + val, 0) / values.length
  ).toFixed(2);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Amount",
        data: values,
        backgroundColor: "#36A2EB",
        borderRadius: 6,
        barThickness: 70,
        hoverBackgroundColor: "#2b87c4",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
      },
    },
    plugins: {
      datalabels: {
        anchor: "end" as const,
        align: "end" as const,
        color: "#333",
        offset: -3,
        font: {
          size: 12,
        },
        formatter: (value: any) => `$${value.toFixed(2)}`,
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        ticks: {
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  return (
    <>
      <Bar data={chartData} options={options} />
      <div className="text-center mt-1 text-base text-gray-800">
        Average Monthly Expense:{" "}
        <strong className="text-[#2752b1]">${average}</strong>
      </div>
    </>
  );
};

export default BarChart;
