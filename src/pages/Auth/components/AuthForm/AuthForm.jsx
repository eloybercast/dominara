import React, { useState } from "react";
import styles from "./AuthForm.module.scss";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import VerifyMail from "./components/VerifyMail/VerifyMail";
import { AnimatePresence, motion } from "framer-motion";
import useAuthStore from "../../../../stores/auth";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const { user } = useAuthStore();

  const toggleForm = () => {
    if (showVerification) {
      setShowVerification(false);
    } else {
      setIsLogin(!isLogin);
    }
  };

  const handleRegistrationSuccess = () => {
    setShowVerification(true);
  };

  const renderContent = () => {
    if (showVerification) {
      return (
        <motion.div
          key="verify"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          style={{ width: "100%" }}
        >
          <VerifyMail />
        </motion.div>
      );
    } else if (isLogin) {
      return (
        <motion.div
          key="login"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          style={{ width: "100%" }}
        >
          <Login />
        </motion.div>
      );
    } else {
      return (
        <motion.div
          key="register"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          style={{ width: "100%" }}
        >
          <Register onSuccess={handleRegistrationSuccess} />
        </motion.div>
      );
    }
  };

  const renderToggleButton = () => {
    if (showVerification) {
      return (
        <motion.button
          key="login-link-from-verify"
          className={styles.authForm__toggle}
          onClick={toggleForm}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.35,
            ease: [0.04, 0.62, 0.23, 0.98],
          }}
        >
          Back to Login
        </motion.button>
      );
    } else if (isLogin) {
      return (
        <motion.button
          key="register-link"
          className={styles.authForm__toggle}
          onClick={toggleForm}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.35,
            ease: [0.04, 0.62, 0.23, 0.98],
          }}
        >
          Need an account? Register
        </motion.button>
      );
    } else {
      return (
        <motion.button
          key="login-link"
          className={styles.authForm__toggle}
          onClick={toggleForm}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.35,
            ease: [0.04, 0.62, 0.23, 0.98],
          }}
        >
          Already have an account? Login
        </motion.button>
      );
    }
  };

  return (
    <motion.article
      className={styles.authForm}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
    >
      <div className={styles.authForm__header}>{/** Logo */}</div>
      <div className={styles.authForm__content}>
        <AnimatePresence mode="wait" initial={false}>
          {renderContent()}
        </AnimatePresence>
      </div>
      <div className={styles.authForm__toggleContainer}>
        <AnimatePresence mode="wait" initial={false}>
          {renderToggleButton()}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

export default AuthForm;
