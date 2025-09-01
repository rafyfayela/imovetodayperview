import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUpdateProfile } from '../../../hooks/useUpdateProfile';
import { useAuthContext } from '../../../Provider/AuthProvider';
import { supabase } from '../../services/supabase';

const EditProfile = () => {
  const { profile: userData, loading, refreshProfile } = useAuthContext();
  const navigate = useNavigate();
  const { updateUser, updateChildren, updatePreferences, updateWorkplace } = useUpdateProfile();

  const [formData, setFormData] = useState({});
  const [children, setChildren] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [workplace, setWorkplace] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData) return;
      setLoadingData(true);

      setFormData(userData);

      try {
        const { data: kids } = await supabase
          .from('children')
          .select('*')
          .eq('user_id', userData.id);
        setChildren(kids || []);

        const { data: prefs } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userData.id)
          .single();
        setPreferences(prefs || null);

        if (prefs?.workplace_id) {
          const { data: work } = await supabase
            .from('workplaces')
            .select('*')
            .eq('id', prefs.workplace_id)
            .single();
          setWorkplace(work || null);
        }
      } catch (err) {
        console.error('Fetch data error:', err);
        toast.error('Failed to fetch profile data.');
      }

      setLoadingData(false);
    };

    fetchData();
  }, [userData]);

  if (loading || loadingData || !userData) return <p className={styles.loadingText}>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUser(userData.id, formData);
      await updateChildren(children);

      if (preferences) await updatePreferences(userData.id, preferences);
      if (workplace?.id) await updateWorkplace(workplace);
      await refreshProfile();

      toast.success('Profile updated successfully!');
      setTimeout(() => navigate('/app/profile'), 1500);
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div style={{ paddingTop: '50px' }}>
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <h1>Edit Profile</h1>

        {/* User Info */}
        <div className={styles.formGroup}>
          <label>Full Name:</label>
          <input
            type="text"
            value={formData.full_name || ''}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Nationality:</label>
          <input
            type="text"
            value={formData.nationality || ''}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
          />
        </div>

        {/* Preferences */}
        {preferences && (
          <>
            <h2>Preferences</h2>
            <div className={styles.formGroup}>
              <label>Budget Min:</label>
              <input
                type="number"
                value={preferences.budget_min || ''}
                onChange={(e) => setPreferences({ ...preferences, budget_min: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Budget Max:</label>
              <input
                type="number"
                value={preferences.budget_max || ''}
                onChange={(e) => setPreferences({ ...preferences, budget_max: e.target.value })}
              />
            </div>
          </>
        )}

        <div className={styles.formButtons}>
          <button type="submit">Save</button>
          <button type="button" className="cancel" onClick={() => navigate('/app/profile')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
