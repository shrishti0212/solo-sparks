import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomepageCard = ({
  title,
  description,
  preview,
  route,
  icon,
  background = 'bg-purple-600',
  type,
  assignedTaskId,
  onClick,
  sticker,
}) => {
  const navigate = useNavigate();

  const defaultHandleClick = () => {
    navigate(route, {
      state: { type, assignedTaskId, title, content: preview },
    });
  };

  return (
    <div
      className={`relative rounded-3xl shadow-md cursor-pointer transition-transform hover:scale-[1.02] overflow-hidden ${background}`}
      onClick={onClick || defaultHandleClick}
    >
      {sticker && (
        <img
          src={sticker}
          alt="sticker"
          className="absolute bottom-0 right-0 w-24 sm:w-32 md:w-36 lg:w-48 object-contain z-10 opacity-90 pointer-events-none"
        />
      )}

      <div className="relative z-20 p-6 md:p-10 text-white">
        <div className="flex items-center gap-3 mb-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-2xl font-semibold">{title}</h3>
        </div>
        {description && <p className="text-sm text-white/80 mb-1">{description}</p>}
        {preview && (
          <div className="mt-2 bg-white/30 text-purple-900 p-3 rounded-lg text-sm">
            {preview}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomepageCard;
