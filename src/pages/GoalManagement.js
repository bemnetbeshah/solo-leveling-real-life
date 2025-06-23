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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400 text-sm sm:text-base">Loading goals...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-4 md:p-6">
      {/* Back Navigation */}
      <div className="mb-3 sm:mb-4 flex justify-start">
        <Link
          to="/"
          className="text-blue-400 underline hover:text-blue-300 text-sm sm:text-base font-semibold flex items-center gap-1"
        >
          <span className="text-lg">←</span>
          <span className="hidden sm:inline">Back to Main UI</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      {/* Main Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Goal Management</h1>

      {/* Habit Goals Section */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">Habit Goals</h2>
        
        {/* Add Habit Goal Form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
          <input
            type="text"
            value={newHabitGoal}
            onChange={(e) => setNewHabitGoal(e.target.value)}
            placeholder="e.g. Study every day"
            className="bg-gray-800 p-2 sm:p-3 rounded text-sm sm:text-base w-full"
            onKeyPress={(e) => e.key === 'Enter' && addHabitGoal()}
          />
          <button 
            onClick={addHabitGoal} 
            className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base font-medium transition-colors whitespace-nowrap"
          >
            Add
          </button>
        </div>
        
        {/* Error Message */}
        {habitGoalError && (
          <div className="text-red-400 mb-2 text-xs sm:text-sm">{habitGoalError}</div>
        )}
        
        {/* Habit Goals List */}
        <ul className="space-y-2 sm:space-y-3">
          {habitGoals.map((goal) => (
            <li key={goal.id} className="bg-gray-800 p-2 sm:p-3 rounded">
              <div className="flex justify-between items-start sm:items-center">
                <span className="text-sm sm:text-base pr-2 break-words flex-1">{goal.text}</span>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => generateQuestsFromGoal(goal, "habit")}
                    disabled={generatingQuests[goal.id]}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0"
                    title="Generate AI quests for this goal"
                  >
                    {generatingQuests[goal.id] ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    <span className="hidden sm:inline">Generate Quests</span>
                    <span className="sm:hidden">AI</span>
                  </button>
                  <button
                    onClick={() => deleteHabitGoal(goal.id)}
                    className="text-red-400 hover:text-red-600 text-lg sm:text-xl font-bold px-1 sm:px-2 py-1 transition-colors flex-shrink-0"
                    title="Delete Habit Goal"
                  >
                    ×
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {/* Empty State */}
        {habitGoals.length === 0 && (
          <p className="text-gray-400 text-sm sm:text-base text-center py-4">
            No habit goals yet. Add your first one above!
          </p>
        )}
      </section>

      {/* Material Goals Section */}
      <section>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">Material Goals</h2>
        
        {/* Add Material Goal Form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
          <input
            type="text"
            value={newMaterialGoal}
            onChange={(e) => setNewMaterialGoal(e.target.value)}
            placeholder="e.g. Get a 4.0 GPA"
            className="bg-gray-800 p-2 sm:p-3 rounded text-sm sm:text-base w-full"
            onKeyPress={(e) => e.key === 'Enter' && addMaterialGoal()}
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="bg-gray-800 p-2 sm:p-3 rounded text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
          />
          <button 
            onClick={addMaterialGoal} 
            className="bg-green-600 hover:bg-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base font-medium transition-colors whitespace-nowrap"
          >
            Add
          </button>
        </div>
        
        {/* Error Message */}
        {materialGoalError && (
          <div className="text-red-400 mb-2 text-xs sm:text-sm">{materialGoalError}</div>
        )}
        
        {/* Material Goals List */}
        <ul className="space-y-2 sm:space-y-3">
          {materialGoals.map((goal) => (
            <li key={goal.id} className="bg-gray-800 p-2 sm:p-3 rounded">
              <div className="flex justify-between items-start sm:items-center">
                <div className="flex-1 pr-2">
                  <span className="text-sm sm:text-base break-words block">{goal.text}</span>
                  <span className="text-xs sm:text-sm text-gray-400 block mt-1">
                    (by {goal.deadline})
                  </span>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => generateQuestsFromGoal(goal, "material")}
                    disabled={generatingQuests[goal.id]}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0"
                    title="Generate AI quests for this goal"
                  >
                    {generatingQuests[goal.id] ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    <span className="hidden sm:inline">Generate Quests</span>
                    <span className="sm:hidden">AI</span>
                  </button>
                  <button
                    onClick={() => deleteMaterialGoal(goal.id)}
                    className="text-red-400 hover:text-red-600 text-lg sm:text-xl font-bold px-1 sm:px-2 py-1 transition-colors flex-shrink-0"
                    title="Delete Material Goal"
                  >
                    ×
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {/* Empty State */}
        {materialGoals.length === 0 && (
          <p className="text-gray-400 text-sm sm:text-base text-center py-4">
            No material goals yet. Add your first one above!
          </p>
        )}
      </section>
    </div>
  );
}
