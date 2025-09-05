import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className = "",
  showFilters = false,
  filters = [],
  selectedFilter = "",
  onFilterChange 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-10"
        />
      </div>

      {showFilters && filters.length > 0 && (
        <div className="relative">
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange?.(e.target.value)}
            className="input-field pr-8 min-w-[120px]"
          >
            <option value="">All</option>
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchBar;