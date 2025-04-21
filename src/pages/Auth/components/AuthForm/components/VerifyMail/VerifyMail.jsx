import React, { useState, useEffect } from "react";
import styles from "./VerifyMail.module.scss";
import { sendVerificationEmail, verifyEmail, processDeepLink } from "../../../../../../services/backend/auth.service";
import { translate, getErrorMessage } from "../../../../../../utils/i18n";
import useAuthStore from "../../../../../../stores/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link";

const VerifyMail = () => {
  const { user, login } = useAuthStore();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [digitsFilled, setDigitsFilled] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  // Handle deep links for email verification
  useEffect(() => {
    console.log("VerifyMail: Setting up deep link handler");
    setDebugInfo("VerifyMail: Setting up deep link handler");

    let unlisten = () => {};

    // Check if app was opened with a deep link
    getCurrent()
      .then((urls) => {
        if (urls && urls.length > 0) {
          console.log("VerifyMail: Processing deep link from startup:", urls[0]);
          setDebugInfo((prev) => `${prev}\nDeep link at startup: ${urls[0]}`);
          handleDeepLink(urls[0]);
        } else {
          setDebugInfo((prev) => `${prev}\nNo deep links at startup`);
        }
      })
      .catch((err) => {
        const errorMsg = `VerifyMail: Failed to get current deep link: ${err.message || JSON.stringify(err)}`;
        console.error(errorMsg);
        setDebugInfo((prev) => `${prev}\n${errorMsg}`);
      });

    // Listen for future deep links
    onOpenUrl((url) => {
      const msg = `VerifyMail: Received deep link: ${url}`;
      console.log(msg);
      setDebugInfo((prev) => `${prev}\n${msg}`);
      handleDeepLink(url);
    })
      .then((unlistenFn) => {
        unlisten = unlistenFn;
        setDebugInfo((prev) => `${prev}\nDeep link listener registered successfully`);
      })
      .catch((err) => {
        const errorMsg = `VerifyMail: Failed to set up deep link listener: ${err.message || JSON.stringify(err)}`;
        console.error(errorMsg);
        setDebugInfo((prev) => `${prev}\n${errorMsg}`);
      });

    // Clean up on unmount
    return () => {
      console.log("VerifyMail: Cleaning up deep link listener");
      unlisten();
    };
  }, []);

  // Process deep links
  const handleDeepLink = async (url) => {
    try {
      setDebugInfo((prev) => `${prev}\nProcessing deep link: ${url}`);

      // Parse the URL
      const parsedUrl = new URL(url);
      setDebugInfo((prev) => `${prev}\nParsed URL: ${parsedUrl}`);

      // Check if this is a verification link
      const code = parsedUrl.searchParams.get("code");
      const verified = parsedUrl.searchParams.get("verified");
      setDebugInfo((prev) => `${prev}\nVerification code in URL: ${code || "none"}`);
      setDebugInfo((prev) => `${prev}\nVerified flag in URL: ${verified || "none"}`);

      // Para los enlaces de verificación de email, tendremos los parámetros 'token' y 'user'
      // como parte de la URL cuando regresamos del backend después de verificar el correo
      const token = parsedUrl.searchParams.get("token");
      const userJson = parsedUrl.searchParams.get("user");

      setDebugInfo((prev) => `${prev}\nToken in URL: ${token ? "present" : "none"}`);
      setDebugInfo((prev) => `${prev}\nUser data in URL: ${userJson ? "present" : "none"}`);

      if (token && userJson) {
        try {
          // Procesamos el deep link para autenticación automática
          setIsLoading(true);

          // Intenta parsear los datos del usuario
          const userData = JSON.parse(userJson);
          setDebugInfo((prev) => `${prev}\nParsed user data: ${JSON.stringify(userData)}`);

          // Almacena los datos de autenticación directamente
          localStorage.setItem("token", token);
          localStorage.setItem("user", userJson);

          // Actualiza el estado de autenticación
          login(userData);

          // Si el email fue verificado, redirigimos a la página principal
          if (verified === "true" || (userData && userData.emailVerified)) {
            setDebugInfo((prev) => `${prev}\nEmail verified, redirecting to home`);
            setTimeout(() => {
              navigate("/");
            }, 1500);
          }

          return;
        } catch (parseError) {
          setDebugInfo((prev) => `${prev}\nFailed to parse user data: ${parseError.message}`);
          throw parseError;
        }
      }

      if (code) {
        console.log("VerifyMail: Found verification code in deep link:", code);
        setVerificationCode(code);
        handleVerifyEmail(code);
      } else if (token) {
        // Si solo hay token pero no datos de usuario, procesamos con la API
        console.log("VerifyMail: Found auth token in deep link");
        setIsLoading(true);

        try {
          const result = await processDeepLink(url);
          setDebugInfo((prev) => `${prev}\nDeep link authentication result: ${JSON.stringify(result)}`);

          if (result.success && result.user) {
            login(result.user);
            navigate("/");
          } else {
            setDebugInfo((prev) => `${prev}\nInvalid result from processDeepLink: ${JSON.stringify(result)}`);
          }
        } catch (authError) {
          const errorMsg = `Deep link auth error: ${authError.message || JSON.stringify(authError)}`;
          console.error(errorMsg);
          setDebugInfo((prev) => `${prev}\n${errorMsg}`);
          throw authError; // Re-throw to be caught by outer catch
        }
      } else {
        setDebugInfo((prev) => `${prev}\nNo code or token found in URL`);
      }
    } catch (error) {
      console.error("VerifyMail: Deep link processing failed:", error);
      setDebugInfo((prev) => `${prev}\nProcessing error: ${error.message || JSON.stringify(error)}`);
      setError(getErrorMessage({ code: "deep_link_error" }) || `Error: ${error.message || JSON.stringify(error)}`);
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const code = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setVerificationCode(code);
    setDigitsFilled(code.length === 6);

    if (code.length === 6) {
      handleVerifyEmail(code);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (isResending) return;

    try {
      setIsResending(true);
      setDebugInfo((prev) => `${prev}\nSending verification email to ${user?.email || "unknown"}`);
      await sendVerificationEmail();
      setDebugInfo((prev) => `${prev}\nVerification email sent successfully`);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      setDebugInfo((prev) => `${prev}\nFailed to send verification email: ${error.message || JSON.stringify(error)}`);
      setError(getErrorMessage(error));
    } finally {
      setTimeout(() => {
        setIsResending(false);
      }, 5000);
    }
  };

  const handleVerifyEmail = async (code = verificationCode) => {
    try {
      setIsLoading(true);
      setDebugInfo((prev) => `${prev}\nVerifying email with code: ${code}`);
      await verifyEmail(code);
      setDebugInfo((prev) => `${prev}\nEmail verification successful`);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Failed to verify email:", error);
      setDebugInfo((prev) => `${prev}\nVerification failed: ${error.message || JSON.stringify(error)}`);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSendVerificationEmail();
  }, []);

  return (
    <div className={styles.verifyMail}>
      <div className={styles.verifyMail__title}>{translate("auth.verify_your_email")}</div>

      <div className={styles.verifyMail__message}>
        {translate("auth.verification_code_sent", { email: user?.email || "" })}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            className={styles.verifyMail__error}
            initial={{ opacity: 0, y: -20, height: 0, margin: 0, padding: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto", margin: "0.5em 0", padding: "0.8em" }}
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

      <div className={styles.verifyMail__form}>
        <input
          className={styles.verifyMail__input}
          type="text"
          placeholder="000000"
          value={verificationCode}
          onChange={handleCodeChange}
          maxLength={6}
          disabled={isLoading}
        />

        <button
          className={styles.verifyMail__resend}
          onClick={handleSendVerificationEmail}
          disabled={isLoading || isResending}
        >
          {isResending ? translate("auth.sending_code") : translate("auth.resend_code")}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!digitsFilled && (
          <motion.div
            className={styles.verifyMail__hint}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
          >
            {translate("auth.enter_6_digit_code")}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerifyMail;
