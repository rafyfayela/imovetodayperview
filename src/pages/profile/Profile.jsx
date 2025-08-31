import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import ProfileCard from "./ProfileCard";
import { useAuthContext } from "../../../Provider/AuthProvider";
import { supabase } from "../../services/supabase";

const filterDisplayData = (data, excludeKeys = []) => {
  if (!data) return {};
  const filtered = {};
  for (const key in data) {
    if (!excludeKeys.includes(key)) filtered[key] = data[key];
  }
  return filtered;
};

const Profile = () => {
  const { profile: userData, loading } = useAuthContext();
  const [children, setChildren] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [workplace, setWorkplace] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!userData) return;
      setLoadingData(true);

      const { data: kids } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", userData.id);
      setChildren(kids || []);

      const { data: prefs, error: prefError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userData.id)
        .single();

      if (!prefError) {
        setPreferences(prefs);
        if (prefs?.workplace_id) {
          const { data: work } = await supabase
            .from("workplaces")
            .select("*")
            .eq("id", prefs.workplace_id)
            .single();
          setWorkplace(work);
        }
      }

      setLoadingData(false);
    };

    fetchData();
  }, [userData]);

  if (loading || loadingData || !userData) {
    return <p className={styles.loadingText}>Loading profile...</p>;
  }

  const filteredUserData = filterDisplayData(userData, [
    "id",
    "email",
    "photo_url",
    "avatar_url",
    "created_at",
    "user_id",
    "family_size",
  ]);

    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userData?.full_name || "User"
  )}&background=0D8ABC&color=fff&rounded=true`;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>

      <div className={styles.profileHeader}>
        <img
          src={userData.photo_url || fallbackAvatar}
          alt="Profile"
          className={styles.avatar}
        />
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{userData.full_name}</h2>
          <p className={styles.profileDetail}>
            {userData.nationality || "Not set"}
          </p>
        </div>
        <button
          onClick={() =>
            navigate("/app/edit-profile", {
              state: { profile: userData, children, preferences, workplace },
            })
          }
        >
          Edit Profile
        </button>
      </div>

      <div className={styles.cardsGrid}>
        <ProfileCard title="User Information" data={filteredUserData} />

        {children.length > 0 && (
          <ProfileCard
            title="Children"
            data={children.map((child) =>
              filterDisplayData(child, ["id", "user_id", "created_at"])
            )}
            isMultiItem={true}
          />
        )}

        {preferences && (
          <ProfileCard
            title="Preferences"
            data={{
              Budget: `${preferences.budget_min} - ${preferences.budget_max}`,
              Workplace: workplace?.name || "Not selected",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
