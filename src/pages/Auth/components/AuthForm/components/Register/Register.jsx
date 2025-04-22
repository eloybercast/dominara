import React, { useState, useEffect } from "react";
import styles from "./Register.module.scss";
import googleIcon from "../../../../../../assets/icons/google.svg";
import playIcon from "../../../../../../assets/icons/play.svg";
import useAuthStore from "../../../../../../stores/backend/auth";
import { register, getGoogleAuthUrl, processDeepLink } from "../../../../../../services/backend/auth.service";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../../../../utils/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { openUrl } from "@tauri-apps/plugin-opener";
import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link";

const Register = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { formData, updateFormData, login } = useAuthStore();
  const [username, setUsername] = useState(formData.username);
  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);
  const [repeatPassword, setRepeatPassword] = useState(formData.repeatPassword);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    let unlisten = () => {};

    getCurrent()
      .then((urls) => {
        if (urls && urls.length > 0) {
          handleDeepLink(urls[0]);
        }
      })
      .catch((err) => {
        console.error(`Register: Failed to get current deep link: ${err.message || JSON.stringify(err)}`);
      });

    onOpenUrl((url) => {
      handleDeepLink(url);
    })
      .then((unlistenFn) => {
        unlisten = unlistenFn;
      })
      .catch((err) => {
        console.error(`Register: Deep link listener error: ${err.message || JSON.stringify(err)}`);
      });

    return () => {
      unlisten();
    };
  }, []);

  const handleDeepLink = async (url) => {
    try {
      setIsLoading(true);

      const result = await processDeepLink(url);

      if (result.success && result.user) {
        login(result.user);

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(`Register: Deep link authentication failed: ${error.message || JSON.stringify(error)}`);
      setError(
        getErrorMessage({ code: "auth_deep_link_error" }) ||
          `Authentication error: ${error.message || JSON.stringify(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !repeatPassword) {
      setError(getErrorMessage({ code: "error_missing_fields" }));
      return;
    }

    if (password !== repeatPassword) {
      setError(getErrorMessage({ code: "error_passwords_not_match" }));
      return;
    }

    try {
      setIsLoading(true);
      const data = await register(email, username, password);
      login(data.user);

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const googleAuthUrl = getGoogleAuthUrl();

      if (!googleAuthUrl || googleAuthUrl.includes("undefined")) {
        const errorMsg = `Malformed authentication URL: ${googleAuthUrl}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      await openUrl(googleAuthUrl);

    } catch (error) {
      console.error("Register: Failed to open Google auth:", error);
      const errorDetails = error.message || JSON.stringify(error);
      const errorMsg = `Error opening Google authentication: ${errorDetails}`;
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.register} onSubmit={handleSubmit}>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            className={styles.register__error}
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
        className={styles.register__input}
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleChangeUsername}
        disabled={isLoading}
      />
      <input
        className={styles.register__input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChangeEmail}
        disabled={isLoading}
      />
      <input
        className={styles.register__input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChangePassword}
        disabled={isLoading}
      />
      <input
        className={styles.register__input}
        type="password"
        placeholder="Repeat Password"
        value={repeatPassword}
        onChange={handleChangeRepeatPassword}
        disabled={isLoading}
      />
      <div className={styles.register__buttons}>
        <button
          className={styles.register__buttons__google}
          type="button"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <img src={googleIcon} alt="google" />
        </button>
        <button className={styles.register__buttons__register} type="submit" disabled={isLoading}>
          <img src={playIcon} alt="play" />
        </button>
      </div>
    </form>
  );
};

export default Register;
