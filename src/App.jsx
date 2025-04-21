import React, { useEffect, useState } from "react";
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
  const [deepLinkError, setDeepLinkError] = useState(null);

  useEffect(() => {
    clearAllCaches();

    initializeAuth();

    getCurrent().catch((err) => {
      console.error("App: Failed to check initial deep links:", err);
      setDeepLinkError(`Deep Link Error: ${err.message || err}`);
    });
  }, [initializeAuth]);

  return (
    <Router>
      {deepLinkError && (
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
          }}
        >
          {deepLinkError}
        </div>
      )}
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
