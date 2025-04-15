import React, { useState } from "react";
import styles from "./AuthForm.module.scss";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { AnimatePresence, motion } from "framer-motion";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <motion.article className={styles.authForm} initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.2 }}>
      <div className={styles.authForm__header}>{/** Logo */}</div>
      <div className={styles.authForm__content}>
        <AnimatePresence mode="wait" initial={false}>
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              exit={{ x: 20 }}
              transition={{ duration: 0.15 }}
              style={{ width: "100%" }}
            >
              <Login />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              exit={{ x: -20 }}
              transition={{ duration: 0.1 }}
              style={{ width: "100%" }}
            >
              <Register />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className={styles.authForm__toggleContainer}>
        <AnimatePresence mode="wait" initial={false}>
          {isLogin ? (
            <motion.button
              key="register-link"
              className={styles.authForm__toggle}
              onClick={toggleForm}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5,
                opacity: { duration: 0.3 },
              }}
            >
              Need an account? Register
            </motion.button>
          ) : (
            <motion.button
              key="login-link"
              className={styles.authForm__toggle}
              onClick={toggleForm}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5,
                opacity: { duration: 0.3 },
              }}
            >
              Already have an account? Login
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

export default AuthForm;
