const UserProfile = require('../models/UserProfile');


const SUGGESTIONS = {
  reflective: [
    { title: "Reflect & Write", description: "Write down 3 things you learned today.", type: "journal" }
  ],
  curious: [
    { title: "Try Something New", description: "Explore a new skill for 20 minutes.", type: "learning" }
  ],
  validation: [
    { title: "Ask for Feedback", description: "Get someone's opinion on something you did.", type: "social" }
  ],
  peace: [
    { title: "Quiet Time", description: "Spend 10 minutes alone without your phone.", type: "mindfulness" }
  ],
  happy: [
    { title: "Celebrate Wins", description: "Write down 3 things you're proud of today.", type: "reflection" }
  ],
  sad: [
    { title: "Do Something You Enjoy", description: "Watch a movie or eat your favorite food.", type: "self-care" }
  ]
};

const recommendQuests = async (req, res) => {
  try {
    
    const profile = await UserProfile.findOne({ userId: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    
    const keywords = [];

    if (profile.personalityTraits) {
      keywords.push(...profile.personalityTraits);
    }

    if (profile.emotionalNeeds) {
      keywords.push(...profile.emotionalNeeds);
    }

    const moodList = profile.moodPatterns;
    if (moodList.length > 0) {
      const latestMood = moodList[moodList.length - 1].mood;
      keywords.push(latestMood);
    }

    
    const pastTypes = profile.pastQuestTypes || [];
    const seenTypes = new Set(pastTypes);

    const recommendations = [];

    keywords.forEach(keyword => {
      const quests = SUGGESTIONS[keyword];
      if (quests) {
        quests.forEach(quest => {
          if (!seenTypes.has(quest.type)) {
            recommendations.push(quest);
          }
        });
      }
    });

    res.status(200).json({
      message: 'Recommended quests',
      recommendations
    });

  } catch (err) {
    res.status(500).json({ message: 'Error generating recommendations', error: err.message });
  }
};

module.exports = { recommendQuests };
