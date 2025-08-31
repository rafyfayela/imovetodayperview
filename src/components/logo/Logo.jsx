import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';
import { supabase } from '../../services/supabase';
import LogoImg from '../../assets/Logo/Logo.png';
import { motion } from 'framer-motion';

export const Logo = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Link to={session ? '/app' : '/'} style={{ textDecoration: 'none' }}>
      <div className={styles.logo}>
        <motion.img
          src={LogoImg}
          alt="iMove Today Logo"
          className={styles.logoImage}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </Link>
  );
};
