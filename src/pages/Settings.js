import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { 
  User, 
  Palette, 
  Trash2, 
  ArrowLeft,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

// Theme Color Grid Selector Component
function ThemeColorGrid({ selectedColor, onColorSelect }) {
  const { isDarkMode, themeColors } = useTheme();
  
  // Convert theme colors object to array for rendering
  const themeColorArray = Object.entries(themeColors).map(([name, colors]) => ({
    name,
    hex: colors.primary,
    class: name
  }));

  return (
    <div className="flex gap-4 justify-center items-center w-fit">
      {themeColorArray.map((color) => (
        <label
          key={color.name}
          className={`relative w-8 h-8 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 border-2 border-transparent hover:scale-110 ${
            selectedColor === color.name 
              ? 'scale-110 border-2' 
              : ''
          }`}
          style={{
            backgroundColor: color.hex,
            boxShadow: `0 0 0.5em ${color.hex}`,
            borderColor: selectedColor === color.name 
              ? (isDarkMode ? '#ffffff' : '#000000') 
              : 'transparent',
            boxShadow: selectedColor === color.name 
              ? `0 0 1em ${color.hex}, 0 0 0 2px ${isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}` 
              : `0 0 0.5em ${color.hex}`
          }}
        >
          <input
            type="radio"
            name="themeColor"
            value={color.name}
            checked={selectedColor === color.name}
            onChange={() => onColorSelect(color.name)}
            className="sr-only"
          />
          {selectedColor === color.name && (
            <div 
              className="w-2 h-2 rounded-full opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: isDarkMode ? '#ffffff' : '#000000' }}
            ></div>
          )}
        </label>
      ))}
    </div>
  );
}

function Settings() {
  const { isDarkMode, toggleDarkMode, themeColor, changeThemeColor } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showColorGrid, setShowColorGrid] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSettingChange = async (key, value) => {
    if (key === 'darkMode') {
      toggleDarkMode();
      toast.success(`Dark mode ${value ? 'enabled' : 'disabled'}`);
      return;
    }
    
    if (key === 'uiThemeColor') {
      changeThemeColor(value);
      toast.success(`Theme color changed to ${value}`);
      return;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-base flex items-center justify-center">
        <div className="glass-panel p-8 flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-theme-primary font-medium">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-base text-theme-primary p-4 sm:p-6 relative overflow-hidden">
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

      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="p-2 glass-card rounded-lg hover:neon-glow transition-all duration-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-glow">Settings</h1>
            <p className="text-theme-secondary">Customize your experience</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
        <div className="glass-panel p-6 hover:neon-glow transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-theme-accent" size={20} />
            <h2 className="text-xl font-bold">Appearance</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={18} className="text-theme-secondary" /> : <Sun size={18} className="text-theme-secondary" />}
                <span>Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-accent"></div>
              </label>
            </div>

            <div className="relative">
              <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setShowColorGrid(!showColorGrid)}
              >
                <div className="flex items-center gap-3">
                  <Palette size={18} className="text-theme-secondary" />
                  <span className="group-hover:text-theme-accent transition-colors duration-300">UI Theme Color</span>
                  <span className="text-sm text-theme-secondary">({themeColor})</span>
                </div>
                <div className={`transform transition-transform duration-300 ${showColorGrid ? 'rotate-180' : 'rotate-0'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
              
              {/* Color Grid Dropdown */}
              {showColorGrid && (
                <div className="mt-3 pt-3 border-t border-theme-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-theme-secondary">Choose Theme Color:</span>
                    <ThemeColorGrid 
                      selectedColor={themeColor}
                      onColorSelect={(color) => handleSettingChange('uiThemeColor', color)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 border border-red-500/20 hover:neon-glow transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="text-red-500" size={20} />
            <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-theme-secondary text-sm">
              These actions cannot be undone. Please proceed with caution.
            </p>
            
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg font-medium transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 