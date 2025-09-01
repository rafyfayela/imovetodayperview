import React, { useEffect, useState, useRef } from 'react';
import MapComponent from './MapComp/MapComponent';
import SlidePanel from './MapComp/SlidePanel';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { useUserFullInfo } from '../../hooks/useUserFullInfo';
import { useNearbyPropertiesAndSchools } from '../../hooks/useNearbyPropertiesAndSchools ';
import Listings from './MapComp/Listings';

const JustForU = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [pickLocationMode, setPickLocationMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { data: userInfo } = useUserFullInfo();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(70);
  const { data, loading: justLoad } = useNearbyPropertiesAndSchools(radiusKm, refreshTrigger);

  const toggleRef = useRef(null);
  const [topPadding, setTopPadding] = useState(100);

  useEffect(() => {
    if (userInfo && (!userInfo.children || userInfo.children.length === 0)) {
      setIsPanelOpen(true);
    }
  }, [userInfo]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (toggleRef.current) {
      setTopPadding(toggleRef.current.offsetHeight + 20);
    }
  }, [toggleRef.current]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
          flex: 1,
          padding: '0 20px',
          overflow: 'auto',
          backgroundColor: '#f0f0f0',
          position: 'relative',
        }}
      >
        {/* Toggle button */}
        <div
          ref={toggleRef}
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

        <Listings
          topPadding={topPadding}
          schools={data?.schools || []}
          properties={data?.properties || []}
        />

        <SlidePanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          userInfo={userInfo}
          pickLocationMode={pickLocationMode}
          setPickLocationMode={setPickLocationMode}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          refreshTrigger={refreshTrigger}
          onSave={() => setRefreshTrigger((prev) => prev + 1)}
        />
      </div>

      {/* Right side: map */}
      <div style={{ flex: 1, backgroundColor: '#ddd', overflow: 'hidden' }}>
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
