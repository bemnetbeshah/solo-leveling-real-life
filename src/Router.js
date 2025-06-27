// src/Router.js
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ThemeProvider } from "./hooks/useTheme";

import Login from "./Login";
import Register from "./Register";
import App from "./App";
import GoalManagement from "./pages/GoalManagement";
import Settings from "./pages/Settings";

export default function RouterComponent() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out, object = logged in

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe(); // prevent memory leak on unmount
  }, []);

  if (user === undefined) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-theme-base flex items-center justify-center">
          <div className="glass-panel p-8 flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-theme-primary font-medium">Loading...</span>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <App /> : <Navigate to="/login" />} />
          <Route path="/goals" element={user ? <GoalManagement /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
          {/* Optional: 404 route */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
