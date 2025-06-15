import { useState, useEffect } from "react";

function App() {
  const load = (key, defaultValue) =>
    JSON.parse(localStorage.getItem(key)) ?? defaultValue;

  const [xp, setXp] = useState(() => load("xp", 0));
  const [level, setLevel] = useState(() => load("level", 1));
  const [completedQuests, setCompletedQuests] = useState(() => load("completedQuests", {}));
  const [quests, setQuests] = useState(() =>
    load("quests", [
      { id: 1, text: "🧠 Read 30 mins", xp: 20 },
      { id: 2, text: "🏋️ Workout", xp: 25 },
      { id: 3, text: "📈 Study coding 1hr", xp: 30 },
      { id: 4, text: "🤝 Network with 1 person", xp: 25 },
    ])
);

  useEffect(() => {
    localStorage.setItem("xp", JSON.stringify(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("level", JSON.stringify(level));
  }, [level]);

  useEffect(() => {
    localStorage.setItem("completedQuests", JSON.stringify(completedQuests));
  }, [completedQuests]);

  useEffect(() => {
    localStorage.setItem("quests", JSON.stringify(quests));
  }, [quests]);


  // For custom quest input
  const [newQuestText, setNewQuestText] = useState("");
  const [newQuestXP, setNewQuestXP] = useState("");

  const handleQuestComplete = (id, questXP) => {
    if (completedQuests[id]) return;

    const totalXP = xp + questXP;
    const newLevel = level + Math.floor(totalXP / 100);
    const remainingXP = totalXP % 100;

    setXp(remainingXP);
    setLevel(newLevel);
    setCompletedQuests({ ...completedQuests, [id]: true });
  };

  const handleAddQuest = () => {
    if (!newQuestText || !newQuestXP) return;

    const id = quests.length + 1;
    const xpValue = parseInt(newQuestXP);

    if (isNaN(xpValue) || xpValue <= 0) return;

    const newQuest = {
      id,
      text: newQuestText,
      xp: xpValue,
    };

    setQuests([...quests, newQuest]);
    setNewQuestText("");
    setNewQuestXP("");
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

      {/* Quest List */}
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

        {/* Add Custom Quest */}
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

export default App;
