import { motion } from "framer-motion";
import styles from "./Item.module.scss";
import { Window } from "@tauri-apps/api/window";

const Item = ({ children, onClick, isLeaveGame = false }) => {
  const randomRotation = Math.random() * 2 - 1;

  const handleClick = async () => {
    if (onClick) {
      onClick();
    }

    if (isLeaveGame) {
      try {
        const appWindow = Window.getCurrent();
        await appWindow.close();
      } catch (error) {
        console.error("Failed to close application:", error);
      }
    }
  };

  return (
    <motion.div
      className={`${styles.item} ${isLeaveGame ? styles.leaveGame : ""}`}
      initial={{ opacity: 0, y: 10, rotate: randomRotation }}
      animate={{ opacity: 1, y: 0, rotate: randomRotation }}
      whileHover={{ rotate: 0 }}
      whileTap={{ scale: 0.99, rotate: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={handleClick}
    >
      {children}
    </motion.div>
  );
};

export default Item;
