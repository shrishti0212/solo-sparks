const User=require('../models/User');
const SparkPoints = require('../models/SparkPoints')

const register= async(req,res) =>{
    const {name,email,password} = req.body;

    const user = await User.create({name,email,password});

    const token = user.createJWT();

    await SparkPoints.create({
      userId: user._id,
      totalPoints: 10,
      history: [{
        type: 'bonus',
        points: 10,
        description: 'Welcome bonus for registering!',
      }],
    })

    res.status(201).json({
        message : 'User registered',
        user:{
            _id: user._id,
            name : user.name,
            email: user.email,
        },
        token,
    }
)
}

const login = async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({msg: 'Invalid credentials'});
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        return res.status(400).json({msg : 'Invalid Credentials'});
    }

    const token = user.createJWT();

    res.status(200).json({
        msg: 'Login successful',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
    },
    token,
});
};

module.exports = {register, login};