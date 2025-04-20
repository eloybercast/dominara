import React, { useState, useEffect } from "react";
import styles from "./Register.module.scss";
import googleIcon from "../../../../../../assets/icons/google.svg";
import playIcon from "../../../../../../assets/icons/play.svg";
import useAuthStore from "../../../../../../stores/auth";
import { register, getGoogleAuthUrl } from "../../../../../../services/backend/auth.service";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../../../../utils/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { onOpenUrl } from "@tauri-apps/plugin-deep-link";
import { openUrl } from "@tauri-apps/plugin-opener";

const Register = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { formData, updateFormData, login } = useAuthStore();
  const [username, setUsername] = useState(formData.username);
  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);
  const [repeatPassword, setRepeatPassword] = useState(formData.repeatPassword);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Listen for deep link callback events
  useEffect(() => {
    let unlisten;

    const setupDeepLinkListener = async () => {
      try {
        unlisten = await onOpenUrl((urls) => {
          if (urls && urls.length > 0) {
            const url = urls[0];
            console.log("Deep link received:", url);

            try {
              // Parse the URL
              const urlObj = new URL(url);
              console.log("Parsed URL:", {
                protocol: urlObj.protocol,
                pathname: urlObj.pathname,
                search: urlObj.search,
                searchParams: Object.fromEntries(urlObj.searchParams.entries()),
              });

              // Check if this is our auth callback
              if (urlObj.protocol === "dominara:") {
                const params = new URLSearchParams(urlObj.search);
                const token = params.get("token");
                const userStr = params.get("user");

                console.log("Auth params:", { token: token ? "exists" : "missing", userStr: userStr || "missing" });

                if (token && userStr) {
                  // Store auth data
                  localStorage.setItem("token", token);

                  try {
                    const userData = JSON.parse(decodeURIComponent(userStr));
                    console.log("Parsed user data:", userData);
                    localStorage.setItem("user", JSON.stringify(userData));

                    // Update auth store and navigate
                    login(userData);

                    if (onSuccess && typeof onSuccess === "function") {
                      onSuccess();
                    } else {
                      navigate("/");
                    }
                  } catch (err) {
                    console.error("Error parsing user data:", err);
                  }
                }
              }
            } catch (err) {
              console.error("Error processing deep link:", err);
            } finally {
              setIsLoading(false);
            }
          }
        });
      } catch (err) {
        console.error("Failed to set up deep link listener:", err);
      }
    };

    setupDeepLinkListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, [login, navigate, onSuccess]);

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
      console.log("Opening Google auth URL:", googleAuthUrl);

      // Open the URL in an external browser
      await openUrl(googleAuthUrl);
    } catch (error) {
      console.error("Failed to open Google auth:", error);
      setError(getErrorMessage({ code: "google_auth_error" }));
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
