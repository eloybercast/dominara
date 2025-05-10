import { useState } from "react";
import { motion } from "framer-motion";
import { translate } from "../../../../../utils/i18n";
import styles from "./Item.module.scss";
import { Window } from "@tauri-apps/api/window";
import ConfirmChoice from "../../../../Modals/ConfirmChoice/ConfirmChoice";

const Item = ({ children, onClick, isLeaveGame = false }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const randomRotation = Math.random() * 2 - 1;

  const handleClick = () => {
    if (isLeaveGame) {
      setShowConfirmModal(true);
    } else if (onClick) {
      onClick();
    }
  };

  const handleConfirmLeave = async () => {
    setShowConfirmModal(false);

    if (onClick) {
      onClick();
    }

    try {
      const appWindow = Window.getCurrent();
      await appWindow.close();
    } catch (error) {
      console.error("Failed to close application:", error);
    }
  };

  const handleCancelLeave = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
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

      {isLeaveGame && (
        <ConfirmChoice
          isOpen={showConfirmModal}
          titleKey="options.leave_game"
          messageKey="confirmChoice.leaveGameMessage"
          onConfirm={handleConfirmLeave}
          onCancel={handleCancelLeave}
        />
      )}
    </>
  );
};

export default Item;
