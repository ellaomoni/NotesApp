import React, { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<Props> = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Search notes by title or content..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
      <button
        onClick={handleClear}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        Clear
      </button>
    </div>
  );
};

export default SearchBar;