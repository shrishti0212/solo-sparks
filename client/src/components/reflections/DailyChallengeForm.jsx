import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const DailyChallengeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const assignedTaskId = location.state?.assignedTaskId || null;
  const promptTitle = 'Daily Challenge';
  const promptContent = location.state?.content || '';

  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const fetchExisting = async () => {
      if (!assignedTaskId) return;
      try {
        const res = await API.get(`/reflections/task/${assignedTaskId}`);
        if (res.data) {
          setExistingId(res.data._id);
          if (res.data.notes) setNotes(res.data.notes);
          if (res.data.image) setImagePreview(res.data.image);
        }
      } catch {}
    };
    fetchExisting();
  }, [assignedTaskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', 'daily-challenge');
    formData.append('title', promptTitle);
    formData.append('notes', notes);
    if (image) formData.append('image', image);
    if (assignedTaskId) formData.append('assignedTaskId', assignedTaskId);

    try {
      setLoading(true);
      if (existingId) {
        await API.put(`/reflections/${existingId}`, formData);
        toast.success('Challenge updated!');
      } else {
        await API.post('/reflections', formData);
        toast.success('Challenge submitted!');
      }
      navigate('/dashboard');
    } catch {
      toast.error('Failed to submit challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 text-white">
      <div className="max-w-xl mx-auto text-purple-800 p-1">
        <h2 className="text-3xl font-bold italic text-[#5f5796] text-center mb-1">{promptTitle}</h2>
        <p className="text-sm text-center font-semibold text-[#474270] mb-10">{today}</p>
        <p className="italic text-white font-semibold text-lg mb-4">{promptContent}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!imagePreview && (
            <div className="flex justify-center">
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg hover:opacity-80">
                  <span className="text-purple-800 font-semibold">📷 Add Photo</span>
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
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-white bg-opacity-70 text-purple-800 rounded-full p-1 hover:bg-opacity-100"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-500 font-semibold p-4 rounded-xl hover:bg-opacity-80"
          >
            {loading ? 'Saving...' : existingId ? 'Update Challenge' : 'Save Challenge'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyChallengeForm;
