import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/auth";
import { authHandlerService } from "../../services/tauri";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  useEffect(() => {
    console.log("AuthCallback: Processing auth callback");

    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userDataStr = params.get("user");

    if (token && userDataStr) {
      try {
        console.log("AuthCallback: Token and user data found");

        // Store the token and user data
        localStorage.setItem("token", token);

        // Parse and store user data
        const userData = JSON.parse(userDataStr);
        localStorage.setItem("user", userDataStr);

        // Update auth store
        login(userData);

        console.log("AuthCallback: Successfully logged in, navigating to home");

        // Navigate to home page
        navigate("/");
      } catch (error) {
        console.error("AuthCallback: Error parsing user data:", error);
        navigate("/auth?error=invalid_response");
      }
    } else {
      console.error("AuthCallback: No token or user data provided");
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
