import React from 'react';
import styles from './SearchBar.module.css';
import { useSearchStore } from '../../../Zustand/searchStore';

export default function SearchBar({ onSearch }) {
  const { search, setSearch } = useSearchStore();

  const handleSearch = () => {
    if (onSearch) onSearch(search);
  };

  const handleClear = () => {
    setSearch('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchSegment}>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Show X button only if there is text */}
        {search && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
          >
            &times; {/* simple X character */}
          </button>
        )}
      </div>

      <button className={styles.searchButton} onClick={handleSearch}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
