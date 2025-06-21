import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { logoutUser } from "../utils/userSlice";
import API from "../api/axios";

const Profile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sparkPoints, setSparkPoints] = useState(0);

  useEffect(() => {
    const fetchSparkPoints = async () => {
      try {
        const res = await API.get(`/spark-points/${currentUser._id}`);
        setSparkPoints(res.data.totalPoints || 0);
      } catch (err) {
        console.error("Error fetching spark points:", err);
      }
    };
    fetchSparkPoints();
  }, [currentUser]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] p-6">
      
      <div className="bg-gradient-to-br from-[#8576FF] to-[#B8B5FF] rounded-3xl text-white p-6 shadow-md">
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-6xl mb-2" />
          <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
          <p className="text-sm opacity-80">{currentUser?.email}</p>
        </div>
        <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-4 text-center shadow-sm">
          <p className="text-sm">✨ Spark Points</p>
          <p className="text-2xl font-bold">{sparkPoints}</p>
        </div>
      </div>

      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white rounded-2xl p-5 shadow hover:bg-purple-100 text-left"
        >
          <h4 className="text-lg font-semibold text-[#8576FF]">📊 Dashboard</h4>
          <p className="text-sm text-gray-500">See your progress</p>
        </button>

        <button
          onClick={() => navigate("/quests")}
          className="bg-white rounded-2xl p-5 shadow hover:bg-purple-100 text-left"
        >
          <h4 className="text-lg font-semibold text-[#8576FF]">🗺️ Quests</h4>
          <p className="text-sm text-gray-500">Manage your journey</p>
        </button>

        <button
          onClick={() => navigate("/rewards")}
          className="bg-white rounded-2xl p-5 shadow hover:bg-purple-100 text-left"
        >
          <h4 className="text-lg font-semibold text-[#8576FF]">🎁 Rewards</h4>
          <p className="text-sm text-gray-500">Redeem your spark points</p>
        </button>

        <button
          onClick={handleLogout}
          className="bg-[#8576FF] text-white rounded-2xl p-5 shadow hover:opacity-90 text-left"
        >
          <h4 className="text-lg font-semibold">🚪 Logout</h4>
          <p className="text-sm">End your session safely</p>
        </button>
      </div>
    </div>
  );
};

export default Profile;
