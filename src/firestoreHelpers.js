// src/firestoreHelpers.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Default structure for a new user
const defaultUserData = {
  xp: 0,
  level: 1,
  stats: {
    spiritual: 0,
    mindfulness: 0,
    charisma: 0,
    strength: 0,
    discipline: 0,
  },
  quests: [
    { id: 1, text: "🧠 Read 30 mins", xp: 20, stats: { mindfulness: 2 } },
    { id: 2, text: "🏋️ Workout", xp: 25, stats: { strength: 3, discipline: 1 } },
    { id: 3, text: "📈 Study coding 1hr", xp: 30, stats: { discipline: 3 } },
    { id: 4, text: "🤝 Network with 1 person", xp: 25, stats: { charisma: 2 } },
  ],
  completedQuests: {}
};

// Save user data (overwrites entire document)
export async function saveUserData(uid, data) {
  try {
    console.log("Saving data for user:", uid, data); // ✅ TEMPORARY LOG
    await setDoc(doc(db, "users", uid), data);
  } catch (err) {
    console.error("Error saving user data:", err);
  }
}

// Update partial data (e.g., just stats or xp)
export async function updateUserData(uid, updates) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
}

// Load user data, or initialize it if it doesn't exist
export async function loadUserData(uid) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    // Create a new document with default data
    await setDoc(userRef, defaultUserData);
    return defaultUserData;
  }
}
