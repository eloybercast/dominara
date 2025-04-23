import React from "react";
import styles from "./Play.module.scss";
import CurrentGamemode from "./components/CurrentGamemode/CurrentGamemode";
const Play = () => {
  return (
    <main className={styles.play}>
      <section className={styles.play__currentGamemode}>
        <CurrentGamemode />
      </section>
    </main>
  );
};

export default Play;
