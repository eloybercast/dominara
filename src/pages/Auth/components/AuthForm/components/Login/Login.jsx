import React, { useState, useEffect } from "react";
import styles from "./Login.module.scss";
import googleIcon from "../../../../../../assets/icons/google.svg";
import playIcon from "../../../../../../assets/icons/play.svg";
import { motion } from "framer-motion";
import useAuthStore from "../../../../../../stores/auth";

const Login = () => {
  const { formData, updateFormData } = useAuthStore();
  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);

  const handleChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    updateFormData({ email: value });
  };

  const handleChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    updateFormData({ password: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login with:", { email, password });
  };

  return (
    <form className={styles.login} onSubmit={handleSubmit}>
      <motion.input
        className={styles.login__input}
        type="text"
        placeholder="Email"
        value={email}
        onChange={handleChangeEmail}
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        exit={{ y: -15, opacity: 0 }}
        transition={{ duration: 0.15 }}
        whileHover={{ rotate: -1 }}
      />
      <motion.input
        className={styles.login__input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChangePassword}
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        exit={{ y: -15, opacity: 0 }}
        transition={{ duration: 0.15, delay: 0.05 }}
        whileHover={{ rotate: 0.5 }}
      />
      <motion.div
        className={styles.login__buttons}
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        exit={{ y: -15, opacity: 0 }}
        transition={{ duration: 0.15, delay: 0.1 }}
      >
        <motion.button
          className={styles.login__buttons__google}
          type="button"
          whileHover={{ rotate: -0.5 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={googleIcon} alt="google" />
        </motion.button>
        <motion.button
          className={styles.login__buttons__login}
          type="submit"
          whileHover={{ rotate: 0.5 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={playIcon} alt="play" />
        </motion.button>
      </motion.div>
    </form>
  );
};

export default Login;
