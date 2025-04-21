import React, { useState, useEffect } from "react";
import styles from "./Register.module.scss";
import googleIcon from "../../../../../../assets/icons/google.svg";
import playIcon from "../../../../../../assets/icons/play.svg";
import useAuthStore from "../../../../../../stores/auth";
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
  const [debugInfo, setDebugInfo] = useState("");

  // Setup deep link handler
  useEffect(() => {
    console.log("Register: Setting up deep link handler");

    let unlisten = () => {};

    // Check if app was opened with a deep link
    getCurrent()
      .then((urls) => {
        if (urls && urls.length > 0) {
          console.log("Register: Processing deep link from startup:", urls[0]);
          setDebugInfo(`Register: Deep link at startup: ${urls[0]}`);
          handleDeepLink(urls[0]);
        } else {
          setDebugInfo("Register: No deep links at startup");
        }
      })
      .catch((err) => {
        const errorMsg = `Register: Failed to get current deep link: ${err.message || JSON.stringify(err)}`;
        console.error(errorMsg);
        setDebugInfo(errorMsg);
      });

    // Listen for future deep links
    onOpenUrl((url) => {
      const msg = `Register: Received deep link: ${url}`;
      console.log(msg);
      setDebugInfo((prev) => `${prev}\n${msg}`);
      handleDeepLink(url);
    })
      .then((unlistenFn) => {
        unlisten = unlistenFn;
        setDebugInfo((prev) => `${prev}\nDeep link listener registered successfully`);
      })
      .catch((err) => {
        const errorMsg = `Register: Deep link listener error: ${err.message || JSON.stringify(err)}`;
        console.error(errorMsg);
        setDebugInfo((prev) => `${prev}\n${errorMsg}`);
      });

    // Clean up on unmount
    return () => {
      console.log("Register: Cleaning up deep link listener");
      unlisten();
    };
  }, []);

  // Handle deep link authentication
  const handleDeepLink = async (url) => {
    try {
      console.log("Register: Processing deep link for auth");
      setDebugInfo((prev) => `${prev}\nProcessing deep link: ${url}`);
      setIsLoading(true);

      const result = await processDeepLink(url);
      setDebugInfo((prev) => `${prev}\nDeep link result: ${JSON.stringify(result)}`);

      if (result.success && result.user) {
        console.log("Register: Deep link authentication successful");
        setDebugInfo((prev) => `${prev}\nAuthentication successful: ${JSON.stringify(result.user)}`);
        login(result.user);

        // Handle onSuccess callback or redirect
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        } else {
          navigate("/");
        }
      } else {
        setDebugInfo((prev) => `${prev}\nInvalid result from processDeepLink: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      const errorMsg = `Register: Deep link authentication failed: ${error.message || JSON.stringify(error)}`;
      console.error(errorMsg);
      setDebugInfo((prev) => `${prev}\n${errorMsg}`);
      setError(
        getErrorMessage({ code: "auth_deep_link_error" }) ||
          `Error de autenticación: ${error.message || JSON.stringify(error)}`
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

      // Get the Google Auth URL with proper parameters
      const googleAuthUrl = getGoogleAuthUrl();
      console.log("Register: Opening Google auth URL:", googleAuthUrl);
      setDebugInfo((prev) => `${prev}\nOpening Google Auth URL: ${googleAuthUrl}`);

      // Verificar que la URL es válida
      if (!googleAuthUrl || googleAuthUrl.includes("undefined")) {
        const errorMsg = `URL de autenticación mal formada: ${googleAuthUrl}`;
        console.error(errorMsg);
        setDebugInfo((prev) => `${prev}\n${errorMsg}`);
        throw new Error(errorMsg);
      }

      // Open the URL in an external browser
      await openUrl(googleAuthUrl);

      // Note: We don't reset isLoading here because we're waiting for the deep link callback
      // The loading state will be reset when the deep link handler receives the callback
    } catch (error) {
      console.error("Register: Failed to open Google auth:", error);
      const errorDetails = error.message || JSON.stringify(error);
      const errorMsg = `Error al abrir autenticación de Google: ${errorDetails}`;
      setDebugInfo((prev) => `${prev}\n${errorMsg}`);
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

      {debugInfo && (
        <div
          style={{
            fontSize: "10px",
            fontFamily: "monospace",
            padding: "5px",
            margin: "5px 0",
            backgroundColor: "rgba(0,0,0,0.1)",
            color: "#333",
            maxHeight: "100px",
            overflow: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>Debug:</strong>
          <pre>{debugInfo}</pre>
        </div>
      )}

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
