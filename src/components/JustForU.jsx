import React, { useEffect, useState } from 'react';
import MapComponent from './MapComp/MapComponent';
import SlidePanel from './MapComp/SlidePanel';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { useUserFullInfo } from '../../hooks/useUserFullInfo';
import { useNearbyPropertiesAndSchools } from '../../hooks/useNearbyPropertiesAndSchools ';
import Listings from './MapComp/Listings';

const JustForU = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [pickLocationMode, setPickLocationMode] = useState(false);
  const { data: userInfo } = useUserFullInfo();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(70);
  const { data, loading: justLoad } = useNearbyPropertiesAndSchools(radiusKm);
  // console.log('Schools:', JSON.stringify(schools, null, 2));
  console.log('Propertiesssssssssssss:', JSON.stringify(data?.properties, null, 2));

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          flex: 1,
          padding: '100px 20px 20px 20px',
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
          position: 'relative',
        }}
      >
        <div
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          style={{
            position: 'fixed',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#e71d35',
            color: '#fff',
            borderRadius: '0 5px 5px 0',
            padding: '10px',
            cursor: 'pointer',
            zIndex: 9999,
          }}
        >
          {isPanelOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
        </div>

        <Listings schools={data?.schools || []} properties={data?.properties || []} />

        <SlidePanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          userInfo={userInfo}
          pickLocationMode={pickLocationMode}
          setPickLocationMode={setPickLocationMode}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </div>

      <div style={{ flex: 1, backgroundColor: '#ddd' }}>
        <MapComponent
          pickLocationMode={pickLocationMode}
          properties={data?.properties || []}
          schools={data?.schools || []}
          setPickLocationMode={setPickLocationMode}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          userWorkplaceLocation={
            userInfo && userInfo[0]?.workplace_location
              ? (() => {
                  const [lat, lng] = userInfo[0].workplace_location.split(',').map(Number);
                  return { latitude: lat, longitude: lng };
                })()
              : null
          }
          radiusKm={radiusKm}
          setRadiusKm={setRadiusKm}
        />
      </div>
    </div>
  );
};

export default JustForU;
