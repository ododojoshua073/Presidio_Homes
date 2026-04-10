import React, { useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ filter, setFilter }) => {
  const [searchValue, setSearchValue] = useState(filter || "");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchValue)}`);
      if (setFilter) {
        setFilter(searchValue);
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (setFilter) {
      setFilter(value);
    }
  };

  return (
    <form className="flexCenter search-bar" onSubmit={handleSearch}>
      <HiLocationMarker color="var(--blue)" size={25} />
      <input
        placeholder="Search by title/city/country..."
        type="text"
        value={searchValue}
        onChange={handleInputChange}
      />
      <button type="submit" className="button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
