import React from "react";
import styles from "./ProgressBar.module.scss";

const ProgressBar = ({ progress, total }) => {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressBar__progress} style={{ width: `${percentage}%` }} />
      <div className={styles.progressBar__percentage}>{percentage}%</div>
    </div>
  );
};

export default ProgressBar;
