import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [sparkPoints, setSparkPoints] = useState(0);
  const [completedQuests, setCompletedQuests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!currentUser?._id) return;

        const pointsRes = await API.get(`/spark-points/${currentUser._id}`);
        const questsRes = await API.get(`/quests?userId=${currentUser._id}`);

        setSparkPoints(pointsRes.data.totalPoints);
        const completed = questsRes.data.quests.filter((q) => q.status === "done");

        setCompletedQuests(completed.length);
        setLoading(false);
      } catch (err) {
        console.log("fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8576FF] to-[#B8B5FF] p-6 text-white font-[Roboto]">
      
      <h1 className="text-3xl font-bold mb-2 uppercase font-['Exo_2']">
        Welcome {currentUser?.name || "Explorer"}! 
      </h1>

      <p className="text-sm font-semibold text-[#e2e1fb] font-[Roboto] mb-8">✨ Your journey continues...</p>


      {loading ? (
        <p className="text-white/90">Loading dashboard...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-md text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold uppercase mb-2">Spark Points</h2>
            <p className="text-4xl font-bold">{sparkPoints}</p>
          </div>

          <div className="bg-white/20 backdrop-blur-md text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold uppercase mb-2">Quests Completed</h2>
            <p className="text-4xl font-bold">{completedQuests}</p>
          </div>

          <div className="bg-white/20 backdrop-blur-md text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold uppercase mb-2">Profile</h2>
            <p>
              <a
                href="/profile"
                className="text-[#E5DCFF] underline hover:text-white transition"
              >
                View Profile
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
