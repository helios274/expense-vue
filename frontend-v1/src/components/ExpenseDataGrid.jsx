import React, { useState } from "react";
import { IoBarChart } from "react-icons/io5";
import { FaChartLine } from "react-icons/fa6";
import formatCurrency from "../utils/formatCurrency";
import DatePicker from "./inputs/DatePicker";
import ExpenseDataChart from "./charts/ExpenseDataChart";

const ExpenseDataGrid = ({
  expenseData,
  dataType,
  dateValue,
  totalExpenses,
  totalAmount,
  handleDatePicker,
  dataAnimation,
}) => {
  const [chartType, setChartType] = useState("bar");

  return (
    <section className="flex flex-col space-y-3">
      <div className="flex flex-col space-x-0 sm:flex-row sm:space-x-3">
        <DatePicker
          onChange={handleDatePicker}
          picker={dataType === "daily" ? "month" : "year"}
          placeholder={
            dataType === "daily" ? "Filter by month" : "Filter by year"
          }
          className="date-picker"
        />
        <h1 className="expense-data-title">Expense data for {dateValue}</h1>
      </div>
      <div className="flex flex-col space-y-3 space-x-0 sm:flex-row sm:space-x-3 sm:space-y-0">
        <div className="data-card w-full sm:w-1/2">
          <h1 className="text-base sm:text-lg font-semibold">Total Expenses</h1>
          <div className={`data-card-title ${dataAnimation}`}>
            {totalExpenses}
          </div>
        </div>
        <div className="data-card w-full sm:w-1/2">
          <h1 className="text-base sm:text-lg font-semibold">Total Amount</h1>
          <div className={`data-card-title ${dataAnimation}`}>
            {formatCurrency(totalAmount, "INR", "en-IN")}
          </div>
        </div>
      </div>
      <div className="bg-secondary/25 rounded-md shadow-md py-3 px-2 dark:bg-tertiary">
        <div className="flex border-2 rounded-md shadow-md border-tertiary w-fit ms-1 dark:border-secondary">
          <button
            type="button"
            className={`px-4 py-1.5 sm:py-2 ${
              chartType === "bar"
                ? "bg-tertiary text-primary dark:bg-secondary dark:text-quaternary"
                : "text-gray-600 dark:text-secondary"
            }`}
            onClick={() => setChartType("bar")}
          >
            <span className="sr-only">Toggle bar chart</span>
            <IoBarChart />
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 sm:py-2 ${
              chartType === "line"
                ? "bg-tertiary text-primary dark:bg-secondary dark:text-quaternary"
                : "text-gray-600 dark:text-secondary"
            }`}
            onClick={() => setChartType("line")}
          >
            <span className="sr-only">Toggle line chart</span>
            <FaChartLine />
          </button>
        </div>
        <div className="relative h-64 sm:h-96 flex justify-center mt-2 px-1">
          <ExpenseDataChart
            data={expenseData}
            chartType={chartType}
            dataType={dataType}
            dateValue={dateValue}
          />
        </div>
      </div>
    </section>
  );
};

export default ExpenseDataGrid;
