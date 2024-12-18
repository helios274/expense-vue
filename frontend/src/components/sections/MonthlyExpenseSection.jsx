import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "../../utils/axios";
import handleErrors from "../../utils/errors";
import ExpenseDataGrid from "../ExpenseDataGrid";

const MonthlyExpenseSection = () => {
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const [expenseData, setExpenseData] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dataAnimation, setDataAnimation] = useState("");

  const fetchMonthlyExpenseData = useCallback(async (year_param) => {
    setDataAnimation("animate-pulse");
    try {
      let response;
      if (year_param) {
        response = await axios.get(
          `/api/expenses/data/monthly?year=${year_param}`
        );
      } else {
        response = await axios.get("/api/expenses/data/monthly");
      }
      setExpenseData(response.data);
      const result = response.data.reduce(
        (acc, curr) => {
          return {
            totalExpenses: acc.totalExpenses + curr.total_expenses,
            totalAmount: acc.totalAmount + curr.total_amount,
          };
        },
        { totalExpenses: 0, totalAmount: 0 }
      );
      setTotalExpenses(result.totalExpenses);
      setTotalAmount(result.totalAmount);
    } catch (error) {
      handleErrors(error);
    } finally {
      setDataAnimation("");
    }
  }, []);

  const handleDatePicker = (date, dateString) => {
    if (dateString) {
      setYear(date.format("YYYY"));
      fetchMonthlyExpenseData(dateString);
    } else {
      setYear(dayjs().format("YYYY"));
      fetchMonthlyExpenseData();
    }
  };

  useEffect(() => {
    fetchMonthlyExpenseData();
  }, [fetchMonthlyExpenseData]);

  return (
    <ExpenseDataGrid
      expenseData={expenseData}
      dataType="monthly"
      dateValue={year}
      totalExpenses={totalExpenses}
      totalAmount={totalAmount}
      handleDatePicker={handleDatePicker}
      dataAnimation={dataAnimation}
    />
  );
};

export default MonthlyExpenseSection;
