import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";

const Rewards = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [rewards, setRewards] = useState([]);
  const [sparkPoints, setSparkPoints] = useState(0);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await API.get("/rewards");
        setRewards(res.data.reward);

        const pointsRes = await API.get(`/spark-points/${currentUser._id}`);
        setSparkPoints(pointsRes.data.totalPoints || 0);
      } catch (err) {
        console.error("Error fetching rewards:", err);
        setRewards([]);
      }
    };

    fetchRewards();
  }, [currentUser]);

  const handleRedeem = async (rewardId, cost) => {
    if (sparkPoints < cost) return alert("Not enough Spark Points!");

    try {
      const res = await API.post(`/rewards/redeem/${rewardId}`);

      setSparkPoints((prev) => prev - cost);
      alert("Reward redeemed!");
    } catch (err) {
      console.error("Error redeeming reward:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#A18AFF] p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🎁 Rewards Store</h2>
      <p className="text-lg text-center mb-4">
        ✨ Spark Points: <span className="font-bold">{sparkPoints}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward._id}
            className="bg-white text-black p-4 rounded-xl shadow"
          >
            <h3 className="text-xl font-bold mb-2">{reward.title}</h3>
            <p className="text-sm mb-2">{reward.description}</p>
            <p className="font-semibold text-purple-600">
              Cost: {reward.cost} Spark Points
            </p>
            <button
              onClick={() => handleRedeem(reward._id, reward.cost)}
              disabled={sparkPoints < reward.cost}
              className={`mt-4 px-4 py-2 rounded w-full ${
                sparkPoints >= reward.cost
                  ? "bg-purple-600 text-white"
                  : "bg-gray-400 text-gray-100 cursor-not-allowed"
              }`}
            >
              Redeem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
