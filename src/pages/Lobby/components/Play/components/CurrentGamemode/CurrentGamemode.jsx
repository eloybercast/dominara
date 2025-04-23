import React from "react";
import styles from "./CurrentGamemode.module.scss";
import { translate } from "../../../../../../utils/i18n";
import useGamemodeStore from "../../../../../../stores/common/gamemode";
import { motion, AnimatePresence } from "framer-motion";
import { headingVariants } from "./animations";

const CurrentGamemode = () => {
  const { currentGamemode, cycleGamemode } = useGamemodeStore();

  const handleChangeMode = () => {
    cycleGamemode();
  };

  return (
    <div className={styles.currentGamemode}>
      <section className={styles.currentGamemode__header}>
        <AnimatePresence mode="wait">
          <motion.h5 key={currentGamemode} variants={headingVariants} initial="initial" animate="animate" exit="exit">
            {translate(`lobby.gamemodes.${currentGamemode}`)}
          </motion.h5>
        </AnimatePresence>
      </section>
      <section className={styles.currentGamemode__buttons}>
        <article className={styles.currentGamemode__buttons__changeMode} onClick={handleChangeMode}>
          <small>{translate("lobby.changeMode")}</small>
        </article>
        <article className={styles.currentGamemode__buttons__play}>
          <h3>{translate("lobby.play")}</h3>
        </article>
      </section>
    </div>
  );
};

export default CurrentGamemode;
