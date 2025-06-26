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
  onClick
}) => {
  const navigate = useNavigate();

  const defaultHandleClick = () => {
    navigate(route, { state: { type, assignedTaskId, title, content: preview } });
  };

  return (
    <div
      className={`rounded-3xl p-6 md:p-10 text-white shadow-md cursor-pointer transition-transform hover:scale-[1.02] ${background}`}
      onClick={onClick || defaultHandleClick}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      {description && <p className="text-sm opacity-80 mb-1">{description}</p>}
      {preview && (
        <div className="mt-2 bg-white opacity-30 text-purple-900 p-3 rounded-lg text-sm">
          {preview}
        </div>
      )}
    </div>
  );
};

export default HomepageCard;
