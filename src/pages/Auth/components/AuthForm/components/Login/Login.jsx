import React, { useState, useEffect } from "react";
import styles from "./Login.module.scss";
import googleIcon from "../../../../../../assets/icons/google.svg";
import playIcon from "../../../../../../assets/icons/play.svg";
import useAuthStore from "../../../../../../stores/auth";
import { login, getGoogleAuthUrl } from "../../../../../../services/backend/auth.service";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../../../../utils/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { onOpenUrl } from "@tauri-apps/plugin-deep-link";
import { openUrl } from "@tauri-apps/plugin-opener";

const Login = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, login: loginStore } = useAuthStore();
  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);
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
                    loginStore(userData);
                    navigate("/");
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
