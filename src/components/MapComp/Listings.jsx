import React from 'react';
import Card from '../Card';

const Listings = ({ isOpen, topPadding = 100, schools, properties }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: topPadding,
        left: 0,
        height: `calc(100% - ${topPadding}px)`,
        width: '100%',
        backgroundColor: '#fff',
        overflowY: 'auto',
        zIndex: 20,
        padding: '40px',
        fontFamily: "'Poppins', sans-serif",
        color: '#333',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
        }}
      >
        {schools.map((school) => (
          <Card key={school.id} item={school} type="school" />
        ))}

        {properties.map((property) => (
          <Card key={property.id} item={property} type="property" />
        ))}
      </div>
    </div>
  );
};

export default Listings;
