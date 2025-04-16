import React, { useState } from "react";
import styles from "./AuthForm.module.scss";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import VerifyMail from "./components/VerifyMail/VerifyMail";
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
        <div style={{ width: "100%" }}>
          <VerifyMail />
        </div>
      );
    } else if (isLogin) {
      return (
        <div style={{ width: "100%" }}>
          <Login />
        </div>
      );
    } else {
      return (
        <div style={{ width: "100%" }}>
          <Register onSuccess={handleRegistrationSuccess} />
        </div>
      );
    }
  };

  const renderToggleButton = () => {
    if (showVerification) {
      return (
        <button className={styles.authForm__toggle} onClick={toggleForm}>
          Back to Login
        </button>
      );
    } else if (isLogin) {
      return (
        <button className={styles.authForm__toggle} onClick={toggleForm}>
          Need an account? Register
        </button>
      );
    } else {
      return (
        <button className={styles.authForm__toggle} onClick={toggleForm}>
          Already have an account? Login
        </button>
      );
    }
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
