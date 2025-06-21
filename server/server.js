require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");

const authRouter = require('./routes/authRoutes');

const questRouter = require('./routes/questRoutes');

const reflectionRouter = require('./routes/reflectionRoutes');

const moodRouter = require('./routes/moodRoutes');

const sparkPointsRouter = require('./routes/sparkPointsRoutes');

const rewardRouter = require('./routes/rewardRoutes');

const userProfileRouter = require('./routes/userProfileRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://solo-sparks-phi.vercel.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Solo Sparks Backend is Running");
});

//Routes
app.use('/auth',authRouter);
app.use('/quests', questRouter);
app.use('/reflections', reflectionRouter);
app.use('/moods', moodRouter);
app.use('/spark-points',sparkPointsRouter);
app.use('/rewards', rewardRouter);
app.use('/user-profile',userProfileRouter);


const start = async () => {
  try {
    console.log("ENV MONGO_URL:", process.env.MONGO_URL);
    await connectDB(process.env.MONGO_URL); 
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Connection failed:", error);
  }
};


start();
