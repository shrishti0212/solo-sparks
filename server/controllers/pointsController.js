const SparkPoints = require('../models/SparkPoints');

const getUserPoints = async (req, res) => {
  try {
    const userPoints = await SparkPoints.findOne({ userId: req.user.userId });

    if (!userPoints) {
      return res.status(200).json({ totalPoints: 0, history: [] });
    }

    res.status(200).json({
      totalPoints: userPoints.totalPoints,
      history: userPoints.history,
    });
  } catch (error) {
    console.error("Error fetching spark points:", error);
    res.status(500).json({ message: "Failed to fetch spark points", error: error.message });
  }
};

module.exports = { getUserPoints };
