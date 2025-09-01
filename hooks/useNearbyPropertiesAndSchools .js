import { useState, useEffect } from 'react';
import { supabase } from '../src/services/supabase';

export const useNearbyPropertiesAndSchools = (radiusKm = 5, refreshTrigger = 0) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) throw authError || new Error('User not authenticated');
        const userId = user.id;

        const { data: workplace, error: workplaceError } = await supabase
          .from('workplaces')
          .select('location')
          .eq('user_id', userId)
          .single();

        if (workplaceError || !workplace) throw workplaceError || new Error('Workplace not found');
        const [wpLat, wpLng] = workplace.location.split(',').map(Number);

        // 2️⃣ Get user's children
        const { data: children, error: childrenError } = await supabase
          .from('children')
          .select('*')
          .eq('user_id', userId);

        if (childrenError) throw childrenError;

        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('id, name, fees_range, rating, transport, geolocation, grades , images');

        if (schoolsError) throw schoolsError;

        const nearbySchools = schoolsData.filter((school) => {
          const { latitude: sLat, longitude: sLng } = JSON.parse(school.geolocation);
          const distance = Math.sqrt(Math.pow(sLat - wpLat, 2) + Math.pow(sLng - wpLng, 2)) * 111;
          return distance <= radiusKm;
        });

        const filteredSchools = nearbySchools
          .map((school) => {
            const matchedChildren = children.filter((child) =>
              school.grades.includes(child.uae_equivalent)
            );
            if (matchedChildren.length > 0) {
              return {
                name: school.name,
                grades: school.grades,
                fees_range: school.fees_range,
                rating: school.rating,
                transport: school.transport,
                id: school.id,
                geolocation: school.geolocation,
                matchedChildren,
                images: school.images,
              };
            }
            return null;
          })
          .filter(Boolean);

        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*');

        if (propertiesError) throw propertiesError;

        const nearbyProperties = propertiesData.filter((property) => {
          const { latitude: pLat, longitude: pLng } = JSON.parse(property.location);
          const distance = Math.sqrt(Math.pow(pLat - wpLat, 2) + Math.pow(pLng - wpLng, 2)) * 111;
          return distance <= radiusKm;
        });

        setData({
          userId,
          workplace: { location: workplace.location },
          children,
          schools: filteredSchools,
          properties: nearbyProperties,
        });
      } catch (err) {
        console.error('[Debug] Error fetching data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [radiusKm, refreshTrigger]);

  return { loading, data, error };
};
