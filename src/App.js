import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { loadUserData, saveUserData } from "./firestoreHelpers";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Heart, Brain, MessageCircle, Dumbbell, Flame, BookOpen, Settings } from "lucide-react";
import { useTheme } from "./hooks/useTheme";

// Enhanced AttributeCircle component with glassmorphic design
function AttributeCircle({ icon, label, value, color, maxValue = 10 }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const { isDarkMode, themeColor, themeColors } = useTheme();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate progress for the circular progress bar
  const percent = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const radius = 40; // Slightly larger than the button
  const stroke = 3;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  // Function to get display name for attributes
  const getDisplayName = (attrName) => {
    switch (attrName) {
      case 'healthWellness':
        return 'Health & Wellness';
      default:
        return attrName.charAt(0).toUpperCase() + attrName.slice(1);
    }
  };

  // Icon mapping for Lucide React icons
  const getIconComponent = (iconType) => {
    const iconSize = isMobile ? 22 : 28;
    const iconColor = color;
    
    switch (iconType) {
      case 'spirituality':
        return <Heart size={iconSize} color={iconColor} fill={iconColor} />;
      case 'mindset':
        return <Brain size={iconSize} color={iconColor} />;
      case 'charisma':
        return <MessageCircle size={iconSize} color={iconColor} />;
      case 'healthWellness':
        return <Dumbbell size={iconSize} color={iconColor} />;
      case 'education':
        return <BookOpen size={iconSize} color={iconColor} />;
      default:
        return <Heart size={iconSize} color={iconColor} />;
    }
  };

  // Get color variants for the button styling
  const getColorVariants = (attrName) => {
    switch (attrName) {
      case 'mindset':
        return {
          border: isDarkMode ? 'border-green-500/20' : 'border-green-500/30',
          hoverBorder: isDarkMode ? 'hover:border-green-500/50' : 'hover:border-green-500/60',
          hoverShadow: 'hover:shadow-green-500/30',
          hoverBg: isDarkMode ? 'hover:from-green-500/10' : 'hover:from-green-500/20',
          textColor: 'text-green-500',
          hoverTextColor: 'group-hover:text-green-400',
          shimmerColor: 'via-green-400/20',
          progressColor: '#34d399'
        };
      case 'healthWellness':
        return {
          border: isDarkMode ? 'border-blue-500/20' : 'border-blue-500/30',
          hoverBorder: isDarkMode ? 'hover:border-blue-500/50' : 'hover:border-blue-500/60',
          hoverShadow: 'hover:shadow-blue-500/30',
          hoverBg: isDarkMode ? 'hover:from-blue-500/10' : 'hover:from-blue-500/20',
          textColor: 'text-blue-500',
          hoverTextColor: 'group-hover:text-blue-400',
          shimmerColor: 'via-blue-400/20',
          progressColor: '#60a5fa'
        };
      case 'charisma':
        return {
          border: isDarkMode ? 'border-yellow-500/20' : 'border-yellow-500/30',
          hoverBorder: isDarkMode ? 'hover:border-yellow-500/50' : 'hover:border-yellow-500/60',
          hoverShadow: 'hover:shadow-yellow-500/30',
          hoverBg: isDarkMode ? 'hover:from-yellow-500/10' : 'hover:from-yellow-500/20',
          textColor: 'text-yellow-500',
          hoverTextColor: 'group-hover:text-yellow-400',
          shimmerColor: 'via-yellow-400/20',
          progressColor: '#fbbf24'
        };
      case 'education':
        return {
          border: isDarkMode ? 'border-red-500/20' : 'border-red-500/30',
          hoverBorder: isDarkMode ? 'hover:border-red-500/50' : 'hover:border-red-500/60',
          hoverShadow: 'hover:shadow-red-500/30',
          hoverBg: isDarkMode ? 'hover:from-red-500/10' : 'hover:from-red-500/20',
          textColor: 'text-red-500',
          hoverTextColor: 'group-hover:text-red-400',
          shimmerColor: 'via-red-400/20',
          progressColor: '#f87171'
        };
      case 'spirituality':
        return {
          border: isDarkMode ? 'border-purple-500/20' : 'border-purple-500/30',
          hoverBorder: isDarkMode ? 'hover:border-purple-500/50' : 'hover:border-purple-500/60',
          hoverShadow: 'hover:shadow-purple-500/30',
          hoverBg: isDarkMode ? 'hover:from-purple-500/10' : 'hover:from-purple-500/20',
          textColor: 'text-purple-500',
          hoverTextColor: 'group-hover:text-purple-400',
          shimmerColor: 'via-purple-400/20',
          progressColor: '#a78bfa'
        };
      default:
        return {
          border: isDarkMode ? 'border-white/10' : 'border-black/10',
          hoverBorder: isDarkMode ? 'hover:border-white/30' : 'hover:border-black/30',
          hoverShadow: isDarkMode ? 'hover:shadow-white/20' : 'hover:shadow-black/20',
          hoverBg: isDarkMode ? 'hover:from-white/10' : 'hover:from-black/10',
          textColor: isDarkMode ? 'text-white' : 'text-black',
          hoverTextColor: isDarkMode ? 'group-hover:text-white/90' : 'group-hover:text-black/90',
          shimmerColor: isDarkMode ? 'via-white/10' : 'via-black/10',
          progressColor: isDarkMode ? '#ffffff' : '#000000'
        };
    }
  };

  const colorVariants = getColorVariants(label);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 80, height: 80 }}>
        {/* Circular Progress Bar */}
        <svg 
          height={80} 
          width={80} 
          className="absolute top-0 left-0"
          style={{ filter: `drop-shadow(0 0 8px ${colorVariants.progressColor})` }}
        >
          {/* Background circle */}
          <circle
            stroke={isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={colorVariants.progressColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ 
              transition: 'stroke-dashoffset 0.8s ease-in-out'
            }}
          />
        </svg>
        {/* Button, centered absolutely */}
        <button
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 rounded-full backdrop-blur-lg border ${colorVariants.border} ${isDarkMode ? 'bg-gradient-to-tr from-black/60 to-black/40' : 'bg-gradient-to-tr from-white/60 to-white/40'} shadow-lg hover:shadow-2xl ${colorVariants.hoverShadow} hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer ${colorVariants.hoverBorder} hover:bg-gradient-to-tr ${colorVariants.hoverBg} ${isDarkMode ? 'hover:to-black/40' : 'hover:to-white/40'} group overflow-hidden flex items-center justify-center`}
          style={{ width: 56, height: 56 }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent ${colorVariants.shimmerColor} to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out`}
          ></div>
          {getIconComponent(label)}
        </button>
      </div>
      <div className="mt-3 text-center">
        <div className={`text-lg font-bold ${colorVariants.textColor}`}>{value || 0}</div>
        <div className={`text-xs font-medium break-words max-w-[80px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getDisplayName(label)}</div>
      </div>
    </div>
  );
}

// Quest Card component with glassmorphic design
function QuestCard({ quest, isCompleted, onToggle, stats }) {
  const { isDarkMode } = useTheme();

  const getStatIcon = (statName) => {
    const iconSize = 12;
    const colors = {
      spirituality: '#a78bfa',
      mindset: '#34d399', 
      charisma: '#fbbf24',
      healthWellness: '#60a5fa',
      education: '#f87171'
    };
    const color = colors[statName] || '#8E44AD';
    
    switch (statName) {
      case 'spirituality':
        return <Heart size={iconSize} color={color} fill={color} />;
      case 'mindset':
        return <Brain size={iconSize} color={color} />;
      case 'charisma':
        return <MessageCircle size={iconSize} color={color} />;
      case 'healthWellness':
        return <Dumbbell size={iconSize} color={color} />;
      case 'education':
        return <BookOpen size={iconSize} color={color} />;
      default:
        return <Heart size={iconSize} color={color} />;
    }
  };

  // Function to get display name for attributes
  const getDisplayName = (attrName) => {
    switch (attrName) {
      case 'healthWellness':
        return 'Health & Wellness';
      default:
        return attrName.charAt(0).toUpperCase() + attrName.slice(1);
    }
  };

  return (
    <div className={`glass-card p-4 mb-4 transition-all duration-300 hover:scale-[1.02] ${
      isCompleted ? 'opacity-60' : 'neon-glow'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {/* Custom animated gradient checkbox */}
            <label className="relative flex items-center cursor-pointer group">
              <input
                className="peer sr-only"
                type="checkbox"
                checked={isCompleted}
                onChange={() => onToggle(quest.id, quest.xp)}
              />
              <div
                className="w-8 h-8 rounded-lg bg-white border-2 border-theme-accent transition-all duration-300 ease-in-out peer-checked:bg-gradient-theme peer-checked:border-0 peer-checked:rotate-12 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-5 after:h-5 after:opacity-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=')] after:bg-contain after:bg-no-repeat peer-checked:after:opacity-100 after:transition-opacity after:duration-300 shadow-theme-glow-hover"
              ></div>
            </label>
            <span className={`font-medium ${isCompleted ? `line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}` : 'text-theme-primary'}`}>
              {quest.text}
            </span>
          </div>
          
          {/* Stats indicators */}
          {quest.stats && (
            <div className="flex gap-3 mt-2 ml-9">
              {Object.entries(quest.stats).map(([stat, value]) => (
                <div key={stat} className="flex items-center gap-1">
                  {getStatIcon(stat)}
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getDisplayName(stat)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-bold text-theme-accent text-glow">{quest.xp} XP</span>
          {isCompleted && (
            <span className="text-xs text-green-400">✓ Completed</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App component
function App() {
  const { isDarkMode } = useTheme();
  const load = (key, defaultValue) =>
    JSON.parse(localStorage.getItem(key)) ?? defaultValue;

  const [xp, setXp] = useState(() => load("xp", 0));
  const [level, setLevel] = useState(() => load("level", 1));
  const [completedQuests, setCompletedQuests] = useState(() => load("completedQuests", {}));
  const [quests, setQuests] = useState(() =>
    load("quests", [
      { id: 1, text: "🧠 Read 30 mins", xp: 20, stats: { mindset: 2 } },
      { id: 2, text: "🏋️ Workout", xp: 25, stats: { healthWellness: 3, education: 1 } },
      { id: 3, text: "📈 Study coding 1hr", xp: 30, stats: { education: 3 } },
      { id: 4, text: "🤝 Network with 1 person", xp: 25, stats: { charisma: 2 } },
    ])
  );

  const [user, setUser] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [stats, setStats] = useState(() =>
    JSON.parse(localStorage.getItem("stats")) ?? {
      spirituality: 0,
      mindset: 0,
      charisma: 0,
      healthWellness: 0,
      education: 0,
    }
  );
  const [userEmail, setUserEmail] = useState("");
  const [newQuestText, setNewQuestText] = useState("");
  const [newQuestXP, setNewQuestXP] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setUserEmail(firebaseUser.email);
        const data = await loadUserData(firebaseUser.uid);
        if (data) {
          let loadedStats = data.stats ?? {};
          // Map healthAndWellness to healthWellness for frontend use
          if ('healthAndWellness' in loadedStats) {
            loadedStats.healthWellness = loadedStats.healthAndWellness;
          }
          const defaultStats = {
            spirituality: 0,
            mindset: 0,
            charisma: 0,
            healthWellness: 0,
            education: 0,
          };
          setXp(data.xp ?? 0);
          setLevel(data.level ?? 1);
          setStats({ ...defaultStats, ...loadedStats });
          setQuests(data.quests ?? []);
          const today = new Date().toISOString().slice(0, 10);
          if (data.lastLoginDate !== today) {
            setCompletedQuests({});
            saveUserData(firebaseUser.uid, {
              ...data,
              completedQuests: {},
              lastLoginDate: today,
            });
          } else {
            setCompletedQuests(data.completedQuests ?? {});
          }
        }
      } else {
        setUser(null);
        setUserEmail("");
      }
      setLoadingUserData(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !loadingUserData) {
      saveUserData(user.uid, {
        xp,
        level,
        stats,
        quests,
        completedQuests,
        lastLoginDate: new Date().toISOString().slice(0, 10),
      });
    }
  }, [xp, level, stats, quests, completedQuests, user, loadingUserData]);

  const handleQuestComplete = (id, questXP) => {
    const isCompleted = completedQuests[id];

    if (isCompleted) {
      let newXp = xp - questXP;
      let newLevel = level;

      if (newXp < 0 && level > 1) {
        newLevel -= 1;
        newXp = 100 + newXp;
      } else if (newXp < 0) {
        newXp = 0;
      }

      setXp(newXp);
      setLevel(newLevel);

      const updated = { ...completedQuests };
      delete updated[id];

      const quest = quests.find(q => q.id === id);
      if (quest?.stats) {
        const newStats = { ...stats };
        for (const key in quest.stats) {
          newStats[key] = Math.max(0, (newStats[key] || 0) - quest.stats[key]);
        }
        setStats(newStats);
      }

      setCompletedQuests(updated);
    } else {
      const totalXP = xp + questXP;
      const newLevel = level + Math.floor(totalXP / 100);
      const remainingXP = totalXP % 100;

      setXp(remainingXP);
      setLevel(newLevel);
      setCompletedQuests({ ...completedQuests, [id]: true });

      const quest = quests.find(q => q.id === id);
      if (quest?.stats) {
        const newStats = { ...stats };
        for (const key in quest.stats) {
          newStats[key] = (newStats[key] || 0) + quest.stats[key];
        }
        setStats(newStats);
      }
    }
  };

  const handleAddQuest = () => {
    if (!newQuestText || !newQuestXP) return;

    const id = quests.length + 1;
    const xpValue = parseInt(newQuestXP);

    if (isNaN(xpValue) || xpValue <= 0) return;

    const newQuest = {
      id,
      text: newQuestText,
      xp: xpValue,
    };
    setQuests([...quests, newQuest]);
    setNewQuestText("");
    setNewQuestXP("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      alert("Logout failed");
    }
  };

  if (loadingUserData) {
    return (
      <div className={`min-h-screen bg-theme-base flex items-center justify-center`}>
        <div className="glass-panel p-8 flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-theme-primary font-medium">Loading your journey...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-theme-base text-theme-primary p-4 sm:p-6 relative overflow-hidden`}>
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

      {/* Header */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/settings"
              className="p-3 glass-card rounded-lg hover:neon-glow transition-all duration-300 flex items-center gap-2"
            >
              <Settings size={20} className="text-theme-accent" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold text-glow">Solo Leveling</h1>
              <p className="text-theme-secondary">Real Life RPG</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {userEmail && (
              <span className={`text-xs px-3 py-1 glass-card rounded-full font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {userEmail}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg font-medium transition-all duration-300 neon-glow"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/goals"
            className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-lg font-medium hover:neon-glow transition-all duration-300"
          >
            <span className="text-theme-accent">⚡</span>
            Manage Goals
          </Link>
        </div>
      </div>

      {/* Level & XP Section */}
      <div className="glass-panel p-6 mb-6 relative z-10 hover:neon-glow transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-theme rounded-full flex items-center justify-center text-white font-bold text-lg">
              {level}
            </div>
            <div>
              <h2 className="text-xl font-bold">Level {level}</h2>
              <p className="text-theme-secondary">Adventure continues...</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-theme-accent text-glow">{xp}</div>
            <div className="text-theme-secondary">Experience Points</div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="relative">
          <div className={`w-full h-3 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-theme rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(xp / 100) * 100}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-slow"></div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full shadow-theme-glow"></div>
        </div>
      </div>

      {/* Attributes Section */}
      <div className="glass-panel p-6 mb-6 relative z-10 hover:neon-glow transition-all duration-300">
        <h2 className="text-xl font-bold mb-6 text-center">Your Attributes</h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          <AttributeCircle label="mindset" value={stats.mindset} color="#34d399" />
          <AttributeCircle label="healthWellness" value={stats.healthWellness} color="#60a5fa" />
          <AttributeCircle label="charisma" value={stats.charisma} color="#fbbf24" />
          <AttributeCircle label="education" value={stats.education} color="#f87171" />
          <AttributeCircle label="spirituality" value={stats.spirituality} color="#a78bfa" />
        </div>
      </div>

      {/* Quests Section */}
      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-4">Today's Quests</h2>
        
        {/* Quest List */}
        <div className="mb-6">
          {quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isCompleted={completedQuests[quest.id] || false}
              onToggle={handleQuestComplete}
              stats={stats}
            />
          ))}
        </div>

        {/* Add Custom Quest */}
        <div className="glass-panel p-6 hover:neon-glow transition-all duration-300">
          <h3 className="text-lg font-bold mb-4">Create New Quest</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Quest name (e.g., Meditate 10 mins)"
              value={newQuestText}
              onChange={(e) => setNewQuestText(e.target.value)}
              className="w-full p-3 glass-card rounded-lg text-theme-primary placeholder-theme-muted focus:outline-none focus:neon-border transition-all duration-300"
            />
            <input
              type="number"
              placeholder="XP amount"
              value={newQuestXP}
              onChange={(e) => setNewQuestXP(e.target.value)}
              className="w-full p-3 glass-card rounded-lg text-theme-primary placeholder-theme-muted focus:outline-none focus:neon-border transition-all duration-300"
            />
            <button
              onClick={handleAddQuest}
              className="w-full py-3 bg-gradient-theme hover:shadow-theme-glow-hover rounded-lg font-bold text-white transition-all duration-300 neon-glow"
            >
              + Create Quest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
