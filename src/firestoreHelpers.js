// src/firestoreHelpers.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Default structure for a new user
const defaultUserData = {
  xp: 0,
  level: 1,
  stats: {
    mindset: 0,
    healthAndWellness: 0,
    charisma: 0,
    education: 0,
    spirituality: 0,
  },
  quests: [
    { id: 1, text: "🧠 Read 30 mins", xp: 20, stats: { mindset: 1, healthAndWellness: 2 } },
    { id: 2, text: "🏋️ Workout", xp: 25, stats: { mindset: 1, healthAndWellness: 2 } },
    { id: 3, text: "📈 Study coding 1hr", xp: 30, stats: { mindset: 1, healthAndWellness: 2 } },
    { id: 4, text: "🤝 Network with 1 person", xp: 25, stats: { mindset: 1, healthAndWellness: 2 } },
  ],
  completedQuests: {},
  habitGoals: [],
  materialGoals: []
};

// Save user data (merges with existing document to preserve other fields)
export async function saveUserData(uid, data) {
  try {
    // Only keep new keys in stats before saving
    const allowedKeys = ["mindset", "healthAndWellness", "charisma", "education", "spirituality"];
    const cleanStats = Object.fromEntries(
      Object.entries(data.stats || {}).filter(([key]) => allowedKeys.includes(key))
    );
    const cleanData = { ...data, stats: cleanStats };
    console.log("Saving data for user:", uid, cleanData); // ✅ TEMPORARY LOG
    await setDoc(doc(db, "users", uid), cleanData, { merge: true });
  } catch (err) {
    console.error("Error saving user data:", err);
  }
}

// Update partial data (e.g., just stats or xp)
export async function updateUserData(uid, updates) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
}

// Add quests to user's quest list
export async function addQuestToFirestore(quest, userId) {
  try {
    const userRef = doc(db, "users", userId);
    
    // Get current user data to ensure quests array exists
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentQuests = userData.quests || [];
      
      // Add the new quest to the existing quests array
      const updatedQuests = [...currentQuests, quest];
      
      // Update the quests field
      await updateDoc(userRef, {
        quests: updatedQuests
      });
      
      console.log("Quest added successfully:", quest);
      return true;
    } else {
      console.error("User document not found");
      return false;
    }
  } catch (error) {
    console.error("Error adding quest to Firestore:", error);
    return false;
  }
}

// Add multiple quests at once
export async function addMultipleQuestsToFirestore(quests, userId) {
  try {
    const userRef = doc(db, "users", userId);
    
    // Get current user data
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentQuests = userData.quests || [];
      
      // Add all new quests to the existing quests array
      const updatedQuests = [...currentQuests, ...quests];
      
      // Update the quests field
      await updateDoc(userRef, {
        quests: updatedQuests
      });
      
      console.log(`${quests.length} quests added successfully`);
      return true;
    } else {
      console.error("User document not found");
      return false;
    }
  } catch (error) {
    console.error("Error adding multiple quests to Firestore:", error);
    return false;
  }
}

// Load user data, or initialize it if it doesn't exist
export async function loadUserData(uid) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    // Ensure goal fields exist for existing users
    const updatedData = {
      ...data,
      habitGoals: data.habitGoals || [],
      materialGoals: data.materialGoals || []
    };
    
    // If we had to add missing fields, save the updated data
    if (!data.habitGoals || !data.materialGoals) {
      await setDoc(userRef, updatedData, { merge: true });
    }
    
    return updatedData;
  } else {
    // Create a new document with default data
    await setDoc(userRef, defaultUserData);
    return defaultUserData;
  }
}
