import React, { useState, useEffect } from "react";
import styles from "./Login.module.scss";
import googleIcon from "../../../../../../assets/icons/google.svg";
import playIcon from "../../../../../../assets/icons/play.svg";
import useAuthStore from "../../../../../../stores/auth";
import { login, getGoogleAuthUrl } from "../../../../../../services/backend/auth.service";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../../../../utils/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { openUrl } from "@tauri-apps/plugin-opener";
import authHandlerService from "../../../../../../services/tauri/auth-handler.service";

const Login = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, login: loginStore } = useAuthStore();
  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Setup authentication via deep links
  useEffect(() => {
    console.log("Login: Setting up auth handler listener");

    // Register for authentication events
    const unsubscribe = authHandlerService.onAuthenticated(({ userData }) => {
      console.log("Login: Received authentication data", userData);

      // Update auth store with the user data
      loginStore(userData);

      // Navigate to home
      navigate("/");

      // Reset loading state just in case
      setIsLoading(false);
    });

    // Clean up on unmount
    return () => {
      console.log("Login: Cleaning up auth handler listener");
      unsubscribe();
    };
  }, [loginStore, navigate]);

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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      // Get the Google Auth URL with proper parameters
      const googleAuthUrl = getGoogleAuthUrl();
      console.log("Login: Opening Google auth URL:", googleAuthUrl);

      // Open the URL in an external browser
      await openUrl(googleAuthUrl);
    } catch (error) {
      console.error("Login: Failed to open Google auth:", error);
      setError(getErrorMessage({ code: "google_auth_error" }));
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.login} onSubmit={handleSubmit}>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            className={styles.login__error}
            initial={{ opacity: 0, y: -20, height: 0, margin: 0, padding: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto", margin: "0.5em 0 0.8em 0", padding: "0.8em" }}
            exit={{ opacity: 0, y: -10, height: 0, margin: 0, padding: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        className={styles.login__input}
        type="text"
        placeholder="Email"
        value={email}
        onChange={handleChangeEmail}
        disabled={isLoading}
      />
      <input
        className={styles.login__input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChangePassword}
        disabled={isLoading}
      />
      <div className={styles.login__buttons}>
        <button
          className={styles.login__buttons__google}
          type="button"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <img src={googleIcon} alt="google" />
        </button>
        <button className={styles.login__buttons__login} type="submit" disabled={isLoading}>
          <img src={playIcon} alt="play" />
        </button>
      </div>
    </form>
  );
};

export default Login;
