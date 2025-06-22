# 🤖 OpenAI API Setup Guide

## Prerequisites

1. **OpenAI Account**: Sign up at [OpenAI Platform](https://platform.openai.com/)
2. **API Key**: Get your API key from [OpenAI API Keys](https://platform.openai.com/api-keys)

## Environment Setup

1. **Create `.env` file** in your project root:
   ```bash
   # .env
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

2. **Replace `your_openai_api_key_here`** with your actual OpenAI API key

3. **Restart your development server** after adding the environment variable:
   ```bash
   npm start
   ```

## How It Works

### 🎯 Goal-to-Quest Pipeline

1. **User adds a goal** (habit or material)
2. **Clicks "Generate Quests"** button
3. **AI analyzes the goal** and suggests 3 daily quests
4. **Quests are automatically added** to the user's quest list
5. **User can complete quests** to earn XP and improve attributes

### 🔧 AI Prompt Structure

The AI receives a prompt like:
```
The user has a habit goal: "Study every day".

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
```

### 📊 Quest Attributes

The AI targets these attributes:
- **🧘 Spiritual**: Meditation, reflection, personal growth
- **🧠 Mindfulness**: Focus, awareness, mental clarity
- **💬 Charisma**: Social skills, networking, communication
- **💪 Strength**: Physical fitness, endurance, health
- **🔥 Discipline**: Consistency, self-control, habits

## Example Outputs

### For "Study every day" (Habit Goal):
```json
[
  { "text": "Review notes for 1 hour", "xp": 25, "stats": { "discipline": 3 } },
  { "text": "Attend office hours", "xp": 30, "stats": { "charisma": 2 } },
  { "text": "Avoid phone distractions during study", "xp": 20, "stats": { "discipline": 2 } }
]
```

### For "Get a 4.0 GPA" (Material Goal):
```json
[
  { "text": "Complete all homework before deadline", "xp": 35, "stats": { "discipline": 4 } },
  { "text": "Participate in class discussions", "xp": 25, "stats": { "charisma": 3 } },
  { "text": "Create study schedule for the week", "xp": 20, "stats": { "mindfulness": 2 } }
]
```

## Error Handling

- **API Failures**: Falls back to predefined quest templates
- **Invalid Responses**: Logs errors and shows user-friendly messages
- **Network Issues**: Displays toast notifications for user feedback

## Security Notes

⚠️ **Important**: The OpenAI API key is exposed in the browser. For production:

1. **Use a backend server** to handle OpenAI API calls
2. **Store API key server-side** only
3. **Implement rate limiting** and usage monitoring
4. **Consider API costs** - each generation costs ~$0.002

## Troubleshooting

### Common Issues:

1. **"Failed to generate quests"**
   - Check your API key is correct
   - Verify you have OpenAI API credits
   - Check network connection

2. **"API key not found"**
   - Ensure `.env` file exists in project root
   - Restart development server after adding `.env`
   - Check variable name is `REACT_APP_OPENAI_API_KEY`

3. **"Invalid response format"**
   - AI sometimes returns malformed JSON
   - System falls back to predefined quests
   - Check browser console for details

## Cost Estimation

- **GPT-3.5-turbo**: ~$0.002 per quest generation
- **Typical usage**: 1-5 generations per user per day
- **Monthly cost**: ~$0.06-0.30 per active user

## Future Enhancements

- [ ] Server-side API handling
- [ ] Quest quality scoring
- [ ] User feedback on generated quests
- [ ] Custom quest templates
- [ ] Batch quest generation 