import React, { useEffect } from "react";
import styles from "./Auth.module.scss";
import AuthForm from "./components/AuthForm/AuthForm";
import { resizeAndCenterWindow } from "../../utils/tauri/windowUtils";

const Auth = () => {
  useEffect(() => {
    resizeAndCenterWindow(1200, 800).catch(err => {
      console.error("Failed to resize window:", err);
    });
  }, []);

  return (
    <main className={styles.auth}>
      <section className={styles.auth__left}>
        <AuthForm />
      </section>
      <section className={styles.auth__right}></section>
    </main>
  );
};

export default Auth;
