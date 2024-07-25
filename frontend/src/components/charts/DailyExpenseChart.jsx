import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import dayjs from "dayjs";

const ExpensesBarChart = ({ data, chartType }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const labels = data.map((item) => dayjs(item.day).format("D")); // Format dates
    const totalAmounts = data.map((item) => item.total_amount);

    // Destroy the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Amount",
            data: totalAmounts,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Total Amount",
            },
          },
          x: {
            title: {
              display: true,
              text: "Days",
            },
          },
        },
      },
    });

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, chartType]);

  return <canvas ref={chartRef} />;
};

export default ExpensesBarChart;
