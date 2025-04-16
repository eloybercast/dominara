import React, { useState, useEffect } from "react";
import styles from "./VerifyMail.module.scss";
import { sendVerificationEmail, verifyEmail } from "../../../../../../services/backend/auth.service";
import { translate, getErrorMessage } from "../../../../../../utils/i18n";
import useAuthStore from "../../../../../../stores/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const VerifyMail = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [digitsFilled, setDigitsFilled] = useState(false);
  const [error, setError] = useState("");

  const handleCodeChange = (e) => {
    const code = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setVerificationCode(code);
    setDigitsFilled(code.length === 6);

    // Automatically verify when 6 digits are entered
    if (code.length === 6) {
      handleVerifyEmail(code);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (isResending) return;

    try {
      setIsResending(true);
      await sendVerificationEmail();
    } catch (error) {
      console.error("Failed to send verification email:", error);
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
      await verifyEmail(code);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Failed to verify email:", error);
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
