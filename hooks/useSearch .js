import { useState, useEffect } from 'react';
import { supabase } from '../src/services/supabase';


export const useSearch = (query) => {
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
        const { data: schoolData, error: schoolError } = await supabase
          .from('schools')
          .select('*')
          .or(`name.ilike.%${query}%,location.ilike.%${query}%`);

        if (schoolError) throw schoolError;

        const taggedSchools = schoolData.map((item) => ({
          ...item,
          entityType: 'school',
        }));

        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .or(`name.ilike.%${query}%,location.ilike.%${query}%,type.ilike.%${query}%`);

        if (propertyError) throw propertyError;

        const taggedProperties = propertyData.map((item) => ({
          ...item,
          entityType: 'property',
        }));

        const merged = [...taggedSchools, ...taggedProperties];

        setResults(merged);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { results, loading, error };
};
