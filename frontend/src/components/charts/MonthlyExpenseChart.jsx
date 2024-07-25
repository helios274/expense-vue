import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart } from "chart.js/auto";
import dayjs from "dayjs";

const ExpensesChart = ({ data, chartType }) => {
  let { themeMode } = useSelector((state) => state.theme);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const labels = data.map((item) => dayjs(item.date).format("MMM")); // Format dates
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
            backgroundColor: "rgb(241, 180, 187)",
            borderColor: themeMode === "light" ? "#132043" : "#132043",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to adjust to container size
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Total Amount",
              color: themeMode === "light" ? "#132043" : "#F1B4BB",
            },
            ticks: {
              color: themeMode === "light" ? "#132043" : "#F1B4BB",
            },
            grid: {
              color: themeMode === "light" ? "rgb(19, 32, 67, 0.2)" : "#132043",
              tickColor:
                themeMode === "light" ? "rgb(19, 32, 67, 0.2)" : "#132043",
            },
          },
          x: {
            title: {
              display: true,
              text: "Days",
              color: themeMode === "light" ? "#132043" : "#F1B4BB",
            },
            ticks: {
              color: themeMode === "light" ? "#132043" : "#F1B4BB",
            },
            grid: {
              color: themeMode === "light" ? "rgb(19, 32, 67, 0.2)" : "#132043",
              tickColor:
                themeMode === "light" ? "rgb(19, 32, 67, 0.2)" : "#132043",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Expense by category - This month",
            color: themeMode === "light" ? "#132043" : "#F1B4BB",
            font: {
              size: 18,
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
  }, [data, chartType, themeMode]);

  return <canvas ref={chartRef} className="w-full h-full" />; // Ensure canvas takes full width and height of container
};

export default ExpensesChart;
