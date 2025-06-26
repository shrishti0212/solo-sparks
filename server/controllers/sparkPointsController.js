const SparkPoints = require('../models/SparkPoints');

const getMySparkPoints = async (req, res) => {
  try {
    const userId = req.user.userId;

    const sparkData = await SparkPoints.findOne({ userId });

    if (!sparkData) {
      return res.status(200).json({
        totalPoints: 0,
        history: [],
        message: 'No Spark Points record found for this user.',
      });
    }

    res.status(200).json({
      totalPoints: sparkData.totalPoints,
      history: sparkData.history,
    });
  } catch (error) {
    console.error('Error fetching Spark Points:', error);
    res.status(500).json({ message: 'Failed to fetch Spark Points', error: error.message });
  }
};

module.exports = {
  getMySparkPoints,
};
