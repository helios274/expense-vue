import React, { useState } from "react";
import { useSelector } from "react-redux";
import DailyExpenseSection from "../../components/sections/DailyExpenseSection";
import MonthlyExpenseSection from "../../components/sections/MonthlyExpenseSection";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Daily Expense", "Monthly Expense"];
  const sections = [<DailyExpenseSection />, <MonthlyExpenseSection />];

  return (
    <div>
      <div className="space-x-3 overflow-x-auto whitespace-nowrap pb-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-1.5 px-2 sm:py-2 sm:px-4 text-sm sm:text-base transition duration-300 shadow-md border-2 
              border-quaternary rounded-lg font-semibold 
              dark:border-secondary ${
                activeTab === index
                  ? "bg-quaternary text-primary dark:bg-secondary dark:text-quaternary"
                  : " hover:bg-quaternary hover:text-primary dark:text-secondary"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <hr className="mt-3 mb-5 rounded-s-full rounded-e-full border dark:border-tertiary border-secondary" />
      {sections.map((Section, index) => (
        <div
          key={index}
          className={`transition-opacity duration-300 ${
            activeTab === index ? "block" : "hidden"
          }`}
        >
          {Section}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
