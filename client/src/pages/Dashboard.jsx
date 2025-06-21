import { useSelector } from "react-redux";
import { useEffect,useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [sparkPoints, setSparkPoints] = useState(0);
  const [completedQuests, setCompletedQuests] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
    const fetchDashboardData = async () =>{
      try{

        if(!currentUser?._id) return ;


        const pointsRes = await API.get(`/spark-points/${currentUser._id}`);
        const questsRes = await API.get(`/quests?userId=${currentUser._id}`);

        setSparkPoints(pointsRes.data.totalPoints );
        const completed = questsRes.data.quests.filter((q)=>q.status === "done");

        setCompletedQuests(completed.length);
        setLoading(false);
      }catch(err){
        console.log("fetching dashboard data:",err);
      }
    }

    fetchDashboardData();
  },[currentUser])

  return (
    <div className="min-h-screen bg-[#A18AFF] p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">
        Welcome!! {currentUser?.name || "User"} 👋
      </h1>

      { loading ? ( 
        <p>Loading dashboard...</p>
      ):(
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white text-black p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Spark Points</h2>
          <p className="text-3xl font-bold mt-2">{sparkPoints}</p>
        </div>

        <div className="bg-white text-black p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Quests Completed</h2>
          <p className="text-3xl font-bold mt-2">{completedQuests}</p>
        </div>

        <div className="bg-white text-black p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-2">
            <a href="/profile" className="text-blue-600 underline">View Profile</a>
          </p>
        </div>
      </div>
      )}
    </div>
  );
};

export default Dashboard;
