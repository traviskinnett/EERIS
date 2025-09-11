import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: {
    category: string;
    amount: number;
  }[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const filtered = data.filter((d) => d.amount > 0);

  const chartData = {
    labels: filtered.map((d) => d.category),
    datasets: [
      {
        data: filtered.map((d) => d.amount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8B5CF6",
          "#34D399",
          "#F59E0B",
          "#F7CFD8",
          "#88304E",
          "#BBD8A3",
        ],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    layout: {
      padding: {
        left: 50,
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 14,
          },
          color: "#333",
          usePointStyle: true,
          pointStyle: "circle",
        },
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
  };

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart: any) => {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      const { x, y } = meta.data[0] || {
        x: chart.width / 2,
        y: chart.height / 2,
      };

      const totalY = y + 10;
      const labelY = y - 20;
      const barY = y - 10;

      ctx.save();

      ctx.font = "500 0.75rem sans-serif";
      ctx.fillStyle = "#555";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Total Spending", x, labelY);

      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 50, barY);
      ctx.lineTo(x + 50, barY);
      ctx.stroke();

      ctx.font = "bold 1.75rem sans-serif";
      ctx.fillStyle = "#333";
      const values = chart.data.datasets[0].data as number[];
      const sum = values.reduce(
        (acc, v) => acc + (typeof v === "number" ? v : Number(v)),
        0
      );

      ctx.fillText(`$${sum.toFixed(2)}`, x, totalY);
      ctx.restore();
    },
  };

  return (
    <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
  );
};

export default DoughnutChart;
