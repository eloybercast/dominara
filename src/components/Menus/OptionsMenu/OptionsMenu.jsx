import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useOptionsMenuStore from "../../../stores/common/optionsMenu";
import styles from "./OptionsMenu.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { sidebarVariants, overlayVariants } from "./animations/animations";
import { translate } from "../../../utils/i18n";
import Item from "./components/Item/Item";

const OptionsMenu = () => {
  const { isOpen, closeMenu } = useOptionsMenuStore();

  const items = [
    {
      label: translate("options.game_settings"),
    },
    {
      label: translate("options.report_bug"),
    },
    {
      label: translate("options.privacy_policy"),
    },
    {
      label: translate("options.code_of_conduct"),
    },
    {
      label: translate("options.tutorial"),
    },
    {
      label: translate("options.credits"),
    },
    {
      label: translate("options.leave_game"),
      isLeaveGame: true,
    },
  ];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  const handleItemClick = () => {
    closeMenu();
  };

  if (!isOpen && typeof window === "undefined") return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={handleOverlayClick}
          initial="closed"
          animate="open"
          exit="closed"
          variants={overlayVariants}
        >
          <motion.div
            className={styles.sidebar}
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <section className={styles.header}>
              <GiHamburgerMenu className={styles.hamburger} />
              <h3>{translate("options.menu")}</h3>
            </section>

            <section className={styles.content}>
              {items.map((item) => (
                <Item
                  key={item.label}
                  onClick={handleItemClick}
                  isLeaveGame={item.isLeaveGame}
                >
                  <h5>{item.label}</h5>
                </Item>
              ))}
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OptionsMenu;
