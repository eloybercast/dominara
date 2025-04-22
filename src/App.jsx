import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Updates from "./pages/Updates/Updates";
import Auth from "./pages/Auth/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { clearAllCaches } from "./stores";
import { getCurrent } from "@tauri-apps/plugin-deep-link";
import useAuthStore from "./stores/auth";

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    clearAllCaches();

    initializeAuth();

    getCurrent().catch((err) => {
      console.error("App: Failed to check initial deep links:", err);
    });
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Updates />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
