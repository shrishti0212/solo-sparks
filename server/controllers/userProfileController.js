const UserProfile = require('../models/UserProfile');



// -------------------- Create or Update Profile --------------------
const createOrUpdateProfile = async (req, res) => {
  const { personalityTraits = [], emotionalNeeds = [] } = req.body;

  try {
    let profile = await UserProfile.findOne({ userId: req.user.userId });

    if (profile) {
      profile.personalityTraits = personalityTraits.length ? personalityTraits : profile.personalityTraits;
      profile.emotionalNeeds = emotionalNeeds.length ? emotionalNeeds : profile.emotionalNeeds;

      await profile.save();
      return res.status(200).json({ message: 'Profile updated', profile });
    }

    profile = await UserProfile.create({
      userId: req.user.userId,
      personalityTraits,
      emotionalNeeds,
    });

    res.status(201).json({ message: 'Profile created', profile });

  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Failed to save profile', error: error.message });
  }
};

// -------------------- Get User Profile --------------------
const getUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

module.exports = {
  createOrUpdateProfile,
  getUserProfile,
};
