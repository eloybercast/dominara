import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Updates from "./pages/Updates/Updates";
import Auth from "./pages/Auth/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { clearAllCaches } from "./stores";

const App = () => {
  useEffect(() => {
    clearAllCaches();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/updates" element={<Updates />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
