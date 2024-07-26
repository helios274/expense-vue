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
    <div className="space-y-3 font-mono">
      <div className="space-x-3 overflow-x-auto whitespace-nowrap pb-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 px-4 transition duration-300 shadow-md border-2 
              border-secondary/75 rounded-lg text-quaternary font-semibold 
              dark:border-secondary ${
                activeTab === index
                  ? "bg-secondary/75 dark:bg-secondary"
                  : " hover:bg-secondary/25 dark:text-secondary"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <hr className="rounded-s-full rounded-e-full border border-quaternary dark:border-secondary" />
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
