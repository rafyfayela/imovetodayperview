import React from 'react';
import Slider from 'react-slick';
import styles from '../components/PropertyComponents/TopGemsCard.module.css'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

export default function ReusableCard({ item }) {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    adaptiveHeight: false,
  };

  const handleClick = () => {
    if (item.type === 'school') {
      window.open(`/app/schools/${item.id}`, '_blank');
    } else {
      window.open(`/app/properties/${item.id}`, '_blank');
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.cardCarousel}>
        <Slider {...settings}>
          {item?.images?.map((img, index) => (
            <img key={index} src={img} alt={item?.name} className={styles.cardImage} />
          ))}
        </Slider>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{item?.name}</h3>

        <p className={styles.cardText}>{item?.address || item?.location}</p>

        {item.type === 'school' ? (
          <p className={styles.cardText}>
            {item?.curriculum} | {item?.grades}
          </p>
        ) : (
          <p className={styles.cardText}>
            {item?.type} | {item?.bedrooms} Bed • {item?.bathrooms} Bath
          </p>
        )}

        {/* Rating */}
        {item?.rating && <p className={styles.rating}>⭐ {item.rating}</p>}
      </div>
    </div>
  );
}
