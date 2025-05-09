import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFriendsMenuStore from "../../../stores/common/friendsMenu";
import styles from "./FriendsMenu.module.scss";
import { sidebarVariants, overlayVariants } from "./animations/menu";
import FriendsList from "./components/FriendsList/FriendsList";
import socialIcon from "../../../assets/icons/social.svg";
import AddFriend from "./components/AddFriend/AddFriend";
import { translate } from "../../../utils/i18n";

const FriendsMenu = () => {
  const { isOpen, closeMenu } = useFriendsMenuStore();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
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
              <img src={socialIcon} alt="social" />
              <h3>{translate("friends.social")}</h3>
            </section>

            <section className={styles.addFriend}>
              <AddFriend />
            </section>

            <section className={styles.content}>
              <FriendsList />
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FriendsMenu;
