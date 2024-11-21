import React, { useId } from "react";

const SelectBox = React.forwardRef(function Select(
  { label, options = [], defaultValue, ...props },
  ref
) {
  const id = useId();
  return (
    <div className="flex flex-col my-2">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <select
        id={id}
        ref={ref}
        defaultValue={defaultValue}
        {...props}
        className="input"
      >
        <option value="">--Please choose a category--</option>
        {options.map((option) => (
          <option value={option.name} key={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
});

export default SelectBox;
