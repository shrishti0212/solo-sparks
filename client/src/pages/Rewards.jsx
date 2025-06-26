import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";
import toast from "react-hot-toast"

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
    if (sparkPoints < cost) {
      toast.error("Not enough Spark Points!");
    return 
  }

    try {
      await API.post(`/rewards/redeem/${rewardId}`);
      setSparkPoints((prev) => prev - cost);
      toast.success("🎉 Reward redeemed!");
    } catch (err) {
      console.error("Error redeeming reward:", err);
      toast.error("Failed to redeem reward. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8576FF] to-[#B8B5FF] p-6 text-white font-[Roboto]">
      <h2 className="text-3xl font-bold mb-4 text-center tracking-wide">🎁 Rewards Store</h2>
      <p className="text-md text-center mb-8 text-white/80">
        ✨ <span className="text-white font-semibold">Your Spark Points: {sparkPoints}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward._id}
            className="bg-white/20 backdrop-blur-md text-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-xl font-bold mb-1">{reward.title}</h3>
            <p className="text-sm text-white/80 mb-2">{reward.description}</p>
            <p className="font-semibold text-[#5f599e]">{reward.cost} Spark Points</p>

            <button
              onClick={() => handleRedeem(reward._id, reward.cost)}
              disabled={sparkPoints < reward.cost}
              className={`mt-4 px-4 py-2 rounded-xl w-full font-semibold transition ${
                sparkPoints >= reward.cost
                  ? "bg-white text-[#8576FF] hover:bg-[#f0f0ff]"
                  : "bg-white/30 text-white/50 cursor-not-allowed"
              }`}
            >
              {sparkPoints >= reward.cost ? "Redeem Now" : "Not Enough Points"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;