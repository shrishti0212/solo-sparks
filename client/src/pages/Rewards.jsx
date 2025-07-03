import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const Rewards = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [rewards, setRewards] = useState([]);
  const [sparkPoints, setSparkPoints] = useState(0);
  const [redeemedIds, setRedeemedIds] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await API.get("/rewards");
        setRewards(res.data.reward);

        const pointsRes = await API.get(`/spark-points/${currentUser._id}`);
        setSparkPoints(pointsRes.data.totalPoints || 0);
      } catch (err) {
        setRewards([]);
        console.error("Error fetching rewards:", err);
      }
    };

    fetchRewards();
  }, [currentUser]);

  const confirmRedeem = (reward) => {
    if (sparkPoints < reward.cost) {
      toast.error("Not enough Spark Points!");
      return;
    }
    setSelectedReward(reward);
  };

  const handleRedeem = async () => {
    if (!selectedReward) return;

    try {
      await API.post(`/rewards/redeem/${selectedReward._id}`);
      setSparkPoints((prev) => prev - selectedReward.cost);
      setRedeemedIds((prev) => [...prev, selectedReward._id]);
      confetti({ particleCount: 100, spread: 70 });
      toast.success("🎉 Reward redeemed!");
    } catch {
      toast.error("Failed to redeem reward. Please try again.");
    } finally {
      setSelectedReward(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8589EB] to-[#A3ABFF] p-6 text-white font-[Roboto]">
      <h2 className="text-3xl font-bold mb-4 text-center tracking-wide">🎁 Rewards Store</h2>
      <p className="text-md text-center mb-10 text-white/90">
        ✨ <span className="text-white font-semibold">Your Spark Points: {sparkPoints}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward._id}
            className="relative bg-white/20 backdrop-blur-md p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            {redeemedIds.includes(reward._id) && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                ✔ Redeemed
              </span>
            )}
            <h3 className="text-xl font-bold mb-1">{reward.title}</h3>
            <p className="text-sm text-white/80 mb-2">{reward.description}</p>
            <p className="font-semibold text-[#f8e9ff] mb-4">{reward.cost} Spark Points</p>

            <button
              onClick={() => confirmRedeem(reward)}
              disabled={sparkPoints < reward.cost || redeemedIds.includes(reward._id)}
              className={`w-full px-4 py-2 rounded-xl font-semibold transition ${
                sparkPoints >= reward.cost && !redeemedIds.includes(reward._id)
                  ? "bg-white text-[#8576FF] hover:bg-purple-100"
                  : "bg-white/30 text-white/50 cursor-not-allowed"
              }`}
            >
              {sparkPoints >= reward.cost
                ? redeemedIds.includes(reward._id)
                  ? "Redeemed"
                  : "Redeem Now"
                : "Not Enough Points"}
            </button>
          </div>
        ))}
      </div>

      
      {selectedReward && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white text-[#4a4a7a] rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-4">Confirm Redemption</h3>
            <p className="mb-6">
              Are you sure you want to redeem{" "}
              <span className="font-semibold text-[#8576FF]">{selectedReward.title}</span> for{" "}
              <span className="font-semibold text-[#8576FF]">
                {selectedReward.cost} Spark Points
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSelectedReward(null)}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
              >
                Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
