import React from "react";
import styles from "./Auth.module.scss";
import AuthForm from "./components/AuthForm/AuthForm";

const Auth = () => {
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
