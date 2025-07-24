// components/SearchBar.tsx
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { MdClear } from "react-icons/md";
import { Search } from "lucide-react";

export interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  suggestions: Array<{ id?: number; name: string }>;
  loading: boolean;
  error: string;
  onSelect: (name: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  suggestions,
  loading,
  error,
  onSelect,
}) => (
  <div className="relative w-full">
    <Input
      type="text"
      placeholder="Search for ingredients..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="pr-10"
      aria-label="Search for ingredients"
    />
    {query && (
      <button
        onClick={() => setQuery("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        aria-label="Clear search"
      >
        <MdClear size={18} />
      </button>
    )}

    {query.trim().length > 2 && (
      <div className="absolute left-0 right-0 mt-1 z-10">
        {loading ? (
          <ul className="border rounded-lg max-h-40 overflow-y-auto p-2 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="h-4 bg-gray-200 rounded mb-2" />
            ))}
          </ul>
        ) : error ? (
          <p className="p-2 text-red-500 text-sm">{error}</p>
        ) : (
          <ul
            role="listbox"
            className="border rounded-lg max-h-40 overflow-y-auto bg-white"
          >
            {suggestions.map((sug) => (
              <li
                key={sug.id ?? sug.name}
                role="option"
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => onSelect(sug.name)}
              >
                <Search size={16} />
                <span className="text-sm">{sug.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </div>
);

export default SearchBar;
