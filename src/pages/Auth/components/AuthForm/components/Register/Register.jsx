import React, { useState } from "react";
import styles from "./Register.module.scss";
import googleIcon from "../../../../../../assets/icons/google.svg";
import playIcon from "../../../../../../assets/icons/play.svg";
import { motion } from "framer-motion";
import useAuthStore from "../../../../../../stores/auth";

const Register = () => {
  const { formData, updateFormData } = useAuthStore();
  const [username, setUsername] = useState(formData.username);
  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);
  const [repeatPassword, setRepeatPassword] = useState(formData.repeatPassword);

  const handleChangeUsername = (e) => {
    const value = e.target.value;
    setUsername(value);
    updateFormData({ username: value });
  };

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

  const handleChangeRepeatPassword = (e) => {
    const value = e.target.value;
    setRepeatPassword(value);
    updateFormData({ repeatPassword: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register with:", { username, email, password, repeatPassword });
  };

  return (
    <form className={styles.register} onSubmit={handleSubmit}>
      <motion.input
        className={styles.register__input}
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleChangeUsername}
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        exit={{ y: -15, opacity: 0 }}
        transition={{ duration: 0.1 }}
        whileHover={{ rotate: -0.8 }}
      />
      <motion.input
        className={styles.register__input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChangeEmail}
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        exit={{ y: -15, opacity: 0 }}
        transition={{ duration: 0.1, delay: 0.05 }}
        whileHover={{ rotate: 0.5 }}
      />
      <motion.input
        className={styles.register__input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChangePassword}
        initial={{ y: -15 }}
        animate={{ y: 0 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.1, delay: 0.1 }}
        whileHover={{ rotate: -0.7 }}
      />
      <motion.input
        className={styles.register__input}
        type="password"
        placeholder="Repeat Password"
        value={repeatPassword}
        onChange={handleChangeRepeatPassword}
        initial={{ y: -15 }}
        animate={{ y: 0 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.1, delay: 0.15 }}
        whileHover={{ rotate: 0.6 }}
      />
      <motion.div
        className={styles.register__buttons}
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.1, delay: 0.2 }}
      >
        <motion.button
          className={styles.register__buttons__google}
          type="button"
          whileHover={{ rotate: -0.5 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={googleIcon} alt="google" />
        </motion.button>
        <motion.button
          className={styles.register__buttons__register}
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

export default Register;
