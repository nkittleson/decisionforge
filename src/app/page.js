'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Page() {
  const [description, setDescription] = useState('');
  const [timeConstraint, setTimeConstraint] = useState('');

  const activeSources = [
    'Joint Intelligence Database',
    'Theater Command Intel',
    'Satellite Network',
    'Field Reports Database'
  ];

  const additionalSources = [
    'Satellite Imagery',
    'Ground Sensors',
    'Intel Reports',
    'Open Sources',
    'Human Intelligence',
    'Signal Intelligence'
  ];

  return (
    <main className={styles.container}>
      <h1>New Scenario Analysis</h1>
      
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label>Scenario Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the current situation and objectives..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>Time Constraint</label>
          <select 
            value={timeConstraint}
            onChange={(e) => setTimeConstraint(e.target.value)}
          >
            <option value="">Select time constraint...</option>
            <option value="1h">1 hour</option>
            <option value="4h">4 hours</option>
            <option value="24h">24 hours</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <h3>Active Intelligence Sources</h3>
          <div className={styles.sourcesList}>
            {activeSources.map((source, index) => (
              <div key={index} className={styles.activeSource}>
                <span className={styles.activeDot} />
                {source}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <h3>Additional Data Sources</h3>
          <div className={styles.checkboxGroup}>
            {additionalSources.map((source, index) => (
              <label key={index} className={styles.checkboxItem}>
                <input type="checkbox" />
                {source}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <h3>Upload Supplemental Intelligence</h3>
          <div className={styles.uploadArea}>
            <p>Drag and drop files here or click to browse</p>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Generate Analysis
        </button>
      </form>
    </main>
  );
} 