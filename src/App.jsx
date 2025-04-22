import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { clearAllCaches } from "./stores";
import { getCurrent } from "@tauri-apps/plugin-deep-link";
import useAuthStore from "./stores/backend/auth";

import Lobby from "./pages/Lobby/Lobby";
import Updates from "./pages/Updates/Updates";
import Auth from "./pages/Auth/Auth";

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
        <Route path="/lobby" element={<Lobby />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Updates />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
