import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const PhotoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Load photo if in edit mode
  useEffect(() => {
    if (id) {
      const fetchReflection = async () => {
        try {
          const res = await API.get(`/reflections/${id}`);
          if (res.data.image) {
            setImagePreview(res.data.image);
          }
        } catch (err) {
          console.error('Failed to load reflection', err);
        }
      };
      fetchReflection();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image && !imagePreview) {
      alert('Please upload a photo first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('type', 'photo');
    if (image) {
      formData.append('image', image);
    }

    try {
      if (id) {
        await API.put(`/reflections/${id}`, formData);
        alert('Photo updated!');
      } else {
        await API.post('/reflections', formData); // ✅ Correct route
        alert('Photo uploaded!');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await API.delete(`/reflections/${id}`);
      alert('Photo deleted');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

 return (
  <div className="min-h-screen px-6 py-8 text-white">
    <div className="max-w-xl mx-auto text-purple-800 p-1">
      <h2 className="text-3xl font-bold italic text-[#5f5796] text-center mb-1">
        Photo Reflection
      </h2>
      <p className="text-sm text-center font-semibold text-[#474270] mb-10">{today}</p>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Show image if exists */}
        {imagePreview && (
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <img
              src={imagePreview}
              alt="Uploaded"
              className="w-full max-h-full object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={handleDelete} // use delete logic instead of just hiding
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 px-[6px] text-xs hover:bg-opacity-70"
              title="Delete reflection"
            >
              ❌
            </button>
          </div>
        )}

        {/* Only show upload if no image is present */}
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
        {(image || !id) && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-500 font-semibold p-4 rounded-xl hover:bg-opacity-80"
          >
            {loading ? 'Saving...' : id ? 'Update Photo' : 'Save Photo'}
          </button>
        )}
      </form>
    </div>
  </div>
);

};

export default PhotoForm;
