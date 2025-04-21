import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/auth";

/**
 * ProtectedRoute - Redirects to /auth if not authenticated
 * Use this to wrap routes that require authentication
 */
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const navigate = useNavigate();

  useEffect(() => {
    // First try to initialize auth from localStorage
    const authInitialized = initializeAuth();

    // If still not authenticated, redirect to auth page
    if (!authInitialized && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, initializeAuth, navigate]);

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
