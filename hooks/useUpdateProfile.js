import { supabase } from "../src/services/supabase";

// Hook for updating user, children, preferences, workplace
export const useUpdateProfile = () => {

  const updateUser = async (userId, userData) => {
    const { data, error } = await supabase
      .from("users")
      .update({
        full_name: userData.full_name,
        nationality: userData.nationality,
      })
      .eq("id", userId)
      .select();
    if (error) throw error;
    return data[0];
  };

  const updateChildren = async (children) => {
    const updatedChildren = [];

    for (let child of children) {
      if (!child.id) {
        // Optionally, insert new child
        const { data, error } = await supabase
          .from("children")
          .insert([
            {
              user_id: child.user_id,
              full_name: child.full_name,
              age: child.age,
              current_grade: child.current_grade || null,
              education_stage: child.education_stage || null,
              preferred_curriculum: child.preferred_curriculum || null,
            },
          ])
          .select();
        if (error) throw error;
        updatedChildren.push(data[0]);
      } else {
        const { data, error } = await supabase
          .from("children")
          .update({
            full_name: child.full_name,
            age: child.age,
            current_grade: child.current_grade || null,
            education_stage: child.education_stage || null,
            preferred_curriculum: child.preferred_curriculum || null,
          })
          .eq("id", child.id)
          .select();
        if (error) throw error;
        updatedChildren.push(data[0]);
      }
    }

    return updatedChildren;
  };

  const updatePreferences = async (userId, preferences) => {
    const { data, error } = await supabase
      .from("user_preferences")
      .update({
        budget_min: preferences.budget_min,
        budget_max: preferences.budget_max,
        workplace_id: preferences.workplace_id || null,
      })
      .eq("user_id", userId)
      .select();
    if (error) throw error;
    return data[0];
  };

  const updateWorkplace = async (workplace) => {
    const { data, error } = await supabase
      .from("workplaces")
      .update({
        name: workplace.name,
      })
      .eq("id", workplace.id)
      .select();
    if (error) throw error;
    return data[0];
  };

  return { updateUser, updateChildren, updatePreferences, updateWorkplace };
};
