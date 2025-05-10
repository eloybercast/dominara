import React, { useRef, useEffect } from "react";
import styles from "./Container.module.scss";

const Container = ({ icon: Icon, text }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Generate a random rotation between -2 and 2 degrees
      const randomRotation = Math.random() * 4 - 2;
      containerRef.current.style.setProperty(
        "--rotation",
        `${randomRotation}deg`
      );
    }
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.iconContainer}>
        {Icon && <Icon className={styles.icon} />}
      </div>
      {text && <small>{text}</small>}
    </div>
  );
};

export default Container;
