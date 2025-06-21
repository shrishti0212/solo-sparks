
const SparkPoints = require('../models/SparkPoints');

const getUserPoints = async (req, res) => {
  const userPoints = await SparkPoints.findOne({ userId: req.user.userId });
 
  if (!userPoints) {
    return res.status(200).json({ totalPoints: 0, history: [] });
  }

  res.status(200).json({
    totalPoints: userPoints.totalPoints,
    history: userPoints.history,
  });
};

module.exports = { getUserPoints };
