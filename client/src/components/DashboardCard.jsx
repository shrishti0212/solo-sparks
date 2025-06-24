import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ _id, type, notes, image, createdAt }) => {
  const navigate = useNavigate();
  const time = format(new Date(createdAt), 'p');

  const getHeaderIcon = () => {
    if (type === 'daily-reflection') return '🧠';
    if (type === 'daily-challenge') return '🏔️';
    if (type === 'photo') return '📸';
    return '';
  };

  const getHeaderTitle = () => {
    if (type === 'daily-reflection') return 'Daily Reflection';
    if (type === 'daily-challenge') return 'Daily Challenge';
    if (type === 'photo') return 'Photo Upload';
    return '';
  };

  const handleClick = () => {
    if (!type || !_id) return;

    // Navigate to correct edit form with ID
    if (type === 'photo') navigate(`/reflection/photo/${_id}`);
    else if (type === 'daily-reflection') navigate(`/reflection/daily/${_id}`);
    else if (type === 'daily-challenge') navigate(`/reflection/challenge/${_id}`);
    else if (type === 'journal') navigate(`/reflection/journal/${_id}`);
    else if (type === 'mood') navigate(`/reflection/mood/${_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white text-purple-800 rounded-2xl p-4 shadow mb-4 cursor-pointer hover:shadow-md transition"
    >
      {/* Header */}
      {type !== 'mood' && (
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
            {getHeaderIcon()}
          </div>
          <div>
            <p className="font-semibold">{getHeaderTitle()}</p>
            <p className="text-sm text-gray-500">{time}</p>
          </div>
        </div>
      )}

      {/* Body */}
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
