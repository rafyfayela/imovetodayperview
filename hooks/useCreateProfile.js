// src/hooks/useCreateProfile.js
import { supabase } from "../services/supabase";

export const useCreateProfile = () => {
  const createProfile = async (userId, formData) => {
    try {
      // 1️⃣ Update user info
      const { data: user, error: userError } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          nationality: formData.nationality,
          family_size: formData.family_size,
        })
        .eq("id", userId)
        .select()
        .single();

      if (userError) throw userError;

      // 2️⃣ Create workplace if exists
      let workplaceId = null;
      if (formData.nameWork) {
        const { data: wp, error: wpError } = await supabase
          .from("workplaces")
          .insert([
            {
              user_id: userId,
              name: formData.nameWork,
              city: formData.city,
              industry: formData.industry,
              location: JSON.stringify(formData.location),
            },
          ])
          .select()
          .single();

        if (wpError) throw wpError;
        workplaceId = wp.id;
      }

      // 3️⃣ Create preferences
      const { data: prefs, error: prefsError } = await supabase
        .from("user_preferences")
        .insert([
          {
            user_id: userId,
            budget_min: formData.budget_min,
            budget_max: formData.budget_max,
            workplace_id: workplaceId,
          },
        ])
        .select()
        .single();

      if (prefsError) throw prefsError;

      // 4️⃣ Create children
      if (formData.children.length > 0) {
        const childrenData = formData.children.map((child) => ({
          user_id: userId,
          full_name: child.fullName,
          age: child.age,
          current_grade: child.currentGrade || null,
          education_stage: child.educationStage || null,
          preferred_curriculum: child.preferredCurriculum || null,
        }));

        const { error: childrenError } = await supabase
          .from("children")
          .insert(childrenData);

        if (childrenError) throw childrenError;
      }

      return { user, prefs };
    } catch (err) {
      console.error("Create profile error:", err);
      throw err;
    }
  };

  return { createProfile };
};
