import React, { useState, useEffect } from "react";
import { translate } from "../../../utils/i18n";
import styles from "./ConfirmChoice.module.scss";

/**
 * A modal component for confirming user choices with two options
 * @param {Object} props
 * @param {string} props.titleKey - i18n key for title text
 * @param {string} props.messageKey - i18n key for message text
 * @param {string} props.confirmTextKey - i18n key for confirm button text
 * @param {string} props.cancelTextKey - i18n key for cancel button text
 * @param {Object} props.titleParams - Parameters for i18n title translation
 * @param {Object} props.messageParams - Parameters for i18n message translation
 * @param {function} props.onConfirm - Function to call when confirm is clicked
 * @param {function} props.onCancel - Function to call when cancel is clicked
 * @param {boolean} props.isOpen - Whether the modal is open or not
 */
const ConfirmChoice = ({
  titleKey = "confirmChoice.defaultTitle",
  messageKey = "confirmChoice.defaultMessage",
  confirmTextKey = "confirmChoice.confirmButton",
  cancelTextKey = "confirmChoice.cancelButton",
  titleParams = {},
  messageParams = {},
  onConfirm,
  onCancel,
  isOpen,
}) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen && !mounted) {
      setMounted(true);
      // Delay to trigger the entrance animation
      setTimeout(() => setVisible(true), 10);
    } else if (!isOpen && mounted) {
      setVisible(false);
      // Wait for exit animation to complete before unmounting
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted]);

  if (!mounted) return null;

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  const handleCancel = () => {
    setVisible(false);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.visible : ""}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modal} ${visible ? styles.visible : ""}`}>
        <div className={styles.header}>
          <h3>{translate(titleKey, titleParams)}</h3>
        </div>
        <div className={styles.content}>
          <p>{translate(messageKey, messageParams)}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            {translate(cancelTextKey)}
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            {translate(confirmTextKey)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmChoice;
