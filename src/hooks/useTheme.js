import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

// Theme color definitions
const themeColors = {
  red: {
    primary: '#EF4444',
    secondary: '#DC2626',
    glow: 'rgba(239, 68, 68, 0.5)',
    glowHover: 'rgba(239, 68, 68, 0.8)',
    border: 'rgba(239, 68, 68, 0.3)',
    borderHover: 'rgba(239, 68, 68, 0.5)'
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#2563EB',
    glow: 'rgba(59, 130, 246, 0.5)',
    glowHover: 'rgba(59, 130, 246, 0.8)',
    border: 'rgba(59, 130, 246, 0.3)',
    borderHover: 'rgba(59, 130, 246, 0.5)'
  },
  yellow: {
    primary: '#EAB308',
    secondary: '#D97706',
    glow: 'rgba(234, 179, 8, 0.5)',
    glowHover: 'rgba(234, 179, 8, 0.8)',
    border: 'rgba(234, 179, 8, 0.3)',
    borderHover: 'rgba(234, 179, 8, 0.5)'
  },
  green: {
    primary: '#22C55E',
    secondary: '#16A34A',
    glow: 'rgba(34, 197, 94, 0.5)',
    glowHover: 'rgba(34, 197, 94, 0.8)',
    border: 'rgba(34, 197, 94, 0.3)',
    borderHover: 'rgba(34, 197, 94, 0.5)'
  },
  orange: {
    primary: '#F97316',
    secondary: '#EA580C',
    glow: 'rgba(249, 115, 22, 0.5)',
    glowHover: 'rgba(249, 115, 22, 0.8)',
    border: 'rgba(249, 115, 22, 0.3)',
    borderHover: 'rgba(249, 115, 22, 0.5)'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    glow: 'rgba(139, 92, 246, 0.5)',
    glowHover: 'rgba(139, 92, 246, 0.8)',
    border: 'rgba(139, 92, 246, 0.3)',
    borderHover: 'rgba(139, 92, 246, 0.5)'
  },
  brown: {
    primary: '#A0522D',
    secondary: '#8B4513',
    glow: 'rgba(160, 82, 45, 0.5)',
    glowHover: 'rgba(160, 82, 45, 0.8)',
    border: 'rgba(160, 82, 45, 0.3)',
    borderHover: 'rgba(160, 82, 45, 0.5)'
  },
  gray: {
    primary: '#6B7280',
    secondary: '#4B5563',
    glow: 'rgba(107, 114, 128, 0.5)',
    glowHover: 'rgba(107, 114, 128, 0.8)',
    border: 'rgba(107, 114, 128, 0.3)',
    borderHover: 'rgba(107, 114, 128, 0.5)'
  },
  'light-gray': {
    primary: '#D1D5DB',
    secondary: '#9CA3AF',
    glow: 'rgba(209, 213, 219, 0.5)',
    glowHover: 'rgba(209, 213, 219, 0.8)',
    border: 'rgba(209, 213, 219, 0.3)',
    borderHover: 'rgba(209, 213, 219, 0.5)'
  },
  'dark-gray': {
    primary: '#374151',
    secondary: '#1F2937',
    glow: 'rgba(55, 65, 81, 0.5)',
    glowHover: 'rgba(55, 65, 81, 0.8)',
    border: 'rgba(55, 65, 81, 0.3)',
    borderHover: 'rgba(55, 65, 81, 0.5)'
  }
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true; // Default to dark mode
  });

  const [themeColor, setThemeColor] = useState(() => {
    const saved = localStorage.getItem('themeColor');
    return saved || 'purple'; // Default to purple
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
    
    // Apply theme color CSS custom properties
    const colors = themeColors[themeColor] || themeColors.purple;
    const root = document.documentElement;
    
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-glow', colors.glow);
    root.style.setProperty('--theme-glow-hover', colors.glowHover);
    root.style.setProperty('--theme-border', colors.border);
    root.style.setProperty('--theme-border-hover', colors.borderHover);
  }, [themeColor]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeThemeColor = (color) => {
    setThemeColor(color);
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      themeColor, 
      changeThemeColor,
      themeColors 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 