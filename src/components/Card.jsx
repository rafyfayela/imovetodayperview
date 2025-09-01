import React from 'react';

const Card = ({ item, type }) => {
  const styles = {
    card: {
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '1rem',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '24rem',
      cursor: 'pointer',
      margin: '1rem auto',
    },
    image: {
      width: '100%',
      height: '12rem',
      objectFit: 'cover',
    },
    content: {
      padding: '1rem',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    text: {
      color: '#4a4a4a',
      marginBottom: '0.25rem',
    },
    recommend: {
      color: '#16a34a',
      fontWeight: '500',
      marginTop: '0.5rem',
    },
    tags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem',
      fontSize: '0.875rem',
      color: '#4a4a4a',
    },
    chipContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '8px',
    },
    chip: {
      backgroundColor: '#E0F7FA', // light teal, you can change color
      color: '#00796B',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '0.9rem',
      fontWeight: 500,
    },
  };
  const handleClick = () => {
    if (type === 'school') {
      window.open(`/app/schools/${item.id}`, '_blank');
    } else {
      window.open(`/app/properties/${item.id}`, '_blank');
    }
  };
  return (
    <div style={styles.card} onClick={handleClick}>
      {/* Image */}
      {item.images && item.images.length > 0 && (
        <img src={item.images[0]} alt={item.name} style={styles.image} />
      )}

      {/* Content */}
      <div style={styles.content}>
        <h2 style={styles.title}>{item.name}</h2>

        {type === 'school' && (
          <>
            <p style={styles.text}>
              Grades: {item.grades[0]} - {item.grades[item.grades.length - 1]}
            </p>
            <p style={styles.text}>Fees: {item.fees_range}</p>
            <p style={styles.text}>Rating: {item.rating} ⭐</p>
            <p style={styles.text}>Transport: {item.transport ? 'Available' : 'Not available'}</p>
            {item.matchedChildren && item.matchedChildren.length > 0 && (
              <div style={styles.chipContainer}>
                {item.matchedChildren.map((c) => (
                  <span key={c.id} style={styles.chip}>
                    {c.full_name}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* Property-specific info */}
        {type === 'property' && (
          <>
            <p style={styles.text}>Type: {item.type}</p>
            <p style={styles.text}>
              Bedrooms: {item.bedrooms}, Bathrooms: {item.bathrooms}
            </p>
            <p style={styles.text}>{item.description}</p>
            <p style={styles.text}>Rating: {item.rating} ⭐</p>
            <p style={styles.text}>
              Listing: {item.listing_type === 'buy' ? 'For Sale' : 'For Rent'}
            </p>
            <div style={styles.tags}>
              {item.pool && <span>Pool</span>}
              {item.garden && <span>Garden</span>}
              {item.balcony && <span>Balcony</span>}
              {item.gym && <span>Gym</span>}
              {item.furnished && <span>Furnished</span>}
              {item.parking && <span>Parking</span>}
              {item.equipped_kitchen && <span>Kitchen</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
