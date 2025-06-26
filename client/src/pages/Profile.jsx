import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { logoutUser } from "../utils/userSlice";
import API from "../api/axios";
import { motion } from "framer-motion";

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
      <motion.div
        className="bg-gradient-to-br from-[#8576FF] to-[#B8B5FF] rounded-3xl text-white p-6 shadow-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-6xl mb-2" />
          <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
          <p className="text-sm opacity-80">{currentUser?.email}</p>
        </div>
        <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-4 text-center shadow-sm">
          <p className="text-sm">✨ Spark Points</p>
          <p className="text-2xl font-bold">{sparkPoints}</p>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "📊 Dashboard",
            desc: "See your progress",
            onClick: () => navigate("/dashboard"),
            customStyle: "bg-white text-[#8576FF]"
          },
          {
            label: "📝 Add Journal",
            desc: "Write your thoughts",
            onClick: () => navigate("/task/journal"),
            customStyle: "bg-white text-[#8576FF]"
          },
          {
            label: "🎁 Rewards",
            desc: "Redeem your spark points",
            onClick: () => navigate("/rewards"),
            customStyle: "bg-white text-[#8576FF]"
          },
          {
            label: "🚪 Logout",
            desc: "End your session safely",
            onClick: handleLogout,
            customStyle: "bg-[#8576FF] text-white",
          },
        ].map((btn, i) => (
          <motion.button
            key={i}
            onClick={btn.onClick}
            className={`rounded-2xl p-5 shadow text-left ${
              btn.customStyle || "bg-white"
            } hover:opacity-90`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
          >
            <h4 className="text-lg font-semibold ">{btn.label}</h4>
            <p className="text-sm text-gray-600">{btn.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Profile;