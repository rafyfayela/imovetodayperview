import { useNavigate } from 'react-router';
import styles from './LandingPage.module.css';
import { motion } from 'framer-motion';
import moveuae from './moveuae.png';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.landingPage}>
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Free, Premium
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Relocation Services
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Let us make your move to Dubai seamless and stress-free with our premium relocation
              services
            </motion.p>
            <button onClick={() => navigate('/signup')} className={styles.ctaButton}>
              Start Your Journey
            </button>
          </div>
          <div className={styles.heroImage}>
            <motion.img
              src={moveuae}
              alt="Move UAE"
              className={styles.imagePlaceholder}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
          </div>
        </section>

        <section className={styles.features}>
          <h3>Why You'll Love Our Relocation Services</h3>

          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" stroke="#E41B23" strokeWidth="2" />
                  <path
                    d="M8 12.5L11 15.5L16 9.5"
                    stroke="#E41B23"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>So Easy</h4>
              <p>Our streamlined process makes relocation simple and straightforward.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="6" cy="12" r="2" stroke="#00843D" strokeWidth="2" />
                  <line
                    x1="6"
                    y1="4"
                    x2="6"
                    y2="10"
                    stroke="#00843D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="6"
                    y1="14"
                    x2="6"
                    y2="20"
                    stroke="#00843D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <circle cx="12" cy="6" r="2" stroke="#00843D" strokeWidth="2" />
                  <line
                    x1="12"
                    y1="2"
                    x2="12"
                    y2="4"
                    stroke="#00843D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="22"
                    stroke="#00843D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <circle cx="18" cy="16" r="2" stroke="#00843D" strokeWidth="2" />
                  <line
                    x1="18"
                    y1="4"
                    x2="18"
                    y2="14"
                    stroke="#00843D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="18"
                    y1="18"
                    x2="18"
                    y2="20"
                    stroke="#00843D"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h4>Super Customizable</h4>
              <p>Tailor our services to your specific needs and preferences.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" stroke="#000000" strokeWidth="2" />
                  <circle cx="9" cy="10" r="1" fill="#000000" />
                  <circle cx="15" cy="10" r="1" fill="#000000" />
                  <path
                    d="M8 16C9.33333 17.3333 14.6667 17.3333 16 16"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h4>Client Approved</h4>
              <p>Thousands of successful relocations with rave reviews from our clients.</p>
            </div>
          </div>
        </section>

        {/* Additional Sections */}
        <section className={styles.extraSection}>
          <h3>Add Matching Housing and School Solutions</h3>
          <div className={styles.extraContent}>
            <p>
              We'll find the perfect home and school for your family based on your specific needs
              and preferences.
            </p>
          </div>
        </section>

        <section className={styles.extraSection}>
          <h3>Put Your Relocation Plan Together</h3>
          <div className={styles.extraContent}>
            <p>
              We'll make this transition fun and easy with our comprehensive relocation planning
              tools.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <h3>We'll make this fun and easy!</h3>
          <button className={styles.ctaButton}>Start Your Journey</button>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
