import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";
import dayjs from "dayjs";

const Quests = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [reflectionsCount, setReflectionsCount] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [sparkPoints, setSparkPoints] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "self-care",
  });

  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questRes = await API.get("/quests");
        const moodRes = await API.get("/moods");
        const allQuests = questRes.data.quests;
        const allMoods = moodRes.data.moods;

        const withExtras = await Promise.all(
          allQuests.map(async (quest) => {
            const reflectionsRes = await API.get(`/reflections/${quest._id}`);
            return {
              ...quest,
              reflections: reflectionsRes.data.reflections || [],
              mood: allMoods.find((m) => m.questId === quest._id),
            };
          })
        );

        let totalReflections = 0;
        let totalPhotos = 0;
        withExtras.forEach((q) => {
          totalReflections += q.reflections.length;
          totalPhotos += q.reflections.filter((r) => r.image).length;
        });

        const sparkRes = await API.get(`/spark-points/${currentUser._id}`);

        setReflectionsCount(totalReflections);
        setPhotoCount(totalPhotos);
        setSparkPoints(sparkRes.data.totalPoints || 0);

        setQuests(withExtras);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load quests:", error);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuest) {
        const res = await API.patch(`/quests/${editingQuest._id}`, formData);
        setQuests((prev) =>
          prev.map((q) => (q._id === editingQuest._id ? res.data.quest : q))
        );
      } else {
        const res = await API.post("/quests", formData);
        setQuests((prev) => [...prev, res.data.quest]);
      }

      setFormData({ title: "", description: "", type: "self-care" });
      setEditingQuest(null);
      setShowForm(false);
    } catch (err) {
      console.error("Quest save failed:", err);
    }
  };

  const handleEdit = (quest) => {
    setFormData({
      title: quest.title,
      description: quest.description,
      type: quest.type,
    });
    setEditingQuest(quest);
    setShowForm(true);
  };

  const markAsDone = async (id) => {
    try {
      await API.patch(`/quests/${id}`, { status: "done" });
      setQuests((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: "done" } : q))
      );
    } catch (error) {
      console.error("Failed to update quest:", error);
    }
  };

  const deleteQuest = async (id) => {
    try {
      await API.delete(`/quests/${id}`);
      setQuests((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      console.error("Failed to delete quest:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8576FF] to-[#B8B5FF] p-4 text-sm text-white">
      <div className="bg-[#eeedfc] p-6 rounded-2xl mb-6 mt-5">
        <div className="flex flex-col sm:flex-row justify-between text-center gap-6 sm:gap-0">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#585192]">Reflections</p>
            <p className="text-2xl font-bold  text-[#585192] mt-1">{reflectionsCount}</p>
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-[#585192]">Photos</p>
          <p className="text-2xl font-bold text-[#585192] mt-1">{photoCount}</p>
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-[#585192]">Points</p>
          <p className="text-2xl font-bold  text-[#585192] mt-1">{sparkPoints}</p>
        </div>
      </div>
    </div>


      {loading ? (
        <p>Loading quests...</p>
      ) : (
        quests.map((quest) => {
          const formattedDate = dayjs(quest.createdAt).format("dddd, MMM D");
          return (
            <div key={quest._id} className="mb-6">
              <h3 className="text-lg font-bold mb-2 mt-10">{formattedDate}</h3>

              <div className="flex flex-col md:flex-row gap-2 text-sm ">
                
                {/* Audio and Reflection Section */}
                <div className="flex-2 bg-white/10 p-4 rounded-xl">
                  {quest.reflections.map((ref, i) => (
                    <div key={i} className="mb-3">
                      {ref.audio && (
                        <audio controls className="w-1/2 mb-1">
                          <source src={ref.audio} type="audio/mpeg" />
                        </audio>
                      )}
                      {ref.text && (
                        <p className="italic text-white/80 text-xs">"{ref.text}"</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quest Section */}
                <div className="flex-1 bg-white text-black p-4 rounded-xl shadow">
                  <h4 className="font-bold text-base mb-1">{quest.title}</h4>
                  <p className="text-xs mb-1">{quest.description}</p>
                  <p className="text-xs mb-1">Type: {quest.type}</p>
                  <p className={`text-xs font-bold mb-2 ${
                    quest.status === "done" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    Status: {quest.status}
                  </p>
                  <div className="flex gap-2">
                    {quest.status !== "done" && (
                      <button onClick={() => markAsDone(quest._id)} className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                        Done
                      </button>
                    )}
                    <button onClick={() => handleEdit(quest)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      Edit
                    </button>
                    <button onClick={() => deleteQuest(quest._id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                      Delete
                    </button>
                  </div>
                </div>

                {/* Image Section */}
                <div className="flex-1 bg-white/10 p-4 rounded-xl">
                  {quest.reflections.filter((r) => r.image).map((ref, i) => (
                    <img
                      key={i}
                      src={ref.image}
                      alt="Reflection"
                      className="rounded mb-2 max-h-40 object-cover w-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}

      <button
        onClick={() => {
          setFormData({ title: "", description: "", type: "self-care" });
          setEditingQuest(null);
          setShowForm(true);
        }}
        className="fixed bottom-6 right-6 bg-white text-purple-700 border-2 border-purple-700 w-14 h-14 rounded-full text-3xl font-bold shadow-lg hover:bg-purple-100"
      >
        +
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-80 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-purple-700">
              {editingQuest ? "Edit Quest" : "New Quest"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Title"
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="self-care">Self-care</option>
                <option value="adventure">Adventure</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="creativity">Creativity</option>
                <option value="reflection">Reflection</option>
              </select>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                {editingQuest ? "Update Quest" : "Create Quest"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quests;