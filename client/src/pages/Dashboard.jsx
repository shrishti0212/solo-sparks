import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../api/axios';
import DashboardCard from '../components/DashboardCard';
import { format } from 'date-fns';

const Dashboard = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [reflectionsByDate, setReflectionsByDate] = useState({});
  const [summary, setSummary] = useState({
    reflections: 0,
    mood: 0,
    photos: 0,
  });

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const res = await API.get('/reflections');
        const reflections = res.data.reflections;

        if (!Array.isArray(reflections)) {
          console.error("Unexpected data:", reflections);
          return;
        }

        // Group reflections by date
        const grouped = {};
        let totalReflections = 0;
        let moodCount = 0;
        let photoCount = 0;

        reflections.forEach((reflection) => {
          const date = format(new Date(reflection.createdAt), 'yyyy-MM-dd');

          if (!grouped[date]) {
            grouped[date] = [];
          }

          grouped[date].push(reflection);
          totalReflections++;

          if (reflection.type === 'mood') moodCount++;
          if (reflection.image) photoCount++;
        });

        setSummary({
          reflections: totalReflections,
          mood: moodCount,
          photos: photoCount,
        });

        setReflectionsByDate(grouped);
      } catch (error) {
        console.error('Error fetching reflections:', error);
      }
    };

    if (currentUser) {
      fetchReflections();
    }
  }, [currentUser]);

  return (
    <div className="p-5 px-52">
      <h1 className='text-center text-6xl italic font-bold text-white opacity-20'>Your Entries</h1>
      {/* Summary Box */}
      
<div className="bg-white text-gray-700 rounded-xl px-6 py-6 shadow-md mb-6 flex justify-around items-center">
  
  <div className="text-center">
    <p className="text-2xl font-bold">{summary.reflections}</p>
    <p className="text-sm">Reflections</p>
  </div>
  <div className="text-center">
    <p className="text-2xl font-bold">{summary.mood}</p>
    <p className="text-sm">Check-ins</p>
  </div>
  <div className="text-center">
    <p className="text-2xl font-bold">{summary.photos}</p>
    <p className="text-sm">Photos</p>
  </div>
</div>


      {/* Reflections by Date */}
      {Object.keys(reflectionsByDate)
        .sort((a, b) => new Date(b) - new Date(a))
        .map((date) => (
          <div key={date} className="mb-6">
            <div className="flex items-center gap-4 mb-3">
  <div className="bg-gray-200 text-center rounded-xl px-3 py-2 w-16">
    <p className="text-xl font-bold">{format(new Date(date), 'd')}</p>
    <p className="text-xs uppercase tracking-wide">{format(new Date(date), 'MMM')}</p>
  </div>
  <div>
    <p className="text-lg font-semibold">{format(new Date(date), 'EEEE')}</p>
    <p className="text-sm text-gray-500">
      {Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))} days ago
    </p>
  </div>
</div>

            {reflectionsByDate[date].map((item) => (
              <DashboardCard key={item._id} {...item} />
            ))}
          </div>
        ))}
    </div>
  );
};

export default Dashboard;
