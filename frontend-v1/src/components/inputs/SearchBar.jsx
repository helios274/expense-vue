import React, { useState } from "react";

const SearchBar = ({ onSearch, onClear }) => {
  const [searchString, setSearchString] = useState("");

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search here"
        className="search-input peer"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
      <button
        className={`px-2 font-semibold dark:text-secondary peer-focus:bg-primary dark:peer-focus:bg-quaternary dark:peer-focus:text-primary ${
          searchString ? "block" : "hidden"
        }`}
        onClick={() => {
          setSearchString("");
          onClear();
        }}
      >
        X
      </button>
      <button
        className="search-btn"
        onClick={() => {
          if (searchString.length > 1) onSearch(searchString);
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
