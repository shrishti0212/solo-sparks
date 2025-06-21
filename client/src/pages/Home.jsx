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
    <div className="min-h-screen text-white/90 p-6 relative bg-gradient-to-br from-[#8576FF] to-[#B8B5FF]">
      
      {/* TODAY SECTION */}
      <h1 className="text-3xl font-bold uppercase font-[Roboto]">Today</h1>
      <p className="text-sm font-semibold text-[#e2e1fb] font-[Roboto] mb-6">{date}</p>

      {/* QUOTE BELOW DATE */}
      <div className="bg-white/20 backdrop-blur-sm text-white rounded-2xl p-5 mb-10 shadow-md font-[Roboto] italic text-center">
        “{quote}”
      </div>

      {/* DAILY CHECK-IN */}
      <div
        onClick={() => navigate("/mood-checkin")}
        className="bg-white/20 backdrop-blur-sm text-white rounded-2xl p-8 mb-8 shadow-md hover:shadow-lg transition cursor-pointer"
      >
        <h3 className="text-lg font-semibold uppercase font-[Roboto] text-white mb-2">
          🧠 Daily Check-In
        </h3>
        <p className="text-sm text-white/80">Log how you're feeling today</p>
      </div>

      {/* LATEST QUEST */}
      {latestQuest && (
        <div
          onClick={() => navigate("/quests")}
          className="bg-white/20 backdrop-blur-sm text-white rounded-2xl p-8 mb-8 shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <h3 className="text-lg font-semibold uppercase font-[Roboto] mb-2">
            🧩 Your Latest Quest
          </h3>
          <p className="text-sm text-white/80">{latestQuest.title}</p>
        </div>
      )}

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative">
          
          {isExpanded && (
            <div className="absolute bottom-16 flex flex-col gap-4 items-center">
              <button
                onClick={() => navigate("/mood-checkin")}
                className="bg-[#8576FF] text-white w-14 h-14 rounded-md shadow-xl hover:bg-[#786fbd] transition flex items-center justify-center"

              >
                <FaSmile />
              </button>
              <button
                onClick={() => navigate("/upload/audio")}
                className="bg-[#8576FF] text-white w-14 h-14 rounded-md shadow-xl hover:bg-[#786fbd] transition flex items-center justify-center"

              >
                <FaMicrophone />
              </button>
              <button
                onClick={() => navigate("/upload/photo")}
                className="bg-[#8576FF] text-white w-14 h-14 rounded-md shadow-xl hover:bg-[#786fbd] transition flex items-center justify-center"

              >
                <FaImage />
              </button>
            </div>
          )}

          <button
            className="bg-white text-[#8576FF] text-2xl w-14 h-14 rounded-md shadow-xl hover:bg-[#f0f0ff] transition flex items-center justify-center"
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
