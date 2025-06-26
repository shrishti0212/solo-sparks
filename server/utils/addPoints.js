const SparkPoints = require('../models/SparkPoints');

const addPoints = async (userId, type, points, description ='')=>{

    const entry = {type,points,description};

    let userPoints = await SparkPoints.findOne({userId});

    if(!userPoints){
        userPoints = await SparkPoints.create({
            userId,
            totalPoints: points,
            history: [entry],
        });
    }
    else{
        userPoints.totalPoints +=points;
        userPoints.history.push(entry);
        await userPoints.save();
    }
};

module.exports = addPoints;