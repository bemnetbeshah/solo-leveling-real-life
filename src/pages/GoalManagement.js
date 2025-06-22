import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { loadUserData, saveUserData } from "../firestoreHelpers";
import { Link } from "react-router-dom";

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
  };

  const deleteHabitGoal = async (id) => {
    const updated = habitGoals.filter((goal) => goal.id !== id);
    setHabitGoals(updated);
    await saveGoals(updated, materialGoals);
  };

  const deleteMaterialGoal = async (id) => {
    const updated = materialGoals.filter((goal) => goal.id !== id);
    setMaterialGoals(updated);
    await saveGoals(habitGoals, updated);
  };

  const saveGoals = async (newHabitGoals, newMaterialGoals) => {
    if (!userId) return;
    await saveUserData(userId, {
      habitGoals: newHabitGoals,
      materialGoals: newMaterialGoals
    });
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
            <li key={goal.id} className="bg-gray-800 p-2 sm:p-3 rounded flex justify-between items-center">
              <span className="text-sm sm:text-base pr-2 break-words flex-1">{goal.text}</span>
              <button
                onClick={() => deleteHabitGoal(goal.id)}
                className="ml-2 text-red-400 hover:text-red-600 text-lg sm:text-xl font-bold px-1 sm:px-2 py-1 transition-colors flex-shrink-0"
                title="Delete Habit Goal"
              >
                ×
              </button>
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
            <li key={goal.id} className="bg-gray-800 p-2 sm:p-3 rounded flex justify-between items-start sm:items-center">
              <div className="flex-1 pr-2">
                <span className="text-sm sm:text-base break-words block">{goal.text}</span>
                <span className="text-xs sm:text-sm text-gray-400 block mt-1">
                  (by {goal.deadline})
                </span>
              </div>
              <button
                onClick={() => deleteMaterialGoal(goal.id)}
                className="ml-2 text-red-400 hover:text-red-600 text-lg sm:text-xl font-bold px-1 sm:px-2 py-1 transition-colors flex-shrink-0"
                title="Delete Material Goal"
              >
                ×
              </button>
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
