import React, { useCallback, useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import axios from "../../utils/axios";
import handleErrors from "../../utils/errors";
import ExpenseDataGrid from "../ExpenseDataGrid";

const DailyExpenseSection = () => {
  const [month, setMonth] = useState(dayjs().format("MMMM YYYY"));
  const [expenseData, setExpenseData] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dataAnimation, setDataAnimation] = useState("");

  const fetchDailyExpenseData = useCallback(async (date_param) => {
    setDataAnimation("animate-pulse");
    try {
      let response;
      if (date_param) {
        response = await axios.get(
          `/api/expenses/data/daily?date=${date_param}`
        );
      } else {
        response = await axios.get("/api/expenses/data/daily");
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
      setMonth(date.format("MMMM YYYY"));
      fetchDailyExpenseData(dateString);
    } else {
      setMonth(dayjs().format("MMMM YYYY"));
      fetchDailyExpenseData();
    }
  };

  useEffect(() => {
    fetchDailyExpenseData();
  }, [fetchDailyExpenseData]);

  return (
    <ExpenseDataGrid
      expenseData={expenseData}
      dataType="daily"
      dateValue={month}
      totalExpenses={totalExpenses}
      totalAmount={totalAmount}
      handleDatePicker={handleDatePicker}
      dataAnimation={dataAnimation}
    />
  );
};

export default DailyExpenseSection;
