import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const moodOptions = [
  { emoji: "😢", label: "sad" },
  { emoji: "😟", label: "anxious" },
  { emoji: "😐", label: "neutral" },
  { emoji: "🙂", label: "calm" },
  { emoji: "😄", label: "happy" },
  { emoji: "🤩", label: "excited" },
];

const MoodCheckin = () => {
  const [moodIndex, setMoodIndex] = useState(2);
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  const handleSubmit = async () => {
    try {
      const payload = {
        mood: moodOptions[moodIndex].label,
        note,
      };

      await API.post("/moods", payload);

      alert("Mood submitted successfully!");
      navigate("/"); 
    } catch (err) {
      console.error("Submission failed", err);
      alert("Something went wrong while submitting mood.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#A18AFF] text-white px-4">
      <h2 className="text-xl mb-4 text-center">
        Hey, {user?.username || "you"}. How are you this fine afternoon?
      </h2>

      <div className="text-6xl">{moodOptions[moodIndex].emoji}</div>
      <p className="text-lg font-semibold mt-2 capitalize">{moodOptions[moodIndex].label}</p>

      <input
        type="range"
        min={0}
        max={moodOptions.length - 1}
        step={1}
        value={moodIndex}
        onChange={(e) => setMoodIndex(parseInt(e.target.value))}
        className="w-3/4 mt-6"
      />

      <textarea
        className="mt-6 w-3/4 rounded p-2 text-black"
        placeholder="Write a note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="mt-6 bg-white text-purple-700 font-bold py-2 px-6 rounded-full shadow-lg hover:bg-purple-100"
      >
        Continue
      </button>
    </div>
  );
};

export default MoodCheckin;
