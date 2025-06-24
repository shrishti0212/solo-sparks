import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../../api/axios';

const MoodForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '😨', label: 'Anxious' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😇', label: 'Grateful' },
  ];

  const [sliderValue, setSliderValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (id) {
      const fetchMood = async () => {
        try {
          const res = await API.get(`/reflections/${id}`);
          const moodLabel = res.data.notes?.split(' ')?.[1]; // extract label
          const index = moods.findIndex((m) => m.label === moodLabel);
          if (index !== -1) {
            setSliderValue(index);
          }
        } catch (err) {
          console.error('Failed to load mood', err);
        }
      };
      fetchMood();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedMood = moods[sliderValue];

    const formData = new FormData();
    formData.append('type', 'mood');
    formData.append('title', `Mood: ${selectedMood.label}`);
    formData.append('notes', `${selectedMood.emoji} ${selectedMood.label}`);

    try {
      setLoading(true);
      if (id) {
        await API.put(`/reflections/${id}`, formData);
        alert('Mood updated!');
      } else {
        await API.post('/reflections', formData);
        alert('Mood saved!');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-xl mx-auto text-purple-800 p-1">
        <h2 className="text-3xl font-bold italic text-[#5f5796] text-center mb-1">
          Hey{user?.username ? `, ${user.username}` : ''}! How are you feeling today?
        </h2>
        <p className="text-sm text-center font-semibold text-[#474270] mb-10">{today}</p>

        <form onSubmit={handleSubmit}>
          <div className="w-full mb-4">
            <input
              type="range"
              min="0"
              max={moods.length - 1}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full mt-20 accent-purple-600"
            />
            <div className="text-center mt-2">
              <span className="text-3xl">{moods[sliderValue].emoji}</span>
              <p className="text-sm font-semibold mt-1">{moods[sliderValue].label}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-10 bg-white text-purple-500 font-semibold p-4 rounded-xl hover:bg-opacity-80"
          >
            {loading ? 'Saving...' : id ? 'Update Mood' : 'Save Mood'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MoodForm;
