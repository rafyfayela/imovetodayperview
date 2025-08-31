import { useState } from 'react';
import styles from './AppHome.module.css';
import OurTopGems from '../PropertyComponents/OurTopGems';
import OurApartments from '../PropertyComponents/OurApartments';
import PropertiesInDubai from '../PropertyComponents/PropertiesInDubai';
import OurTopSchools from '../schoolComponent/OurTopSchools';
import AmericanCurriculumSchools from '../schoolComponent/AmericanCurriculumSchools';
import { useSearchStore } from '../../../Zustand/searchStore';
import { useSearch } from '../../../hooks/useSearch ';
import ReusableCard from '../ReusableCard';
import Ai from '../../assets/ai.png';
import { useNavigate } from 'react-router';

const AppHome = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const navigate = useNavigate();

  const search = useSearchStore((state) => state.search);
  const { results, loading, error } = useSearch(search);
  // console.log('Search Results:', JSON.stringify(results, null, 2));

  if (search && search.trim() !== '') {
    return (
      <div className={styles.homePage}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && results.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%', // or the height of the container
                  width: '100%',
                  color: '#333',
                }}
              >
                <p>No results found</p>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div className={styles.resultsGrid}>
                {results.map((item) => (
                  <ReusableCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default view when no search term
  return (
    <div className={styles.appHome}>
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our top gems</h2>
            <OurTopGems />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Featured Apartments</h2>
            <OurApartments />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Properties in Dubai</h2>
            <PropertiesInDubai />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Top Rated Schools</h2>
            <OurTopSchools />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>American Curriculum Schools</h2>
            <AmericanCurriculumSchools />
          </section>
        </div>
      </div>
      <button
        className={`${styles.floatingButton} ${isMapOpen ? 'open' : ''}`}
        onClick={() => navigate('/app/just-for-u')}
      >
        <img src={Ai} alt="AI" style={{ width: '18px', height: '18px', marginRight: '6px' }} />
        {isMapOpen ? 'Close' : 'Curated for You'}
      </button>
    </div>
  );
};

export default AppHome;
