import { useState, useEffect } from "react";
import {
  Sword,
  Calendar,
  Star,
  Cog,
  Plus,
  Sun,
  Moon,
  User,
} from "lucide-react";

export default function App() {
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

  const [newQuestText, setNewQuestText] = useState("");
  const [newQuestXP, setNewQuestXP] = useState("");
  const [theme, setTheme] = useState("dark");

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
    const xpValue = parseInt(newQuestXP, 10);
    if (isNaN(xpValue) || xpValue <= 0) return;
    const newQuest = { id, text: newQuestText, xp: xpValue };
    setQuests([...quests, newQuest]);
    setNewQuestText("");
    setNewQuestXP("");
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className={"min-h-screen flex font-sans " + (theme === "dark" ? "bg-black" : "bg-white")}> 

      {/* Sidebar */}
      <aside className="w-16 bg-[#111] flex flex-col items-center py-6 space-y-6">
        <button className="relative group">
          <Sword className="w-6 h-6" />
          <span className="absolute inset-0 rounded-full group-hover:ring-2 group-hover:ring-green-500" />
        </button>
        <Calendar className="w-6 h-6 opacity-70" />
        <Star className="w-6 h-6 opacity-70" />
        <Cog className="w-6 h-6 opacity-70" />
        <Plus className="w-6 h-6 opacity-70" />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col text-white">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#1a1a1a]">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">Solo Leveling: Real Life</h1>
            <nav className="hidden md:flex gap-4 text-sm">
              <button className="hover:text-green-400">Quests</button>
              <button className="hover:text-purple-400">Stats</button>
              <button className="hover:text-blue-400">Progress</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-gray-800 p-1 rounded text-sm">
              <option>Today</option>
              <option>Week</option>
            </select>
            <User className="w-6 h-6" />
            <button onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-y-auto divide-x divide-gray-800">
          {/* Left column */}
          <section className="flex-1 p-6 space-y-6">
            {/* XP & Level */}
            <div className="bg-[#111] rounded-lg p-4 shadow-lg">
              <h2 className="text-lg font-bold mb-2">LEVEL {level}</h2>
              <div className="w-full bg-gray-700 h-3 rounded mb-3">
                <div
                  className="bg-green-500 h-3 rounded transition-all"
                  style={{ width: `${(xp / 100) * 100}%` }}
                />
              </div>
              <div className="flex justify-around text-sm">
                <div className="flex flex-col items-center">
                  <Sword className="w-4 h-4 mb-1" />
                  <span>STR 5</span>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-4 h-4 mb-1" />
                  <span>INT 5</span>
                </div>
                <div className="flex flex-col items-center">
                  <User className="w-4 h-4 mb-1" />
                  <span>CHA 5</span>
                </div>
              </div>
            </div>

            {/* Daily Quests */}
            <div className="bg-[#111] rounded-lg p-4 shadow-lg">
              <h2 className="text-lg font-bold mb-4">QUESTS FOR TODAY</h2>
              <ul className="space-y-3 mb-4">
                {quests.map((q) => (
                  <li key={q.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={completedQuests[q.id] || false}
                      onChange={() => handleQuestComplete(q.id, q.xp)}
                      className="accent-green-500"
                    />
                    <span className={completedQuests[q.id] ? "line-through opacity-50" : ""}>{q.text}</span>
                    <span className="ml-auto text-xs text-gray-400">{q.xp} XP</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Quest name"
                  value={newQuestText}
                  onChange={(e) => setNewQuestText(e.target.value)}
                  className="w-full p-2 bg-gray-800 rounded"
                />
                <input
                  type="number"
                  placeholder="XP"
                  value={newQuestXP}
                  onChange={(e) => setNewQuestXP(e.target.value)}
                  className="w-full p-2 bg-gray-800 rounded"
                />
                <button onClick={handleAddQuest} className="w-full py-1 bg-blue-600 rounded hover:bg-blue-700">
                  + Add Custom Quest
                </button>
              </div>
            </div>

            {/* Weekly Boss */}
            <div className="bg-[#111] rounded-lg p-4 shadow-lg">
              <h2 className="text-lg font-bold mb-2">WEEKLY BOSS</h2>
              <div className="w-full bg-gray-700 h-3 rounded mb-3">
                <div className="bg-red-500 h-3 rounded" style={{ width: "65%" }} />
              </div>
              <ul className="text-sm list-disc pl-5 space-y-1 mb-2">
                <li>Complete 5 Quests</li>
                <li>Log 2 Journals</li>
              </ul>
              <div className="text-xs text-gray-400">Rewards: 200 XP, Title, +2 STR</div>
            </div>
          </section>

          {/* Right column */}
          <section className="flex-1 p-6 space-y-6">
            <div className="bg-[#111] rounded-lg p-4 shadow-lg h-48 flex items-center justify-center">
              <span className="text-gray-400">Progress chart coming soon...</span>
            </div>
            <div className="bg-[#111] rounded-lg p-4 shadow-lg h-48 flex items-center justify-center">
              <span className="text-gray-400">Path tracker coming soon...</span>
            </div>
            <div className="bg-[#111] rounded-lg p-4 shadow-lg h-32 flex items-center justify-center text-center">
              <p className="text-sm italic">"Stay consistent and you will level up."<br/>Current Title: The Consistent One</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
