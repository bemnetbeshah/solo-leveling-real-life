import { useState } from "react";

function App() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedQuests, setCompletedQuests] = useState({});

  const quests = [
    { id: 1, text: "🧠 Read 30 mins", xp: 20 },
    { id: 2, text: "🏋️ Workout", xp: 25 },
    { id: 3, text: "📈 Study coding 1hr", xp: 30 },
    { id: 4, text: "🤝 Network with 1 person", xp: 25 },
  ];

  const handleQuestComplete = (id, questXP) => {
    if (completedQuests[id]) return; // Already completed

    const newXp = xp + questXP;
    const newLevel = level + Math.floor(newXp / 100);
    const remainingXp = newXp % 100;

    setXp(remainingXp);
    setLevel(newLevel);
    setCompletedQuests({ ...completedQuests, [id]: true });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* XP Bar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold">Level {level}</span>
          <span className="text-sm text-gray-400">{xp} XP</span>
        </div>
        <div className="w-full bg-gray-700 h-3 rounded">
          <div
            className="bg-green-400 h-3 rounded transition-all duration-300"
            style={{ width: `${(xp / 100) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Quests Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quests for Today</h2>
        <ul className="space-y-3">
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

        <button className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold">
          + Add Custom Quest
        </button>
      </div>
    </div>
  );
}

export default App;
