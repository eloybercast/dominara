import React from "react";
import styles from "./Play.module.scss";
import CurrentGamemode from "./components/CurrentGamemode/CurrentGamemode";
import { motion } from "framer-motion";
import useLobbbyModeStore from "../../../../stores/common/lobbyMode";
import { playVariants, playTransition } from "./animations/animations";

const Play = () => {
  const { isExiting } = useLobbbyModeStore();

  return (
    <main className={styles.play}>
      <motion.section
        className={styles.play__currentGamemode}
        variants={playVariants}
        initial="initial"
        animate={isExiting ? "exit" : "animate"}
        exit="exit"
        transition={playTransition}
      >
        <CurrentGamemode />
      </motion.section>
    </main>
  );
};

export default Play;
