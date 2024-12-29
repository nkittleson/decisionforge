'use client';

import React from 'react';
import styles from './ScenarioAnalysis.module.css';

const ScenarioAnalysis = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          DecisionForge™ by VectorForge
        </div>
        <nav className={styles.headerNav}>
          <button className={styles.navButton}>Dashboard</button>
          <button className={styles.navButton}>Details</button>
          <button className={styles.navButton}>Comparison</button>
          <button className={styles.navButton}>Settings</button>
        </nav>
      </header>

      <div className={styles.scenarioContainer}>
        <h2>New Scenario Analysis</h2>
        
        <div className={styles.section}>
          <label className={styles.sectionHeader}>Scenario Description</label>
          <textarea placeholder="Describe the current situation and objectives..." />
        </div>

        <div className={styles.section}>
          <label className={styles.sectionHeader}>Time Constraint</label>
          <select>
            <option value="">Select time constraint...</option>
            {/* Add your time constraint options here */}
          </select>
        </div>

        <div className={styles.activeSources}>
          <h3 className={styles.sectionHeader}>Active Intelligence Sources</h3>
          <p className={styles.activeSourcesHeader}>Currently analyzing data from:</p>
          <div className={styles.sourceList}>
            <div className={styles.sourceItem}>Joint Intelligence Database</div>
            <div className={styles.sourceItem}>Theater Command Intel</div>
            <div className={styles.sourceItem}>Satellite Network</div>
            <div className={styles.sourceItem}>Field Reports Database</div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Additional Data Sources</h3>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Satellite Imagery
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Ground Sensors
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Intel Reports
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Open Sources
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Human Intelligence
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Signal Intelligence
            </label>
          </div>
        </div>

        <div className={styles.uploadArea}>
          <p>Drag and drop files here or click to browse</p>
        </div>
      </div>
    </>
  );
};

export default ScenarioAnalysis; 