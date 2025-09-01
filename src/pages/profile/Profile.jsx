import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Profile.module.css';
import ProfileCard from './ProfileCard';
import { useAuthContext } from '../../../Provider/AuthProvider';
import { supabase } from '../../services/supabase';

// Mapping DB keys to friendly labels
const userLabels = {
  full_name: 'Name',
  nationality: 'Nationality',
  family_size: 'Family Size',
};

const childLabels = {
  full_name: 'Name',
  age: 'Age',
  education_stage: 'Education Stage',
  uae_equivalent: 'UAE Equivalent',
};

const mapDataWithLabels = (data, labels) => {
  const mapped = {};
  for (const key in data) {
    if (labels[key] !== undefined) {
      mapped[labels[key]] = data[key] || '—';
    }
  }
  return mapped;
};

const Profile = () => {
  const { profile: userData, loading } = useAuthContext();
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      if (!userData) return;
      const { data: kids } = await supabase.from('children').select('*').eq('user_id', userData.id);
      setChildren(kids || []);
    };

    fetchChildren();
  }, [userData]);

  if (loading || !userData) {
    return <p className={styles.loadingText}>Loading profile...</p>;
  }

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userData.full_name || 'User'
  )}&background=0D8ABC&color=fff&rounded=true`;

  const displayedUserData = mapDataWithLabels(userData, userLabels);
  const displayedChildren = children.map((child) => mapDataWithLabels(child, childLabels));

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.profileHeader}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.img
          src={userData.photo_url || fallbackAvatar}
          alt="Profile"
          className={styles.avatar}
          whileHover={{ scale: 1.05 }}
        />
        <div className={styles.profileInfo}>
          <motion.h2
            className={styles.profileName}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {userData.full_name}
          </motion.h2>
          <motion.p
            className={styles.profileDetail}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {userData.nationality || 'Not set'}
          </motion.p>
        </div>
        <motion.button
          className={styles.editButton}
          onClick={() => navigate('/app/edit-profile', { state: { profile: userData, children } })}
          whileHover={{ scale: 1.05, backgroundColor: '#0d8abc' }}
          whileTap={{ scale: 0.95 }}
        >
          Edit Profile
        </motion.button>
      </motion.div>

      <motion.div
        className={styles.cardsGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, staggerChildren: 0.2 }}
      >
        <ProfileCard title="User Information" data={displayedUserData} />

        {displayedChildren.length > 0 && (
          <ProfileCard title="Children" data={displayedChildren} isMultiItem={true} />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Profile;
