import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Updates from "./pages/Updates/Updates";
import Auth from "./pages/Auth/Auth";
import AuthCallback from "./pages/AuthCallback/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import { clearAllCaches } from "./stores";
import { deepLinkService, authHandlerService } from "./services/tauri";

const App = () => {
  useEffect(() => {
    // Clear caches
    clearAllCaches();

    // Initialize deep link service
    console.log("App: Initializing deep link service");
    deepLinkService.init().catch((error) => {
      console.error("App: Failed to initialize deep link service", error);
    });

    // Initialize auth handler service
    console.log("App: Initializing auth handler service");
    authHandlerService.init();

    // Cleanup on unmount (though this shouldn't happen for the main App component)
    return () => {
      console.log("App: Cleaning up deep link service");
      deepLinkService.cleanup();
      authHandlerService.cleanup();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/home" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Updates />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
