import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { Toaster } from "react-hot-toast";

export default function Register() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-base text-theme-primary p-4 sm:p-6 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className={`fixed inset-0 ${isDarkMode ? 'bg-gradient-theme-radial-opacity-05' : 'bg-gradient-theme-radial-opacity-1'} pointer-events-none`}></div>
      <div className={`fixed top-0 right-0 w-96 h-96 ${isDarkMode ? 'bg-theme-accent opacity-20' : 'bg-theme-accent opacity-10'} rounded-full blur-3xl pointer-events-none`}></div>
      <div className={`fixed bottom-0 left-0 w-96 h-96 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/1'} rounded-full blur-3xl pointer-events-none`}></div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            color: isDarkMode ? '#fff' : '#1a1a1a',
            backdropFilter: 'blur(10px)',
            border: `1px solid var(--theme-border)`,
          },
          success: {
            iconTheme: {
              primary: 'var(--theme-primary)',
              secondary: isDarkMode ? '#fff' : '#1a1a1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: isDarkMode ? '#fff' : '#1a1a1a',
            },
          },
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="glass-panel p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-glow mb-2">Solo Leveling</h1>
            <p className="text-theme-secondary">Real Life RPG</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 glass-card rounded-lg text-theme-primary placeholder-theme-muted focus:outline-none focus:neon-border transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 glass-card rounded-lg text-theme-primary placeholder-theme-muted focus:outline-none focus:neon-border transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 glass-card rounded-lg text-theme-primary placeholder-theme-muted focus:outline-none focus:neon-border transition-all duration-300"
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-theme hover:shadow-theme-glow-hover rounded-lg font-bold text-white flex items-center justify-center transition-all duration-300 neon-glow"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Register"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-theme-secondary">
            Already have an account? <Link to="/login" className="text-theme-accent hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
