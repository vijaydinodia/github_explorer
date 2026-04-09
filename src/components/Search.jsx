import { useState, useEffect } from "react";

const Search = ({ value, onChange }) => {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleChange = (e) => {
    setInput(e.target.value);
    onChange(e.target.value);
  };

  return (
    <input
      className="search"
      type="text"
      placeholder="Search GitHub users..."
      value={input}
      onChange={handleChange}
    />
  );
};

export default Search;
