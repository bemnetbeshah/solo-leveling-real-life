import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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

  // Always fetch goals on every mount and on page re-enter
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setHabitGoals(data.habitGoals || []);
          setMaterialGoals(data.materialGoals || []);
        }
        setUserId(user.uid);
        setLoadingGoals(false);
      } else {
        setUserId(null);
        setHabitGoals([]);
        setMaterialGoals([]);
        setLoadingGoals(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("User ID is:", userId); // Debug log to verify userId exists
  }, [userId]);

  // Only call saveGoals after goals change, not on every render
  const saveGoals = async (newHabitGoals, newMaterialGoals) => {
    if (!userId) return;
    const ref = doc(db, "users", userId);
    await updateDoc(ref, {
      habitGoals: newHabitGoals,
      materialGoals: newMaterialGoals
    });
  };

  const addHabitGoal = () => {
    if (!newHabitGoal.trim()) {
      setHabitGoalError("You didn't write anything");
      return;
    }
    setHabitGoalError("");
    const updated = [...habitGoals, { id: Date.now().toString(), text: newHabitGoal, frequency: "daily", active: true }];
    setHabitGoals(updated);
    setNewHabitGoal("");
    saveGoals(updated, materialGoals);
  };

  const addMaterialGoal = () => {
    if (!newMaterialGoal.trim()) {
      setMaterialGoalError("You didn't write anything");
      return;
    }
    setMaterialGoalError("");
    const updated = [...materialGoals, { id: Date.now().toString(), text: newMaterialGoal, deadline }];
    setMaterialGoals(updated);
    setNewMaterialGoal("");
    setDeadline("");
    saveGoals(habitGoals, updated);
  };

  // Delete a habit goal
  const deleteHabitGoal = (id) => {
    const updated = habitGoals.filter((goal) => goal.id !== id);
    setHabitGoals(updated);
    saveGoals(updated, materialGoals);
  };

  // Delete a material goal
  const deleteMaterialGoal = (id) => {
    const updated = materialGoals.filter((goal) => goal.id !== id);
    setMaterialGoals(updated);
    saveGoals(habitGoals, updated);
  };

  if (loadingGoals) return <p className="text-center text-gray-400 py-10">Loading goals...</p>;

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="mb-4 flex justify-start">
        <Link
          to="/"
          className="text-blue-400 underline hover:text-blue-300 text-base sm:text-lg font-semibold"
        >
          ← Back to Main UI
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Goal Management</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Habit Goals</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newHabitGoal}
            onChange={(e) => setNewHabitGoal(e.target.value)}
            placeholder="e.g. Study every day"
            className="bg-gray-800 p-2 rounded w-full"
          />
          <button onClick={addHabitGoal} className="bg-blue-600 px-4 rounded">Add</button>
        </div>
        {habitGoalError && <div className="text-red-400 mb-2 text-sm">{habitGoalError}</div>}
        <ul className="space-y-2">
          {habitGoals.map((goal) => (
            <li key={goal.id} className="bg-gray-800 p-3 rounded flex justify-between items-center">
              <span>{goal.text}</span>
              <button
                onClick={() => deleteHabitGoal(goal.id)}
                className="ml-2 text-red-400 hover:text-red-600 text-lg font-bold px-2"
                title="Delete Habit Goal"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Material Goals</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newMaterialGoal}
            onChange={(e) => setNewMaterialGoal(e.target.value)}
            placeholder="e.g. Get a 4.0 GPA"
            className="bg-gray-800 p-2 rounded w-full"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="bg-gray-800 p-2 rounded"
          />
          <button onClick={addMaterialGoal} className="bg-green-600 px-4 rounded">Add</button>
        </div>
        {materialGoalError && <div className="text-red-400 mb-2 text-sm">{materialGoalError}</div>}
        <ul className="space-y-2">
          {materialGoals.map((goal) => (
            <li key={goal.id} className="bg-gray-800 p-3 rounded flex justify-between items-center">
              <span>
                {goal.text} <span className="text-sm text-gray-400">(by {goal.deadline})</span>
              </span>
              <button
                onClick={() => deleteMaterialGoal(goal.id)}
                className="ml-2 text-red-400 hover:text-red-600 text-lg font-bold px-2"
                title="Delete Material Goal"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
