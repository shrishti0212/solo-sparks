import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const DailyReflectionForm = () => {
  const { id } = useParams(); // check if in edit mode
  const navigate = useNavigate();

  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Fetch existing reflection if editing
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await API.get(`/reflections/${id}`);
          if (res.data.notes) setNotes(res.data.notes);
          if (res.data.image) setImagePreview(res.data.image);
        } catch (err) {
          console.error('Failed to load existing reflection:', err);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', 'daily-reflection');
    formData.append('title', 'Truth');
    formData.append('notes', notes);
    if (image) formData.append('image', image);

    try {
      if (id) {
        await API.put(`/reflections/${id}`, formData);
        alert('Reflection updated!');
      } else {
        await API.post('/reflections', formData);
        alert('Reflection saved!');
      }
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to submit reflection.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 text-white">
      <div className="max-w-xl mx-auto text-purple-800 p-1">
        <h2 className="text-3xl font-bold ita text-[#5f5796] text-center mb-1">Truth</h2>
        <p className="text-sm text-center font-semibold text-[#474270] mb-10">{today}</p>

        <p className="italic text-white font-semibold text-lg mb-4">I believe true leadership means _______.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            placeholder="Write your thoughts..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={1}
            className="w-full p-3 rounded bg-white opacity-20 mb-2"
            required
          />

          <div className="flex justify-center">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg hover:opacity-80">
                  <span className="text-purple-800 font-semibold">📷 Add Photo</span>
                </div>
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              }}
              className="hidden"
            />
          </div>

        {imagePreview && (
          <>
          <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">Selected: {image?.name || 'existing image loaded'}</p>
          </div>
          <div className="mt-2">
            <img
            src={imagePreview}
            alt="Uploaded"
            className="w-full rounded-xl max-h-full object-cover"
            />
          </div>
          </>
        )}

          <button
            type="submit"
            className="w-full space-y-10 bg-white text-purple-500 font-semibold p-4 rounded-xl hover:bg-opacity-80"
          >
            Save Reflection
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyReflectionForm;
