import { useState } from 'react';
import { supabase } from '../src/services/supabase';

export const useSaveFamilyData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const saveFamilyData = async (family_size, location, children = []) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!family_size || family_size < 1) {
        throw new Error('Please enter a valid family size (minimum 1)');
      }

      if (!location || !location.latitude || !location.longitude) {
        throw new Error('Please select a valid workplace location');
      }

      console.log('Starting save process...');

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      console.log('Session data:', session);

      if (sessionError) {
        throw new Error('Authentication error: ' + sessionError.message);
      }

      if (!session?.user) {
        throw new Error('No user logged in');
      }

      const userId = session.user.id;
      const parsedFamilySize = parseInt(family_size);
      const locationString = `${location.latitude},${location.longitude}`;

      console.log('Saving data for user:', userId, {
        family_size: parsedFamilySize,
        location: locationString,
        children_count: children.length,
      });

      const { error: updateError } = await supabase
        .from('users')
        .update({
          family_size: parsedFamilySize,
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Family size update error:', updateError);
        throw new Error('Family size update failed: ' + updateError.message);
      }

      console.log('Family size updated successfully');

      let workplaceId;
      const { data: existingWorkplace, error: fetchError } = await supabase
        .from('workplaces')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing workplace:', fetchError);
        throw new Error('Failed to check existing workplace: ' + fetchError.message);
      }

      if (existingWorkplace) {
        const { data: updatedWorkplace, error: updateWorkplaceError } = await supabase
          .from('workplaces')
          .update({
            location: locationString,
          })
          .eq('id', existingWorkplace.id)
          .select()
          .single();

        if (updateWorkplaceError) {
          console.error('Workplace update error:', updateWorkplaceError);
          throw new Error('Workplace location update failed: ' + updateWorkplaceError.message);
        }

        workplaceId = updatedWorkplace.id;
        console.log('Workplace location updated successfully:', updatedWorkplace);
      } else {
        const { data: newWorkplace, error: insertError } = await supabase
          .from('workplaces')
          .insert({
            user_id: userId,
            name: 'Workplace',
            city: 'Unknown',
            location: locationString,
            industry: null,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Workplace insert error:', insertError);
          throw new Error('Workplace location save failed: ' + insertError.message);
        }

        workplaceId = newWorkplace.id;
        console.log('Workplace location inserted successfully:', newWorkplace);
      }

      if (children && children.length > 0) {
        console.log('Processing children data:', children);

        const { error: deleteError } = await supabase
          .from('children')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          console.error('Error deleting existing children:', deleteError);
        }

        const childrenToInsert = children.map((child) => ({
          user_id: userId,
          full_name: child.full_name || '',
          age: child.age || 0,
          current_grade: child.current_grade || '',
          education_stage: child.education_stage || '',
          preferred_curriculum: child.preferred_curriculum || '',
          uae_equivalent: child.uae_equivalent || '',
          created_at: new Date().toISOString(),
        }));

        const { data: insertedChildren, error: childrenError } = await supabase
          .from('children')
          .insert(childrenToInsert)
          .select();

        if (childrenError) {
          console.error('Children insert error:', childrenError);
          throw new Error('Failed to save children data: ' + childrenError.message);
        }

        console.log('Children data saved successfully:', insertedChildren);
      } else {
        console.log('No children data to save');
      }

      setSuccess(true);
      return {
        success: true,
        workplaceId: workplaceId,
        action: existingWorkplace ? 'updated' : 'inserted',
      };
    } catch (err) {
      console.error('Error saving data:', err);
      setError(err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return { saveFamilyData, loading, error, success };
};
