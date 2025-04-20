import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/auth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userDataStr = params.get("user");

    if (token && userDataStr) {
      try {
        // Store the token and user data
        localStorage.setItem("token", token);

        // Parse and store user data
        const userData = JSON.parse(userDataStr);
        localStorage.setItem("user", userDataStr);

        // Update auth store
        login(userData);

        // Navigate to home page
        navigate("/");
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/auth?error=invalid_response");
      }
    } else {
      // No token or user data provided, redirect to auth page
      navigate("/auth?error=authentication_failed");
    }
  }, [location, login, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Authentication in progress...</h2>
      <p>Please wait while we complete the authentication process.</p>
    </div>
  );
};

export default AuthCallback;
