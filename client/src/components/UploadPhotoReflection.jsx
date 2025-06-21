import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const UploadPhoto = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [questId, setQuestId] = useState("");
  const [userQuests, setUserQuests] = useState([]);

 
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const res = await API.get("/quests");
        setUserQuests(res.data.quests);
        if (res.data.quests.length > 0) {
          setQuestId(res.data.quests[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch quests:", err);
      }
    };
    fetchQuests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !text || !questId) {
      alert("Please provide all fields");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("image", image);
    formData.append("questId", questId);

    try {
      await API.post("/reflections/text", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Reflection submitted successfully!");
      navigate("/"); 
    } catch (err) {
      console.error("Error submitting reflection:", err);
      alert("Failed to submit reflection");
    }
  };

  return (
    <div className="min-h-screen bg-[#A18AFF] p-6">
      <h2 className="text-2xl font-bold mb-4">📷 Upload Photo Reflection</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow-md max-w-lg mx-auto space-y-4"
      >
        <label className="block text-sm font-medium text-gray-700">
          Reflection Text:
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="How did this quest impact you?"
        />

        <label className="block text-sm font-medium text-gray-700">
          Upload Photo:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        <label className="block text-sm font-medium text-gray-700">
          Select Quest:
        </label>
        <select
          value={questId}
          onChange={(e) => setQuestId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {userQuests.map((q) => (
            <option key={q._id} value={q._id}>
              {q.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded shadow w-full mt-4"
        >
          Submit Reflection
        </button>
      </form>
    </div>
  );
};

export default UploadPhoto;
