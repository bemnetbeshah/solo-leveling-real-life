import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { loadUserData, saveUserData, addMultipleQuestsToFirestore } from "../firestoreHelpers";
// import { getQuestSuggestions, getFallbackQuests } from "../openaiHelpers";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";

// Fallback quests function (temporary until we fix AI)
function getFallbackQuests(goalText, goalType = "habit") {
  const fallbackQuests = {
    habit: [
      { text: `Set aside 30 minutes for ${goalText}`, xp: 20, stats: { discipline: 2 } },
      { text: `Create a checklist for ${goalText}`, xp: 15, stats: { mindfulness: 1 } },
      { text: `Track progress on ${goalText}`, xp: 25, stats: { discipline: 3 } }
    ],
    material: [
      { text: `Research best practices for ${goalText}`, xp: 30, stats: { discipline: 2 } },
      { text: `Create a plan to achieve ${goalText}`, xp: 25, stats: { mindfulness: 2 } },
      { text: `Set milestones for ${goalText}`, xp: 20, stats: { discipline: 1 } }
    ]
  };

  return fallbackQuests[goalType] || fallbackQuests.habit;
}

export default function GoalManagement() {
  const [habitGoals, setHabitGoals] = useState([]);
  const [materialGoals, setMaterialGoals] = useState([]);
  const [newHabitGoal, setNewHabitGoal] = useState("");
  const [newMaterialGoal, setNewMaterialGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [userId, setUserId] = useState(null);
  const [habitGoalError, setHabitGoalError] = useState("");
  const [materialGoalError, setMaterialGoalError] = useState("");
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [generatingQuests, setGeneratingQuests] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchGoals(user.uid);
      } else {
        setUserId(null);
        setHabitGoals([]);
        setMaterialGoals([]);
        setLoadingGoals(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchGoals = async (uid) => {
    try {
      const userData = await loadUserData(uid);
      setHabitGoals(userData.habitGoals || []);
      setMaterialGoals(userData.materialGoals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
    setLoadingGoals(false);
  };

  const addHabitGoal = async () => {
    if (!newHabitGoal.trim()) {
      setHabitGoalError("You didn't write anything");
      return;
    }
    setHabitGoalError("");
    const updated = [...habitGoals, { id: Date.now().toString(), text: newHabitGoal, frequency: "daily", active: true }];
    setHabitGoals(updated);
    await saveGoals(updated, materialGoals);
    setNewHabitGoal("");
    toast.success("Habit goal added successfully!");
  };

  const addMaterialGoal = async () => {
    if (!newMaterialGoal.trim()) {
      setMaterialGoalError("You didn't write anything");
      return;
    }
    setMaterialGoalError("");
    const updated = [...materialGoals, { id: Date.now().toString(), text: newMaterialGoal, deadline }];
    setMaterialGoals(updated);
    await saveGoals(habitGoals, updated);
    setNewMaterialGoal("");
    setDeadline("");
    toast.success("Material goal added successfully!");
  };

  const deleteHabitGoal = async (id) => {
    const updated = habitGoals.filter((goal) => goal.id !== id);
    setHabitGoals(updated);
    await saveGoals(updated, materialGoals);
    toast.success("Habit goal deleted!");
  };

  const deleteMaterialGoal = async (id) => {
    const updated = materialGoals.filter((goal) => goal.id !== id);
    setMaterialGoals(updated);
    await saveGoals(habitGoals, updated);
    toast.success("Material goal deleted!");
  };

  const saveGoals = async (newHabitGoals, newMaterialGoals) => {
    if (!userId) return;
    await saveUserData(userId, {
      habitGoals: newHabitGoals,
      materialGoals: newMaterialGoals
    });
  };

  const generateQuestsFromGoal = async (goal, goalType) => {
    if (!userId) {
      toast.error("Please log in to generate quests");
      return;
    }

    setGeneratingQuests(prev => ({ ...prev, [goal.id]: true }));

    try {
      // Use fallback quests for now (we'll add AI back later)
      console.log("Generating fallback quests for:", goal.text);
      const fallbackQuests = getFallbackQuests(goal.text, goalType);
      const quests = fallbackQuests.map((quest, index) => ({
        id: Date.now() + index,
        text: quest.text,
        xp: quest.xp,
        stats: quest.stats,
        completed: false,
        aiGenerated: false,
        sourceGoal: goal.text
      }));

      // Add quests to Firestore
      const success = await addMultipleQuestsToFirestore(quests, userId);
      
      if (success) {
        toast.success(`Generated ${quests.length} quests from "${goal.text}"!`);
      } else {
        toast.error("Failed to save quests. Please try again.");
      }
    } catch (error) {
      console.error("Error generating quests:", error);
      toast.error("Failed to generate quests. Please try again.");
    } finally {
      setGeneratingQuests(prev => ({ ...prev, [goal.id]: false }));
    }
  };

  if (loadingGoals) return (
    <div className="min-h-screen bg-base-bg flex items-center justify-center">
      <div className="glass-panel p-8 flex flex-col items-center">
        <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-white font-medium">Loading your goals...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-bg text-white p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 bg-gradient-radial from-neon-purple/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-neon-purple/3 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back Navigation */}
      <div className="mb-3 sm:mb-4 flex justify-start">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-lg font-medium hover:neon-glow transition-all duration-300"
        >
          <span className="text-lg">←</span>
          <span className="hidden sm:inline">Back to Main UI</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-glow mb-4 sm:mb-6">Goal Management</h1>

      {/* Habit Goals Section */}
      <section className="mb-8">
        <div className="glass-panel p-6 mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-neon-purple text-glow flex items-center gap-2">
            <Sparkles className="text-neon-purple" size={22} /> Habit Goals
          </h2>
          {/* Add Habit Goal Form */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newHabitGoal}
              onChange={(e) => setNewHabitGoal(e.target.value)}
              placeholder="e.g. Study every day"
              className="glass-card p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:neon-border transition-all duration-300 w-full hover:scale-[1.01]"
              onKeyPress={(e) => e.key === 'Enter' && addHabitGoal()}
            />
            <button 
              onClick={addHabitGoal} 
              className="bg-gradient-to-r from-neon-purple to-purple-600 hover:from-purple-600 hover:to-neon-purple rounded-lg font-bold text-white px-4 py-3 transition-all duration-300 neon-glow hover:scale-[1.02]"
            >
              Add
            </button>
          </div>
          {/* Error Message */}
          {habitGoalError && (
            <div className="text-red-400 mb-2 text-xs sm:text-sm">{habitGoalError}</div>
          )}
          {/* Habit Goals List */}
          <ul className="space-y-3">
            {habitGoals.map((goal) => (
              <li key={goal.id} className="glass-card p-4 flex items-center justify-between gap-3 transition-all duration-300 hover:scale-[1.02]">
                <span className="font-medium text-white">{goal.text}</span>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => generateQuestsFromGoal(goal, "habit")}
                    className="px-3 py-1 bg-neon-purple/20 hover:bg-neon-purple/40 text-neon-purple rounded-lg font-semibold transition-all duration-300 neon-glow flex items-center gap-1"
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
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Material Goals Section */}
      <section className="mb-8">
        <div className="glass-panel p-6 mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
            <Sparkles className="text-blue-400" size={22} /> Material Goals
          </h2>
          {/* Add Material Goal Form */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newMaterialGoal}
              onChange={(e) => setNewMaterialGoal(e.target.value)}
              placeholder="e.g. Buy a new laptop"
              className="glass-card p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:neon-border transition-all duration-300 w-full hover:scale-[1.01]"
              onKeyPress={(e) => e.key === 'Enter' && addMaterialGoal()}
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="glass-card p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:neon-border transition-all duration-300 w-full sm:w-auto hover:scale-[1.01]"
            />
            <button 
              onClick={addMaterialGoal} 
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 rounded-lg font-bold text-white px-4 py-3 transition-all duration-300 neon-glow hover:scale-[1.02]"
            >
              Add
            </button>
          </div>
          {/* Error Message */}
          {materialGoalError && (
            <div className="text-red-400 mb-2 text-xs sm:text-sm">{materialGoalError}</div>
          )}
          {/* Material Goals List */}
          <ul className="space-y-3">
            {materialGoals.map((goal) => (
              <li key={goal.id} className="glass-card p-4 flex items-center justify-between gap-3 transition-all duration-300 hover:scale-[1.02]">
                <span className="font-medium text-white">{goal.text}</span>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">{goal.deadline && `Due: ${goal.deadline}`}</span>
                  <button
                    onClick={() => generateQuestsFromGoal(goal, "material")}
                    className="px-3 py-1 bg-blue-400/20 hover:bg-blue-400/40 text-blue-400 rounded-lg font-semibold transition-all duration-300 hover:shadow-[0_0_10px_rgba(96,165,250,0.5)] flex items-center gap-1"
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
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
