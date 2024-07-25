import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart } from "chart.js/auto";
import dayjs from "dayjs";

const ExpenseDataChart = ({ data, chartType, dataType, dateValue }) => {
  const { themeMode } = useSelector((state) => state.theme);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const getDateLabel = (item) => {
    return dataType === "daily"
      ? dayjs(item.day).format("D")
      : dayjs(item.month).format("MMM");
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const labels = data.map(getDateLabel);
    const totalAmounts = data.map((item) => item.total_amount);

    const titleText =
      dataType === "monthly"
        ? `Expense data for ${dateValue}`
        : `Expense data for ${dateValue}`;
    const xAxisLabel =
      dataType === "monthly"
        ? `Months of ${dateValue}`
        : `Days of ${dateValue}`;
    const primaryColor = themeMode === "light" ? "#132043" : "#F1B4BB";
    const gridColor =
      themeMode === "light" ? "rgba(19, 32, 67, 0.2)" : "#132043";

    const datasets = [
      {
        label: "Total Amount",
        data: totalAmounts,
        backgroundColor:
          chartType === "bar" ? "rgba(75, 192, 192, 0.2)" : undefined,
        borderColor: primaryColor,
        borderWidth: chartType === "bar" ? 2 : undefined,
        pointBackgroundColor: chartType === "line" ? primaryColor : undefined,
        pointBorderColor: chartType === "line" ? primaryColor : undefined,
        tension: chartType === "line" ? 0.4 : undefined,
        fill: chartType === "line" ? false : undefined,
      },
    ];

    // Destroy the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: datasets,
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
              color: primaryColor,
            },
            ticks: {
              color: primaryColor,
            },
            grid: {
              color: gridColor,
              tickColor: gridColor,
            },
          },
          x: {
            title: {
              display: true,
              text: xAxisLabel,
              color: primaryColor,
            },
            ticks: {
              color: primaryColor,
            },
            grid: {
              color: gridColor,
              tickColor: gridColor,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: titleText,
            color: primaryColor,
            font: {
              size: 14,
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
  }, [data, chartType, themeMode, dataType]);

  return <canvas ref={chartRef} className="w-full h-full" />;
};

export default ExpenseDataChart;
