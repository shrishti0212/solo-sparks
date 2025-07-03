import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { BsFillTrashFill } from 'react-icons/bs';

const JournalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
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
      const fetchJournal = async () => {
        try {
          const res = await API.get(`/reflections/${id}`);
          const { title, notes, image } = res.data;
          if (title) setTitle(title);
          if (notes) setNotes(notes);
          if (image) setImagePreview(image);
        } catch {
          toast.error('Failed to load journal');
        }
      };
      fetchJournal();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title && !notes && !image && !imagePreview) {
      return toast.error('Please add a title, notes, or image before submitting.');
    }

    const formData = new FormData();
    formData.append('type', 'journal');
    if (title) formData.append('title', title);
    if (notes) formData.append('notes', notes);
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      if (id) {
        await API.put(`/reflections/${id}`, formData);
        toast.success('Journal updated!');
      } else {
        await API.post('/reflections', formData);
        toast.success('Journal saved!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
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
        <h2 className="text-3xl font-bold italic text-[#5f5796] text-center mb-1">Journal</h2>
        <p className="text-sm text-center font-semibold text-[#474270] mb-10">{today}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title (e.g., Morning thoughts)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white/70 focus:outline-none"
          />

          <textarea
            placeholder="Write your journal entry..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white/70 focus:outline-none"
            rows={5}
          />

          {imagePreview && (
            <div className="relative w-full max-h-full rounded-xl overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full object-cover rounded-xl" />
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
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-500 font-semibold p-4 rounded-xl hover:bg-opacity-80"
          >
            {loading ? 'Saving...' : id ? 'Update Journal' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JournalForm;
