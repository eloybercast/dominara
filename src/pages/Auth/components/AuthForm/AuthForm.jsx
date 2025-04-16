import React, { useState } from "react";
import styles from "./AuthForm.module.scss";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import VerifyMail from "./components/VerifyMail/VerifyMail";
import useAuthStore from "../../../../stores/auth";
import { motion, AnimatePresence } from "framer-motion";
import { slideVariants, springTransition, buttonTransition } from "./animations/formAnimations";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [direction, setDirection] = useState(1);
  const { user } = useAuthStore();

  const toggleForm = () => {
    if (showVerification) {
      setDirection(-1);
      setShowVerification(false);
    } else {
      setDirection(isLogin ? 1 : -1);
      setIsLogin(!isLogin);
    }
  };

  const handleRegistrationSuccess = () => {
    setDirection(1);
    setShowVerification(true);
  };

  const renderContent = () => {
    let content;
    let key;

    if (showVerification) {
      content = <VerifyMail />;
      key = "verification";
    } else if (isLogin) {
      content = <Login />;
      key = "login";
    } else {
      content = <Register onSuccess={handleRegistrationSuccess} />;
      key = "register";
    }

    return (
      <AnimatePresence mode="popLayout" custom={direction} initial={false}>
        <motion.div
          key={key}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={springTransition}
          style={{ width: "100%" }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderToggleButton = () => {
    let buttonText;
    let toggleKey;

    if (showVerification) {
      buttonText = "Back to Login";
      toggleKey = "back-to-login";
    } else if (isLogin) {
      buttonText = "Need an account? Register";
      toggleKey = "to-register";
    } else {
      buttonText = "Already have an account? Login";
      toggleKey = "to-login";
    }

    return (
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.button
          className={styles.authForm__toggle}
          onClick={toggleForm}
          key={toggleKey}
          variants={buttonTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {buttonText}
        </motion.button>
      </AnimatePresence>
    );
  };

  return (
    <article className={styles.authForm}>
      <div className={styles.authForm__header}>{/** Logo */}</div>
      <div className={styles.authForm__content}>{renderContent()}</div>
      <div className={styles.authForm__toggleContainer}>{renderToggleButton()}</div>
    </article>
  );
};

export default AuthForm;
