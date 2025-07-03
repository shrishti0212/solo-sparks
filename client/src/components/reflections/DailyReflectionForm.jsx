import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BsFillTrashFill } from 'react-icons/bs';

const DailyReflectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const assignedTaskId = location.state?.assignedTaskId || null;
  const promptTitle = location.state?.title || 'Daily Reflection';
  const promptContent = location.state?.content || '';

  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await API.get(`/reflections/${id}`);
          if (res.data.notes) setNotes(res.data.notes);
          if (res.data.image) setImagePreview(res.data.image);
        } catch {}
      };
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', 'daily-reflection');
    formData.append('title', promptTitle);
    formData.append('notes', notes);
    if (image) formData.append('image', image);
    if (assignedTaskId) formData.append('assignedTaskId', assignedTaskId);

    try {
      setLoading(true);
      if (id) {
        await API.put(`/reflections/${id}`, formData);
        toast.success('Reflection updated!');
      } else {
        await API.post('/reflections', formData);
        toast.success('Reflection saved!');
      }
      navigate('/dashboard');
    } catch {
      toast.error('Failed to submit reflection.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8589EB] to-[#A3ABFF] px-6 py-8 text-white">
      <div className="max-w-xl mx-auto text-purple-800 p-1">
        <h2 className="text-3xl font-bold italic text-[#5f5796] text-center mb-1">{promptTitle}</h2>
        <p className="text-sm text-center font-semibold text-[#474270] mb-10">{today}</p>
        <p className="italic text-white font-semibold text-lg mb-4">{promptContent}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            placeholder="Write your thoughts..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={1}
            className="w-full p-4 rounded-xl resize-none bg-white bg-opacity-20 text-white placeholder-white/70 focus:outline-none"
            required
          />

          {!imagePreview && (
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
          )}

          {imagePreview && (
            <div className="relative mt-4">
              <img src={imagePreview} alt="Uploaded" className="w-full rounded-xl object-cover" />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-2 right-2 bg-purple-100 text-purple-700 hover:bg-purple-200 p-2 rounded-full shadow-sm hover:scale-105 transition"
                title="Remove photo"
              >
                <BsFillTrashFill className="text-sm" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-500 font-semibold p-4 rounded-xl hover:bg-opacity-80"
          >
            {loading ? 'Saving...' : id ? 'Update Reflection' : 'Save Reflection'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyReflectionForm;
