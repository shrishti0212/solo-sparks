import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";
import dayjs from "dayjs";

const Quests = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);

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

        setQuests(withExtras);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load quests:", error);
      }
    };

    fetchData();
  }, []);

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
    <div className="min-h-screen bg-[#A18AFF] p-6 text-white relative">
      <h2 className="text-2xl font-bold mb-4">Your Quests</h2>

      {loading ? (
        <p>Loading quests...</p>
      ) : (
        <div className="space-y-4">
          {quests.map((quest) => {
            const formattedDate = dayjs(quest.createdAt).format("dddd, MMM D");

            return (
              <div key={quest._id} className="bg-white text-black p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-purple-700 font-semibold">{formattedDate}</div>
                  {quest.mood && (
                    <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Mood: {quest.mood.mood}
                    </span>
                  )}
                </div>

                {quest.reflections.length > 0 && (
                  <div className="mb-3">
                    {quest.reflections.map((ref, i) => (
                      <div key={i} className="mb-2">
                        {ref.audio && (
                          <audio controls className="w-full mb-1">
                            <source src={ref.audio} type="audio/mpeg" />
                          </audio>
                        )}
                        {ref.image && (
                          <img src={ref.image} alt="Reflection" className="rounded mb-1" />
                        )}
                        {ref.text && (
                          <p className="text-sm italic text-gray-700">"{ref.text}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="text-lg font-bold">{quest.title}</h3>
                <p>{quest.description}</p>
                <p className="text-sm mt-1">Type: {quest.type}</p>
                <p
                  className={`text-sm font-bold mt-1 ${
                    quest.status === "done" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  Status: {quest.status}
                </p>

                <div className="mt-3 flex gap-2">
                  {quest.status !== "done" && (
                    <button
                      onClick={() => markAsDone(quest._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Done
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(quest)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteQuest(quest._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
