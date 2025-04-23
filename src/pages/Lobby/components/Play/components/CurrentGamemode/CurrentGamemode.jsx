import React from "react";
import styles from "./CurrentGamemode.module.scss";
const CurrentGamemode = () => {
  return (
    <div className={styles.currentGamemode}>
      <section className={styles.currentGamemode__header}>
        <h5>Current Gamemode</h5>
      </section>
      <section className={styles.currentGamemode__buttons}>
        <article className={styles.currentGamemode__buttons__changeMode}>
          <small>Change Mode</small>
        </article>
        <article className={styles.currentGamemode__buttons__play}>
          <h3>Play</h3>
        </article>
      </section>
    </div>
  );
};

export default CurrentGamemode;
