import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const UploadAudio = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [text, setText] = useState("");
  const [audio, setAudio] = useState(null);
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
    if (!audio || !questId) {
      alert("Please provide all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("audio", audio);
    formData.append("questId", questId);

    try {
      await API.post("/reflections/audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Audio reflection submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error uploading audio:", err);
      alert("Upload failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#A18AFF] p-6">
      <h2 className="text-2xl font-bold mb-4">🎤 Upload Audio Reflection</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow-md max-w-lg mx-auto space-y-4"
      >
        <label className="block text-sm font-medium text-gray-700">
          Reflection Text (optional):
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Say something about your reflection"
        />

        <label className="block text-sm font-medium text-gray-700">
          Upload Audio File:
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files[0])}
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
          onClick={handleSubmit}
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded shadow w-full mt-4"
        >
          Submit Audio Reflection
        </button>
      </form>
    </div>
  );
};

export default UploadAudio;
