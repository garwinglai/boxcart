// components/ProductTaxCodeDropdown.js

import React from "react";

const ProductTaxCodeDropdown = ({
  searchTerm,
  handleSearchTermChange,
  handleSelectOption,
  selectedTaxCode,
  options,
}) => {
  const preventSubmitOnEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
    }
  };

  return (
    <div className="">
      <select
        className="border w-full p-2 rounded mb-4"
        onChange={handleSelectOption}
        value={JSON.stringify(selectedTaxCode)}
      >
        {/* <option>Select a tax code...</option> */}
        {options.length === 1 ? (
          <React.Fragment>
            <option value={options[0].id}>
              {options[0].name} {options[0].id ? `(${options[0].id})` : ""}
            </option>
            <option value="">Invalid search</option>
          </React.Fragment>
        ) : (
          options.map((item) => (
            <option key={item.id} value={JSON.stringify(item)}>
              {item.name} {item.id ? `(${item.id})` : ""}
            </option>
          ))
        )}
      </select>
      <label htmlFor="search" className="font-light text-sm text-gray-700">
        Searching will filter menu above.
      </label>
      <input
        type="text"
        id="search"
        onKeyPress={preventSubmitOnEnter}
        placeholder="Search for tax code"
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="border w-full p-2 rounded mb-4"
      />
    </div>
  );
};

export default ProductTaxCodeDropdown;
