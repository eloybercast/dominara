import React, { useState } from "react";
import styles from "./Login.module.scss";
import googleIcon from "../../../../../../assets/icons/google.svg";
import playIcon from "../../../../../../assets/icons/play.svg";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../../../../../stores/auth";
import { login } from "../../../../../../services/backend/auth.service";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../../../../utils/i18n";

const Login = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, login: loginStore } = useAuthStore();
  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(getErrorMessage({ code: "error_missing_fields" }));
      return;
    }

    try {
      setIsLoading(true);
      const data = await login(email, password);
      loginStore(data.user);
      navigate("/");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.login} onSubmit={handleSubmit}>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            className={styles.login__error}
            initial={{ opacity: 0, scaleY: 0, height: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
            animate={{
              opacity: 1,
              scaleY: 1,
              height: "auto",
              marginTop: "0.5em",
              marginBottom: "0.8em",
              padding: "0.8em",
            }}
            exit={{
              opacity: 0,
              scaleY: 0,
              height: 0,
              marginTop: 0,
              marginBottom: 0,
              padding: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.04, 0.62, 0.23, 0.98],
              when: "beforeChildren",
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              {error}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.input
        className={styles.login__input}
        type="text"
        placeholder="Email"
        value={email}
        onChange={handleChangeEmail}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -15, opacity: 0 }}
        transition={{ duration: 0.25 }}
        whileHover={{ rotate: -1.5 }}
        disabled={isLoading}
      />
      <motion.input
        className={styles.login__input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChangePassword}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -15, opacity: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        whileHover={{ rotate: 0.8 }}
        disabled={isLoading}
      />
      <motion.div
        className={styles.login__buttons}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -15, opacity: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        <motion.button
          className={styles.login__buttons__google}
          type="button"
          whileHover={{ rotate: -0.8 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          <img src={googleIcon} alt="google" />
        </motion.button>
        <motion.button
          className={styles.login__buttons__login}
          type="submit"
          whileHover={{ rotate: 0.8 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          <img src={playIcon} alt="play" />
        </motion.button>
      </motion.div>
    </form>
  );
};

export default Login;
