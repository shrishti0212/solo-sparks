import React, { useState } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const DailyChallengeForm = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('type', 'daily-challenge');
    formData.append('title', 'Declutter Challenge');
    formData.append('notes', 'Today I will get rid of 3 things I don’t use anymore that are cluttering my space.');

    if (image) formData.append('image', image);

    try {
      setLoading(true);
      await API.post('/reflections', formData);
      alert('Challenge submitted!');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to submit challenge.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen px-6 py-8 text-white">
      <div className="max-w-xl mx-auto text-purple-800 p-1">
        <h2 className="text-3xl font-bold italic text-[#5f5796] text-center mb-1">Daily Challenge</h2>
        <p className="text-sm text-center font-semibold text-[#474270] mb-10">{today}</p>

        <p className="italic font-semibold text-lg text-white mb-5">
          Today I will get rid of 3 things I don’t use anymore that are cluttering my space.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Preview with remove option */}
          {imagePreview && (
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="w-full max-h-full object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 px-[6px] text-xs hover:bg-opacity-70"
                title="Remove photo"
              >
                ❌
              </button>
            </div>
          )}

          {/* Add Photo if not present */}
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

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-500 font-semibold p-4 rounded-xl hover:bg-opacity-80"
          >
            {loading ? 'Saving...' : 'Save Challenge'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyChallengeForm;
