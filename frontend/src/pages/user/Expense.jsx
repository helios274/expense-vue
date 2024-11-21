import axios from "../../utils/axios";
import React, { useCallback, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { Popover } from "antd";
import { toast } from "react-toastify";
import handleErrors from "../../utils/errors";
import SearchBar from "../../components/inputs/SearchBar";

const Expense = () => {
  const [expenses, setExpenses] = useState({
    count: 0,
    total_pages: 1,
    current_page: 1,
    next: null,
    previous: null,
    results: [],
  });
  const [pageInputValue, setPageInputValue] = useState(1);
  const [isExpense, setIsExpense] = useState(false);

  const fetchExpenses = useCallback(async (url = "/api/expenses") => {
    try {
      const response = await axios.get(url);
      setIsExpense(response.data.results.length !== 0);
      setExpenses(response.data);
    } catch (error) {
      handleErrors(error);
    }
  }, []);

  const fetchSearchResults = async (searchString) => {
    if (searchString.length > 2) {
      try {
        const response = await axios.get(
          `/api/expenses?search=${searchString}`
        );
        setExpenses(response.data);
      } catch (error) {
        console.error(error);
        handleErrors(error, "Failed to fetch search results.");
      }
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      toast.success("Expense deleted successfully.");
      fetchExpenses();
    } catch (error) {
      handleErrors(error, "Failed to delete expense.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <>
      <div className="flex flex-col dark:bg-tertiary bg-secondary/25 p-2 rounded-lg shadow-lg">
        {isExpense ? (
          <>
            <div className="flex flex-col min-[840px]:flex-row mt-3 mb-3 min-[840px]:mb-5">
              <SearchBar
                onSearch={fetchSearchResults}
                onClear={fetchExpenses}
              />
              <div className="flex min-[840px]:ml-auto max-[840px]:mt-3 max-[840px]:justify-center">
                <Link
                  to="/add-expense"
                  className="max-[840px]:w-full text-center btn-primary-outline my-0 mr-3"
                >
                  Add expense
                </Link>
                <Link
                  to="/categories"
                  className="max-[840px]:w-full text-center btn-primary-outline my-0"
                >
                  Manage categories
                </Link>
              </div>
            </div>
            <div className="relative overflow-x-auto rounded-lg">
              <table className="w-[500px] min-[500px]:w-full text-sm sm:text-base rounded-lg border-none">
                <thead>
                  <tr className="dark:bg-secondary bg-quaternary dark:text-quaternary text-primary">
                    <th className="py-3">Amount</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Description</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.results.map((expense) => (
                    <tr
                      key={expense.id}
                      className="text-center border-gray-300 hover:bg-primary/30 dark:hover:bg-secondary/10 dark:text-primary"
                    >
                      <td className="py-3">{expense.amount}</td>
                      <td className="py-3">{expense.category}</td>
                      <td className="py-3">{formatDate(expense.date)}</td>
                      <td className="py-3">{expense.description}</td>
                      <td className="py-3 flex justify-center">
                        <Link
                          to="update"
                          state={expense}
                          className="text-lg border-2 border-quaternary dark:border-secondary hover:bg-quaternary dark:hover:bg-secondary dark:text-secondary dark:hover:text-tertiary hover:text-secondary max-sm:text-base max-sm:py-1 max-sm:px-2 py-1.5 px-3 mx-2 rounded-lg"
                        >
                          <FaEdit />
                        </Link>
                        <Popover
                          content={
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="py-[3px] px-3 bg-red-600 text-primary rounded-md hover:bg-red-800"
                            >
                              Yes
                            </button>
                          }
                          title="Are you sure?"
                          trigger="click"
                          placement="topLeft"
                        >
                          <button className="text-lg border-2 border-red-700 dark:border-red-500 text-red-700 dark:text-red-500 hover:bg-red-700 dark:hover:bg-red-500 hover:text-secondary dark:hover:text-tertiary max-sm:text-base max-sm:py-1 max-sm:px-2 py-1.5 px-3 mx-2 rounded-lg">
                            <RiDeleteBin2Fill />
                          </button>
                        </Popover>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {expenses.total_pages > 1 ? (
              <div className="mt-4 flex justify-center items-center">
                <div className="pagination-container">
                  <h1 className="py-[4px] max-sm:py-[6px] px-3 max-sm:text-sm max-sm:px-2 font-medium text-primary dark:text-quaternary bg-quaternary dark:bg-secondary">
                    Page {expenses.current_page} of {expenses.total_pages}
                  </h1>
                  <nav>
                    <ul className="flex items-center -space-x-px h-8 text-sm">
                      <li>
                        <button
                          onClick={() => {
                            if (expenses.previous)
                              fetchExpenses(expenses.previous);
                          }}
                          disabled={!expenses.previous}
                          className="page-prev-btn"
                        >
                          <IoIosArrowBack />
                        </button>
                      </li>
                      <li>
                        <div className="page-btn px-0">
                          <input
                            type="number"
                            min={1}
                            max={expenses.total_pages}
                            value={pageInputValue}
                            onChange={(e) => setPageInputValue(e.target.value)}
                            className="page-input"
                          />
                          <button
                            className="h-full w-12 max-sm:w-10 max-sm:text-sm bg-secondary hover:bg-quaternary hover:text-secondary font-medium text-quaternary"
                            onClick={() => {
                              fetchExpenses(
                                `/api/expenses/?page=${pageInputValue}`
                              );
                            }}
                          >
                            Go
                          </button>
                        </div>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            if (expenses.next) fetchExpenses(expenses.next);
                          }}
                          disabled={!expenses.next}
                          className="page-next-btn"
                        >
                          <IoIosArrowForward />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-9 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-center text-quaternary dark:text-secondary">
              You do not have any expenses
            </h1>
            <div className="flex justify-center gap-4 mt-7">
              <Link to="/add-expense" className="btn-primary-outline my-0 mr-3">
                Add expense
              </Link>
              <Link to="/categories" className="btn-primary-outline my-0">
                Add categories
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Expense;
