import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/auth";

/**
 * ProtectedRoute - Redirects to /auth if not authenticated
 * Use this to wrap routes that require authentication
 */
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
