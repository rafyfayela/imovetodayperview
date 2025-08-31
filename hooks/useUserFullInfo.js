import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../src/services/supabase';

export const useUserFullInfo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setError(authError);
        setLoading(false);
      } else if (user) {
        setUserId(user.id);
      } else {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const fetchUserInfo = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const { data: userInfo, error: rpcError } = await supabase.rpc('get_user_full_info', {
        user_uuid: userId,
      });

      // console.log('RPC fetch:', userInfo, rpcError);

      if (rpcError) {
        setError(rpcError);
        setData(null);
      } else {
        setData(userInfo);
      }
    } catch (err) {
      console.error('Unexpected error in fetchUserInfo:', err);
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
  }, [userId, fetchUserInfo]);

  return { data, loading, error, refetch: fetchUserInfo };
};
