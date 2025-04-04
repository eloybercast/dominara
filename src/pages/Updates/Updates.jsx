import React, { useEffect } from "react";
import useUpdateStore from "../../stores/updates";
import logoIcon from "../../assets/logo.svg";
import styles from "./Updates.module.scss";
import ProgressBar from "../../components/Progress/ProgressBar/ProgressBar";
const Updates = () => {
  const { errorMessage, checkForUpdates, downloadProgress, updateStatus } = useUpdateStore();

  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <main className={styles.updates}>
      <section className={styles.updates__logo}>
        <img src={logoIcon} alt="Logo" className={styles.logo} />
      </section>
      <section className={styles.updates__progress}>
        <ProgressBar progress={90} total={100} />
        <small>{updateStatus}</small>
      </section>
    </main>
  );
};

export default Updates;
