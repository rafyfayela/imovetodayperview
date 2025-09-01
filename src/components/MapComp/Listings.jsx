import React from 'react';
import Card from '../Card';

const Listings = ({ schools = [], properties = [] }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0, // automatically starts at the top
        left: 0,
        width: '100%',
        height: '100%', // fill parent container
        backgroundColor: '#fff',
        overflowY: 'auto',
        zIndex: 20,
        paddingTop: '100px', // space for toggle panel / header
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '20px',
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
