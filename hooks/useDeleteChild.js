import { useState } from 'react';
import { supabase } from '../src/services/supabase';

export const useDeleteChild = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteChild = async (childId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate input
      if (!childId) {
        throw new Error('No child ID provided for deletion');
      }

      console.log('Deleting child with ID:', childId);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error('Authentication error: ' + sessionError.message);
      }

      if (!session?.user) {
        throw new Error('No user logged in');
      }

      const userId = session.user.id;

      // Delete the child record
      const { error: deleteError } = await supabase
        .from('children')
        .delete()
        .eq('id', childId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw new Error('Failed to delete child: ' + deleteError.message);
      }

      console.log('Child deleted successfully');
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Error deleting child:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteChild, loading, error, success };
};
