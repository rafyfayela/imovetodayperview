// File: src/components/PropertyList/PropertyList.jsx
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './PropertiesList.module.css';
import ReusableCard from '../ReusableCard';
import { useGlobalSearch } from '../../../hooks/useGlobalSearch';
import { useSearchStore } from '../../../Zustand/searchStore';

const PropertyList = () => {
  const { properties, propertiesLoading, propertiesError } = useOutletContext();
  const [filter, setFilter] = useState('all'); // all, rent, buy

  // Global search
  const search = useSearchStore((state) => state.search);
  const { results, loading: searchLoading, error: searchError } = useGlobalSearch(search);

  // Filter properties by listing type
  const filteredProperties = properties.filter((property) => {
    if (filter === 'all') return true;
    return property.listing_type === filter;
  });

  // Search results only for properties
  const searchResults = search ? results.filter((item) => item.entityType === 'property') : [];
  const displayProperties = searchResults.length > 0 ? searchResults : filteredProperties;
  const displayLoading = search ? searchLoading : propertiesLoading;
  const displayError = search ? searchError : propertiesError;

  const filterOptions = ['all', 'rent', 'buy'];

  return (
    <div style={{ flex: '1', paddingTop: 70 }}>
      {/* Filter Bar (only when no search) */}
      {!search && (
        <div className={styles.filterContainer}>
          {filterOptions.map((option) => (
            <button
              key={option}
              className={`${styles.filterButton} ${filter === option ? styles.activeFilter : ''}`}
              onClick={() => setFilter(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Properties Grid */}
      {displayLoading && <p>Loading...</p>}
      {displayError && <p>Error: {displayError.message}</p>}
      {!displayLoading && !displayError && displayProperties.length === 0 && (
        <p>No properties match your search/filter.</p>
      )}

      <div className={styles.propertiesGrid}>
        {!displayLoading &&
          !displayError &&
          displayProperties.map((property) => <ReusableCard key={property.id} item={property} />)}
      </div>
    </div>
  );
};

export default PropertyList;
