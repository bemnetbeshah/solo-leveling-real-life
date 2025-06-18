import { useState, useEffect } from "react";

// AttributeCircle component for circular attribute display
function AttributeCircle({ icon, label, value, color }) {
  // Clamp value between 0 and 100
  const percent = Math.max(0, Math.min(100, value));
  const radius = 32;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center mx-2">
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
          fontSize="18"
          fill="#fff"
        >
          {percent}
        </text>
      </svg>
      <span className="text-2xl mt-1" title={label}>{icon}</span>
      <span className="capitalize text-sm mt-1 text-gray-300">{label}</span>
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

  // Persist XP to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("xp", JSON.stringify(xp));
  }, [xp]);

  // Persist level to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("level", JSON.stringify(level));
  }, [level]);

  // Persist completed quests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("completedQuests", JSON.stringify(completedQuests));
  }, [completedQuests]);

  // Persist quests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("quests", JSON.stringify(quests));
  }, [quests]);

  // Persist stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
  }, [stats]);

  // State for new custom quest input (text and XP)
  const [newQuestText, setNewQuestText] = useState("");
  const [newQuestXP, setNewQuestXP] = useState("");

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

  // Render the main UI
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
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
        <div className="flex flex-row justify-center items-center">
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
