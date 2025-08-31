import { useState, useEffect } from 'react';
import { supabase } from '../src/services/supabase';

/**
 * Custom hook to search both schools and properties.
 * It searches all relevant text fields and numeric fields like rating or fees_range.
 * Returns results tagged by entityType.
 */
export const useGlobalSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.trim() === '') {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let mergedResults = [];

        // --- Search Schools ---
        const { data: schoolData, error: schoolError } = await supabase
          .from('schools')
          .select('*')
          .or(`
            name.ilike.%${query}%,
            location.ilike.%${query}%,
            type.ilike.%${query}%,
            curriculum.ilike.%${query}%,
            grades.ilike.%${query}%,
            contact.ilike.%${query}%,
            website.ilike.%${query}%,
            fees_range.ilike.%${query}%
          `);

        if (schoolError) throw schoolError;

        const taggedSchools = schoolData.map((item) => ({
          ...item,
          entityType: 'school',
        }));

        mergedResults = [...mergedResults, ...taggedSchools];

        // --- Search Properties ---
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .or(`
            name.ilike.%${query}%,
            address.ilike.%${query}%,
            city.ilike.%${query}%,
            type.ilike.%${query}%,
            description.ilike.%${query}%,
            location.ilike.%${query}%,
            listing_type.ilike.%${query}%
          `);

        if (propertyError) throw propertyError;

        const taggedProperties = propertyData.map((item) => ({
          ...item,
          entityType: 'property',
        }));

        mergedResults = [...mergedResults, ...taggedProperties];

        setResults(mergedResults);
      } catch (err) {
        console.error('Search error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { results, loading, error };
};
