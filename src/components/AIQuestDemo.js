import { useState } from 'react';
import { getQuestSuggestions, getFallbackQuests } from '../openaiHelpers';
import { toast } from 'react-hot-toast';
import { Sparkles, Loader2, Play } from 'lucide-react';

export default function AIQuestDemo() {
  const [demoGoal, setDemoGoal] = useState('Study every day');
  const [generatedQuests, setGeneratedQuests] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [goalType, setGoalType] = useState('habit');

  const generateDemoQuests = async () => {
    if (!demoGoal.trim()) {
      toast.error('Please enter a goal');
      return;
    }

    setIsGenerating(true);
    setGeneratedQuests([]);

    try {
      // Try AI generation first
      let quests = await getQuestSuggestions(demoGoal, goalType);
      
      // Fallback if AI fails
      if (!quests || quests.length === 0) {
        console.log('Using fallback quests for demo');
        const fallbackQuests = getFallbackQuests(demoGoal, goalType);
        quests = fallbackQuests.map((quest, index) => ({
          id: Date.now() + index,
          text: quest.text,
          xp: quest.xp,
          stats: quest.stats,
          aiGenerated: false,
          sourceGoal: demoGoal
        }));
      }

      setGeneratedQuests(quests);
      toast.success(`Generated ${quests.length} quests!`);
    } catch (error) {
      console.error('Demo generation error:', error);
      toast.error('Failed to generate quests. Using fallback.');
      
      // Use fallback quests
      const fallbackQuests = getFallbackQuests(demoGoal, goalType);
      const quests = fallbackQuests.map((quest, index) => ({
        id: Date.now() + index,
        text: quest.text,
        xp: quest.xp,
        stats: quest.stats,
        aiGenerated: false,
        sourceGoal: demoGoal
      }));
      setGeneratedQuests(quests);
    } finally {
      setIsGenerating(false);
    }
  };

  const getAttributeColor = (attribute) => {
    const colors = {
      education: 'text-red-400',
      charisma: 'text-yellow-400',
      healthAndWellness: 'text-blue-400',
      spirituality: 'text-purple-400',
      mindset: 'text-green-400'
    };
    return colors[attribute] || 'text-gray-400';
  };

  const getAttributeIcon = (attribute) => {
    const icons = {
      education: '📚',
      charisma: '💬',
      healthAndWellness: '🏃‍♂️',
      spirituality: '🧘',
      mindset: '🧠'
    };
    return icons[attribute] || '📊';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">🤖 AI Quest Generator Demo</h2>
      
      {/* Demo Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Goal Type
          </label>
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white"
          >
            <option value="habit">Habit Goal</option>
            <option value="material">Material Goal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Goal Text
          </label>
          <input
            type="text"
            value={demoGoal}
            onChange={(e) => setDemoGoal(e.target.value)}
            placeholder="e.g., Study every day"
            className="w-full p-2 bg-gray-700 rounded text-white placeholder-gray-400"
          />
        </div>
        
        <button
          onClick={generateDemoQuests}
          disabled={isGenerating}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Generating Quests...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate AI Quests
            </>
          )}
        </button>
      </div>

      {/* Generated Quests */}
      {generatedQuests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Generated Quests for "{demoGoal}"
          </h3>
          <div className="space-y-3">
            {generatedQuests.map((quest, index) => (
              <div key={quest.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{quest.text}</h4>
                  <span className="text-green-400 font-semibold">{quest.xp} XP</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {Object.entries(quest.stats).map(([attribute, value]) => (
                    <span
                      key={attribute}
                      className={`${getAttributeColor(attribute)} text-sm flex items-center gap-1`}
                    >
                      <span>{getAttributeIcon(attribute)}</span>
                      <span className="capitalize">{attribute}</span>
                      <span className="text-xs">+{value}</span>
                    </span>
                  ))}
                </div>
                
                {quest.aiGenerated && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-purple-400">
                    <Sparkles size={12} />
                    AI Generated
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h4 className="font-semibold text-white mb-2">How it works:</h4>
        <ol className="text-sm text-gray-300 space-y-1">
          <li>1. Enter a goal (habit or material)</li>
          <li>2. Click "Generate AI Quests"</li>
          <li>3. AI analyzes your goal and suggests 3 daily quests</li>
          <li>4. Each quest includes XP value and targeted attributes</li>
          <li>5. Use these quests in your main app to level up!</li>
        </ol>
      </div>
    </div>
  );
} 