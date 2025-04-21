import React, { useState, useEffect } from "react";
import styles from "./Auth.module.scss";
import AuthForm from "./components/AuthForm/AuthForm";

const Auth = () => {
  const [consoleError, setConsoleError] = useState(null);

  // Capturar errores de consola
  useEffect(() => {
    const originalConsoleError = console.error;

    console.error = (...args) => {
      // Guardar el error para mostrarlo
      setConsoleError(args.join(" "));
      // Mantener la funcionalidad original
      originalConsoleError.apply(console, args);
    };

    return () => {
      // Restaurar console.error original al desmontar
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <main className={styles.auth}>
      {consoleError && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            padding: "10px",
            backgroundColor: "rgba(255,0,0,0.7)",
            color: "white",
            zIndex: 9999,
            fontFamily: "monospace",
            fontSize: "12px",
            maxHeight: "30vh",
            overflow: "auto",
          }}
        >
          <p>Error: {consoleError}</p>
        </div>
      )}
      <section className={styles.auth__left}>
        <AuthForm />
      </section>
      <section className={styles.auth__right}></section>
    </main>
  );
};

export default Auth;
