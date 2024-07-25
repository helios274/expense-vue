import React from "react";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const CustomMonthPicker = ({ onChange, picker, className, placeholder }) => {
  const currentMonth = dayjs().startOf("month");

  return (
    <DatePicker
      onChange={onChange}
      picker={picker}
      disabledDate={(current) => current && current > currentMonth}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default CustomMonthPicker;
