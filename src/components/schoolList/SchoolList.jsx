// File: src/components/SchoolList/SchoolList.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SchoolCard from '../../pages/schoolCard/SchoolCard';
import SkeletonCard from '../SkeletonCard';
import styles from './SchoolList.module.css';
import { useGlobalSearch } from '../../../hooks/useGlobalSearch';
import { useSearchStore } from '../../../Zustand/searchStore';

const SchoolList = () => {
  const { schools, SchoolsLoading, schoolsError } = useOutletContext();

  // Global search
  const search = useSearchStore((state) => state.search);
  const { results, loading: searchLoading, error: searchError } = useGlobalSearch(search);

  // Search results only for schools
  const searchResults = search ? results.filter((item) => item.entityType === 'school') : [];
  const displaySchools = searchResults.length > 0 ? searchResults : schools;
  const displayLoading = search ? searchLoading : SchoolsLoading;
  const displayError = search ? searchError : schoolsError;

  const renderItem = (item) => <SchoolCard school={item} key={item.id} />;

  const skeletonCount = 6;

  return (
    <div className={styles.schoolsGrid}>
      {displayLoading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        : displaySchools.map((school) => renderItem(school))}
      {displayError && <p className={styles.errorText}>Error loading schools.</p>}
      {!displayLoading && displaySchools.length === 0 && <p>No schools match your search.</p>}
    </div>
  );
};

export default SchoolList;
