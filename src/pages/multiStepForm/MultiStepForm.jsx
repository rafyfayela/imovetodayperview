import { useState } from 'react';
import styles from './MultiStepForm.module.css';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted ✅", formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Multi-Step Form</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Step 1 */}
        {step === 1 && (
          <div className={styles.step}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className={styles.step}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>Address</label>
            <input
              type="text"
              name="address"
              className={styles.input}
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Step 3 - Review */}
        {step === 3 && (
          <div className={styles.step}>
            <h3 className={styles.reviewTitle}>Review Your Info</h3>
            <p>
              <strong>Name:</strong> {formData.name}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Password:</strong> {formData.password}
            </p>
            <p>
              <strong>Address:</strong> {formData.address}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={styles.buttons}>
          {step > 1 && (
            <button type="button" className={styles.buttonSecondary} onClick={prevStep}>
              Back
            </button>
          )}
          {step < 3 && (
            <button type="button" className={styles.buttonPrimary} onClick={nextStep}>
              Next
            </button>
          )}
          {step === 3 && (
            <button type="submit" className={styles.buttonSubmit}>
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
