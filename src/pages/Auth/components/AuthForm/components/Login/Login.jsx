import React, { useState } from "react";
import styles from "./Login.module.scss";
import googleIcon from "../../../../../../assets/icons/google.svg";
import playIcon from "../../../../../../assets/icons/play.svg";
import useAuthStore from "../../../../../../stores/auth";
import { login } from "../../../../../../services/backend/auth.service";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../../../../utils/i18n";

const Login = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, login: loginStore } = useAuthStore();
  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <form className={styles.login} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.login__error}>
          <span>{error}</span>
        </div>
      )}

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
        <button className={styles.login__buttons__google} type="button" disabled={isLoading}>
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
