import React from "react";
import styles from "./Container.module.scss";

const Container = ({ icon: Icon, text }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>{Icon && <Icon className={styles.icon} />}</div>
      {text && <small>{text}</small>}
    </div>
  );
};

export default Container;
