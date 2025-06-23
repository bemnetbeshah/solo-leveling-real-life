import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Store in .env file
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

export async function getQuestSuggestions(goalText, goalType = "habit") {
  const prompt = `The user has a ${goalType} goal: "${goalText}". 

Suggest 3 specific daily quests that help with this goal. Each quest should be actionable, measurable, and realistic for daily completion.

Requirements:
- Each quest should include an XP value (10-100, higher for more challenging tasks)
- Each quest should target one relevant attribute: Discipline, Charisma, Strength, Spiritual, or Mindfulness
- Quests should be specific and actionable (not vague like "study more")
- Return valid JSON format

Return JSON like this exact format:
[
  { "text": "Review notes for 1 hour", "xp": 25, "stats": { "discipline": 3 } },
  { "text": "Attend office hours", "xp": 30, "stats": { "charisma": 2 } },
  { "text": "Avoid phone distractions during study", "xp": 20, "stats": { "discipline": 2 } }
]

Only return the JSON array, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;

    try {
      const quests = JSON.parse(content);
      
      // Validate and format the quests
      return quests.map((quest, index) => ({
        id: Date.now() + index, // Generate unique ID
        text: quest.text,
        xp: parseInt(quest.xp) || 20,
        stats: quest.stats || { discipline: 1 }, // Default to discipline if no stats provided
        completed: false,
        aiGenerated: true, // Flag to identify AI-generated quests
        sourceGoal: goalText
      }));
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      console.error("Raw response:", content);
      return [];
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate quest suggestions. Please try again.");
  }
}

// Helper function to validate quest format
export function validateQuestFormat(quest) {
  return (
    quest &&
    typeof quest.text === "string" &&
    quest.text.length > 0 &&
    typeof quest.xp === "number" &&
    quest.xp >= 10 &&
    quest.xp <= 100 &&
    quest.stats &&
    typeof quest.stats === "object"
  );
}

// Fallback quests if OpenAI fails
export function getFallbackQuests(goalText, goalType = "habit") {
  const fallbackQuests = {
    habit: [
      { text: `Set aside 30 minutes for ${goalText}`, xp: 20, stats: { discipline: 2 } },
      { text: `Create a checklist for ${goalText}`, xp: 15, stats: { mindfulness: 1 } },
      { text: `Track progress on ${goalText}`, xp: 25, stats: { discipline: 3 } }
    ],
    material: [
      { text: `Research best practices for ${goalText}`, xp: 30, stats: { discipline: 2 } },
      { text: `Create a plan to achieve ${goalText}`, xp: 25, stats: { mindfulness: 2 } },
      { text: `Set milestones for ${goalText}`, xp: 20, stats: { discipline: 1 } }
    ]
  };

  return fallbackQuests[goalType] || fallbackQuests.habit;
} 