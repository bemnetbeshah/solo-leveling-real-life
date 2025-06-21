import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { loadUserData, saveUserData } from "./firestoreHelpers";

// AttributeCircle component for circular attribute display
function AttributeCircle({ icon, label, value, color }) {
  // Responsive: detect if screen width is less than 640px (Tailwind's sm breakpoint)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set values based on screen size
  const radius = isMobile ? 20 : 32;
  const stroke = isMobile ? 4 : 6;
  const fontSize = isMobile ? 12 : 18;
  const percent = Math.max(0, Math.min(100, value));
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center mx-1 sm:mx-2" style={{ minWidth: isMobile ? 48 : 72 }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#2d3748"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: 'stroke-dashoffset 0.5s' }}
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dy=".3em"
          fontSize={fontSize}
          fill="#fff"
        >
          {percent}
        </text>
      </svg>
      <span className={isMobile ? "text-lg mt-1" : "text-2xl mt-1"} title={label}>{icon}</span>
      <span className={isMobile ? "capitalize text-xs mt-1 text-gray-300" : "capitalize text-sm mt-1 text-gray-300"}>{label}</span>
    </div>
  );
}

// Main App component for the Solo Leveling Real Life app
function App() {
  // Helper function to load data from localStorage or use a default value
  const load = (key, defaultValue) =>
    JSON.parse(localStorage.getItem(key)) ?? defaultValue;

  // State for experience points (XP)
  const [xp, setXp] = useState(() => load("xp", 0));
  // State for user level
  const [level, setLevel] = useState(() => load("level", 1));
  // State for completed quests (object with quest IDs as keys)
  const [completedQuests, setCompletedQuests] = useState(() => load("completedQuests", {}));
  // State for the list of quests
  const [quests, setQuests] = useState(() =>
    load("quests", [
      // Default quests
      { id: 1, text: "🧠 Read 30 mins", xp: 20, stats: { mindfulness: 2 } },
      { id: 2, text: "🏋️ Workout", xp: 25, stats: { strength: 3, discipline: 1 } },
      { id: 3, text: "📈 Study coding 1hr", xp: 30, stats: { discipline: 3 } },
      { id: 4, text: "🤝 Network with 1 person", xp: 25, stats: { charisma: 2 } },
    ])
  );

  const [user, setUser] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true); // show spinner until data loads
  // Remove lastLoginDate state
  // const [lastLoginDate, setLastLoginDate] = useState(() => load("lastLoginDate", ""));


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setUserEmail(firebaseUser.email);
        const data = await loadUserData(firebaseUser.uid);
        if (data) {
          setXp(data.xp ?? 0);
          setLevel(data.level ?? 1);
          setStats(data.stats ?? {
            spiritual: 0,
            mindfulness: 0,
            charisma: 0,
            strength: 0,
            discipline: 0,
          });
          setQuests(data.quests ?? []);
          // --- Daily Quest Reset Logic ---
          const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
          if (data.lastLoginDate !== today) {
            setCompletedQuests({});
            // Save the reset to Firestore with updated lastLoginDate
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

  // State for user stats (attributes)
  const [stats, setStats] = useState(() =>
    JSON.parse(localStorage.getItem("stats")) ?? {
      spiritual: 0,
      mindfulness: 0,
      charisma: 0,
      strength: 0,
      discipline: 0,
    }
  );
  // State for user email
  const [userEmail, setUserEmail] = useState("");
  // State for new custom quest input (text and XP)
  const [newQuestText, setNewQuestText] = useState("");
  const [newQuestXP, setNewQuestXP] = useState("");

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

  // Handler for completing or uncompleting a quest
  const handleQuestComplete = (id, questXP) => {
    const isCompleted = completedQuests[id];

    if (isCompleted) {
      // If quest is already completed, uncheck it: subtract XP and stats, possibly drop a level
      let newXp = xp - questXP;
      let newLevel = level;

      // If XP goes below 0, level down (unless already at level 1)
      if (newXp < 0 && level > 1) {
        newLevel -= 1;
        newXp = 100 + newXp; // Carry over negative XP to previous level
      } else if (newXp < 0) {
        newXp = 0; // If at level 1, cap XP at 0
      }

      setXp(newXp);
      setLevel(newLevel);

      // Remove quest from completedQuests
      const updated = { ...completedQuests };
      delete updated[id];

      // Subtract quest stats from user stats
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
      // If quest is not completed, check it: add XP and stats, possibly level up
      const totalXP = xp + questXP;
      const newLevel = level + Math.floor(totalXP / 100); // Level up for every 100 XP
      const remainingXP = totalXP % 100; // Remainder XP after leveling up

      setXp(remainingXP);
      setLevel(newLevel);
      setCompletedQuests({ ...completedQuests, [id]: true });

      // Add quest stats to user stats
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

  // Handler for adding a new custom quest
  const handleAddQuest = () => {
    if (!newQuestText || !newQuestXP) return; // Require both fields

    const id = quests.length + 1;
    const xpValue = parseInt(newQuestXP);

    if (isNaN(xpValue) || xpValue <= 0) return; // XP must be a positive number

    const newQuest = {
      id,
      text: newQuestText,
      xp: xpValue,
    };
    setQuests([...quests, newQuest]); // Add new quest to list
    setNewQuestText(""); // Reset input
    setNewQuestXP("");
  };

  // Handler for user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      alert("Logout failed");
    }
  };

  // Render the main UI
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col items-end mb-4">
        {userEmail && (
          <span className="text-xs text-gray-300 mb-1 px-2 py-1 bg-gray-800 rounded font-mono select-all">
            {userEmail}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded font-semibold shadow transition-colors"
        >
          Logout
        </button>
      </div>

      {/* XP Bar section */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold">Level {level}</span>
          <span className="text-sm text-gray-400">{xp} XP</span>
        </div>
        <div className="w-full bg-gray-700 h-3 rounded">
          <div
            className="bg-green-400 h-3 rounded transition-all duration-300"
            style={{ width: `${(xp / 100) * 100}%` }} // XP progress bar
          ></div>
        </div>
      </div>

      {/* Attributes section */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Your Attributes</h2>
        <div className="flex flex-row justify-center items-center overflow-x-auto">
          <AttributeCircle icon="🧘" label="spiritual" value={stats.spiritual} color="#a78bfa" />
          <AttributeCircle icon="🧠" label="mindfulness" value={stats.mindfulness} color="#34d399" />
          <AttributeCircle icon="💬" label="charisma" value={stats.charisma} color="#fbbf24" />
          <AttributeCircle icon="💪" label="strength" value={stats.strength} color="#60a5fa" />
          <AttributeCircle icon="🔥" label="discipline" value={stats.discipline} color="#f87171" />
        </div>
      </div>

      {/* Quest List section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quests for Today</h2>
        <ul className="space-y-3 mb-6">
          {quests.map((quest) => (
            <li key={quest.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={completedQuests[quest.id] || false}
                onChange={() => handleQuestComplete(quest.id, quest.xp)}
                className="accent-green-500"
              />
              <span className={completedQuests[quest.id] ? "line-through text-gray-400" : ""}>
                {quest.text}
              </span>
              <span className="text-xs text-gray-400 ml-auto">{quest.xp} XP</span>
            </li>
          ))}
        </ul>

        {/* Add Custom Quest section */}
        <div className="bg-gray-800 p-4 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Quest name (e.g., Meditate 10 mins)"
            value={newQuestText}
            onChange={(e) => setNewQuestText(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white placeholder-gray-400"
          />
          <input
            type="number"
            placeholder="XP amount"
            value={newQuestXP}
            onChange={(e) => setNewQuestXP(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white placeholder-gray-400"
          />
          <button
            onClick={handleAddQuest}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            + Add Custom Quest
          </button>
        </div>
      </div>
    </div>
  );
}

// Export the App component as default
export default App;
