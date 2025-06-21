// src/Router.js
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./Login";
import Register from "./Register";
import App from "./App";
import GoalManagement from "./pages/GoalManagement";

export default function RouterComponent() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out, object = logged in

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe(); // prevent memory leak on unmount
  }, []);

  if (user === undefined) {
    return <div>Loading...</div>; // Add your custom spinner or loader here
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <App /> : <Navigate to="/login" />} />
        <Route path="/goals" element={user ? <GoalManagement /> : <Navigate to="/login" />} />
        {/* Optional: 404 route */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}
