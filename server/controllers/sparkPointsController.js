const SparkPoints = require('../models/SparkPoints')

const getMySparkPoints = async(req,res) =>{

    const userId = req.user.userId;

    const sparkData = await SparkPoints.findOne({userId});

    if(!sparkData) {   
        return res.status(404).json({msg:'No Spark Points record found for this user. '})
    }

    res.status(200).json({
        totalPoints: sparkData.totalPoints,
        history: sparkData.history,
    });
}

module.exports = {
    getMySparkPoints
};