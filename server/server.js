require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");

const authRouter = require('./routes/authRoutes');

const reflectionRouter = require('./routes/reflectionRoutes');

const sparkPointsRouter = require('./routes/sparkPointsRoutes');

const rewardRouter = require('./routes/rewardRoutes');

const userProfileRouter = require('./routes/userProfileRoutes');

const promptRouter = require('./routes/promptsRoutes');

const assignedTaskRouter = require('./routes/assignedTasksRoute')

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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
  methods: ["GET", "POST", "PATCH", "DELETE","PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Solo Sparks Backend is Running");
});

//Routes
app.use('/auth',authRouter);
app.use('/reflections', reflectionRouter);
app.use('/spark-points',sparkPointsRouter);
app.use('/rewards', rewardRouter);
app.use('/user-profile',userProfileRouter);
app.use('/prompts',promptRouter);
app.use('/assignedTask',assignedTaskRouter)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL); 
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Connection failed:", error);
  }
};


start();
