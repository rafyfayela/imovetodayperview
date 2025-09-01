import styles from './Profile.module.css';

const ProfileCard = ({ title, data, isMultiItem = false }) => {
  console.log(data);
  return (
    <div className={styles.profileCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <div className={styles.cardContent}>
        {isMultiItem ? (
          data.map((item, idx) => (
            <div key={idx} className={styles.cardItem}>
              {Object.entries(item).map(([key, value]) => (
                <div key={key}>
                  <span className={styles.fieldLabel}>{key} : </span>
                  <span className={styles.fieldValue}>{value || '—'}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className={styles.cardItem}>
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>
                <span className={styles.fieldLabel}>{key} : </span>
                <span className={styles.fieldValue}>{value || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
