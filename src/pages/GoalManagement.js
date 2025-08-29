import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { loadUserData, saveUserData } from "../firestoreHelpers";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Sparkles, Loader2, Plus, ArrowLeft } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { Toaster } from "react-hot-toast";

// Fallback quests function (temporary until we fix AI)
function getFallbackQuests(goalText, goalType = "habit") {
  const quests = [];
  
  if (goalType === "habit") {
    quests.push(
      { id: Date.now() + 1, text: `Complete: ${goalText}`, xp: 25, stats: { mindset: 2 } },
      { id: Date.now() + 2, text: `Track progress for: ${goalText}`, xp: 15, stats: { education: 1 } }
    );
  } else {
    quests.push(
      { id: Date.now() + 1, text: `Research: ${goalText}`, xp: 30, stats: { education: 3 } },
      { id: Date.now() + 2, text: `Plan steps for: ${goalText}`, xp: 20, stats: { mindset: 2 } },
      { id: Date.now() + 3, text: `Take first step toward: ${goalText}`, xp: 25, stats: { healthWellness: 1 } }
    );
  }
  
  return quests;
}

export default function GoalManagement() {
  const { isDarkMode } = useTheme();
  const [habitGoals, setHabitGoals] = useState([]);
  const [materialGoals, setMaterialGoals] = useState([]);
  const [newHabitGoal, setNewHabitGoal] = useState("");
  const [newMaterialGoal, setNewMaterialGoal] = useState("");
  const [habitGoalError, setHabitGoalError] = useState("");
  const [materialGoalError, setMaterialGoalError] = useState("");
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [generatingQuests, setGeneratingQuests] = useState({});

  useEffect(() => {
    const fetchGoals = async (uid) => {
      try {
        const data = await loadUserData(uid);
        if (data) {
          setHabitGoals(data.habitGoals || []);
          setMaterialGoals(data.materialGoals || []);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
        toast.error("Failed to load goals");
      } finally {
        setLoadingGoals(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchGoals(user.uid);
      } else {
        setLoadingGoals(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const addHabitGoal = async () => {
    if (!newHabitGoal.trim()) {
      setHabitGoalError("Please enter a goal");
      return;
    }
    setHabitGoalError("");

    const newGoal = { id: Date.now(), text: newHabitGoal.trim() };
    const updatedGoals = [...habitGoals, newGoal];
    setHabitGoals(updatedGoals);
    setNewHabitGoal("");

    try {
      await saveGoals(updatedGoals, materialGoals);
      toast.success("Habit goal added!");
    } catch (error) {
      console.error("Error saving habit goal:", error);
      toast.error("Failed to save goal");
    }
  };

  const addMaterialGoal = async () => {
    if (!newMaterialGoal.trim()) {
      setMaterialGoalError("Please enter a goal");
      return;
    }
    setMaterialGoalError("");

    const newGoal = { id: Date.now(), text: newMaterialGoal.trim() };
    const updatedGoals = [...materialGoals, newGoal];
    setMaterialGoals(updatedGoals);
    setNewMaterialGoal("");

    try {
      await saveGoals(habitGoals, updatedGoals);
      toast.success("Material goal added!");
    } catch (error) {
      console.error("Error saving material goal:", error);
      toast.error("Failed to save goal");
    }
  };

  const deleteHabitGoal = async (id) => {
    const updatedGoals = habitGoals.filter(goal => goal.id !== id);
    setHabitGoals(updatedGoals);
    try {
      await saveGoals(updatedGoals, materialGoals);
      toast.success("Goal deleted!");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  const deleteMaterialGoal = async (id) => {
    const updatedGoals = materialGoals.filter(goal => goal.id !== id);
    setMaterialGoals(updatedGoals);
    try {
      await saveGoals(habitGoals, updatedGoals);
      toast.success("Goal deleted!");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  const saveGoals = async (newHabitGoals, newMaterialGoals) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    
    const data = await loadUserData(user.uid);
    await saveUserData(user.uid, {
      ...data,
      habitGoals: newHabitGoals,
      materialGoals: newMaterialGoals,
    });
  };

  const generateQuestsFromGoal = async (goal, goalType) => {
    setGeneratingQuests(prev => ({ ...prev, [goal.id]: true }));
    
    try {
      // For now, use fallback quests
      const quests = getFallbackQuests(goal.text, goalType);
      
      // Add quests to the main quest list (you'll need to implement this)
      console.log("Generated quests:", quests);
      toast.success(`Generated ${quests.length} quests from "${goal.text}"`);
      
    } catch (error) {
      console.error("Error generating quests:", error);
      toast.error("Failed to generate quests. Please try again.");
    } finally {
      setGeneratingQuests(prev => ({ ...prev, [goal.id]: false }));
    }
  };

  if (loadingGoals) {
    return (
      <div className="min-h-screen bg-theme-base flex items-center justify-center">
        <div className="glass-panel p-8 flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-theme-primary font-medium">Loading goals...</span>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="p-2 glass-card rounded-lg hover:neon-glow transition-all duration-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-glow">Goal Management</h1>
            <p className="text-theme-secondary">Track your progress</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
        {/* Habit Goals Section */}
        <div className="glass-panel p-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-theme-accent text-glow flex items-center gap-2">
            <Sparkles className="text-theme-accent" size={22} /> Habit Goals
          </h2>
          
          {/* Add Habit Goal Form */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newHabitGoal}
              onChange={(e) => setNewHabitGoal(e.target.value)}
              placeholder="e.g. Study every day"
              className="glass-card p-3 rounded-lg text-theme-primary placeholder-theme-muted focus:outline-none focus:neon-border transition-all duration-300 w-full hover:scale-[1.01]"
              onKeyPress={(e) => e.key === 'Enter' && addHabitGoal()}
            />
            <button 
              onClick={addHabitGoal} 
              className="bg-gradient-theme hover:shadow-theme-glow-hover rounded-lg font-bold text-white px-4 py-3 transition-all duration-300 neon-glow hover:scale-[1.02]"
            >
              Add
            </button>
          </div>
          
          {/* Error Message */}
          {habitGoalError && (
            <div className="text-red-400 mb-2 text-xs sm:text-sm">{habitGoalError}</div>
          )}
          
          {/* Habit Goals List */}
          <div className="space-y-3">
            {habitGoals.map((goal) => (
              <div key={goal.id} className="glass-card p-4 flex items-center justify-between gap-3 transition-all duration-300 hover:scale-[1.02]">
                <span className="font-medium text-theme-primary">{goal.text}</span>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => generateQuestsFromGoal(goal, "habit")}
                    className="px-3 py-1 bg-theme-accent/20 hover:bg-theme-accent/40 text-theme-accent rounded-lg font-semibold transition-all duration-300 neon-glow flex items-center gap-1"
                    disabled={generatingQuests[goal.id]}
                  >
                    {generatingQuests[goal.id] ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    <span>Quests</span>
                  </button>
                  <button
                    onClick={() => deleteHabitGoal(goal.id)}
                    className="px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg font-semibold transition-all duration-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Material Goals Section */}
        <div className="glass-panel p-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-theme-accent text-glow flex items-center gap-2">
            <Sparkles className="text-theme-accent" size={22} /> Material Goals
          </h2>
          
          {/* Add Material Goal Form */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newMaterialGoal}
              onChange={(e) => setNewMaterialGoal(e.target.value)}
              placeholder="e.g. Buy a new laptop"
              className="glass-card p-3 rounded-lg text-theme-primary placeholder-theme-muted focus:outline-none focus:neon-border transition-all duration-300 w-full hover:scale-[1.01]"
              onKeyPress={(e) => e.key === 'Enter' && addMaterialGoal()}
            />
            <button 
              onClick={addMaterialGoal} 
              className="bg-gradient-theme hover:shadow-theme-glow-hover rounded-lg font-bold text-white px-4 py-3 transition-all duration-300 neon-glow hover:scale-[1.02]"
            >
              Add
            </button>
          </div>
          
          {/* Error Message */}
          {materialGoalError && (
            <div className="text-red-400 mb-2 text-xs sm:text-sm">{materialGoalError}</div>
          )}
          
          {/* Material Goals List */}
          <div className="space-y-3">
            {materialGoals.map((goal) => (
              <div key={goal.id} className="glass-card p-4 flex items-center justify-between gap-3 transition-all duration-300 hover:scale-[1.02]">
                <span className="font-medium text-theme-primary">{goal.text}</span>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => generateQuestsFromGoal(goal, "material")}
                    className="px-3 py-1 bg-theme-accent/20 hover:bg-theme-accent/40 text-theme-accent rounded-lg font-semibold transition-all duration-300 neon-glow flex items-center gap-1"
                    disabled={generatingQuests[goal.id]}
                  >
                    {generatingQuests[goal.id] ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    <span>Quests</span>
                  </button>
                  <button
                    onClick={() => deleteMaterialGoal(goal.id)}
                    className="px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg font-semibold transition-all duration-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
