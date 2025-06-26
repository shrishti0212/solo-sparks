import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const DashboardCard = ({
  _id,
  type,
  notes,
  image,
  createdAt,
  assignedTaskId,
  onDelete,
  promptContent, // ✅ content from prompt if available
}) => {
  const navigate = useNavigate();
  const time = format(new Date(createdAt), 'p');

  const ICONS = {
    'daily-reflection': '🧠',
    'daily-challenge': '🏔️',
    photo: '📸',
    journal: '📓',
  };

  const TITLES = {
    'daily-reflection': 'Daily Reflection',
    'daily-challenge': 'Daily Challenge',
    photo: 'Photo Upload',
    journal: 'Journal Entry',
  };

  const handleCardClick = () => {
    if (!type || !_id) return;

    const routes = {
      photo: `/reflection/photo/${_id}`,
      'daily-reflection': `/reflection/daily/${_id}`,
      'daily-challenge': {
        path: `/reflection/challenge/${_id}`,
        state: {
          assignedTaskId,
          title: 'Daily Challenge',
          content: promptContent || '',
        },
      },
      mood: `/reflection/mood/${_id}`,
      journal: `/reflection/journal/${_id}`,
    };

    const route = routes[type];
    if (typeof route === 'string') {
      navigate(route);
    } else if (route?.path) {
      navigate(route.path, { state: route.state });
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this reflection?')) return;

    try {
      await API.delete(`/reflections/${_id}`);
      toast.success('Deleted!');
      onDelete?.(_id);
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white text-purple-800 rounded-2xl p-4 shadow mb-4 cursor-pointer hover:shadow-md transition"
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 text-xs rounded-full z-10"
        title="Delete"
      >
        ❌
      </button>

      {type === 'mood' ? (
        <div className="flex items-center gap-3">
          <div className="text-3xl">{notes?.split(' ')[0]}</div>
          <div>
            <p className="font-semibold">{notes?.split(' ')[1]}</p>
            <p className="text-sm text-gray-500">{time}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
              {ICONS[type] || ''}
            </div>
            <div>
              <p className="font-semibold">{TITLES[type] || ''}</p>
              <p className="text-sm text-gray-500">{time}</p>
            </div>
          </div>

          {notes && (
            <p className="text-gray-800 mb-2 text-sm whitespace-pre-line">{notes}</p>
          )}

          {image && (
            <img
              src={image}
              alt="reflection"
              className="w-full rounded-xl max-h-60 object-cover"
            />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardCard;
