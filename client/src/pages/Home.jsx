import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FaPlus, FaTimes, FaMicrophone, FaImage, FaSmile } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [quote, setQuote] = useState("You are your best investment.");
  const [latestQuest, setLatestQuest] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setDate(today.toLocaleDateString("en-US", options));

    // Fetch latest quest
    const fetchQuest = async () => {
      try {
        const res = await API.get("/quests");
        const sorted = res.data.quests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestQuest(sorted[0]);

      } catch (err) {
        console.error("Error fetching latest quest:", err);
      }
    };

    fetchQuest();
  }, []);

  return (
    <div className="min-h-screen bg-[#A18AFF] text-white p-6 relative">
      
      <h2 className="text-xl text-center italic mb-4">“{quote}”</h2>

      
      <h1 className="text-3xl font-bold">Today</h1>
      <p className="mb-6 text-sm text-white/80">{date}</p>

      
      <div
        onClick={() => navigate("/mood-checkin")}
        className="bg-white text-black rounded-xl p-4 mb-6 shadow cursor-pointer"
      >
        <h3 className="text-lg font-semibold">🧠 Daily Check-In</h3>
        <p className="text-sm text-gray-600">Log how you're feeling today</p>
      </div>

      
      {latestQuest && (
        <div
          onClick={() => navigate("/quests")}
          className="bg-white text-black rounded-xl p-4 shadow cursor-pointer"
        >
          <h3 className="text-lg font-semibold">🧩 Your Latest Quest</h3>
          <p className="text-sm mt-1">{latestQuest.title}</p>
        </div>
      )}

      
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          
          {isExpanded && (
            <div className="absolute bottom-16 flex flex-col gap-3 items-center">
              <button
                onClick={() => navigate("/mood-checkin")}
                className="bg-purple-700 text-white p-3 rounded-full shadow-lg"
              >
                <FaSmile />
              </button>
              <button
                onClick={() => navigate("/upload/audio")}
                className="bg-purple-700 text-white p-3 rounded-full shadow-lg"
              >
                <FaMicrophone />
              </button>
              <button
                onClick={() => navigate("/upload/photo")}
                className="bg-purple-700 text-white p-3 rounded-full shadow-lg"
              >
                <FaImage />
              </button>
            </div>
          )}

          
          <button
            className="bg-white text-purple-700 text-2xl p-4 rounded-full shadow-xl"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? <FaTimes /> : <FaPlus />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
