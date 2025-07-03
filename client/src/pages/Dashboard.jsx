import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../api/axios';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [reflectionsByDate, setReflectionsByDate] = useState({});
  const [summary, setSummary] = useState({ reflections: 0, mood: 0, photos: 0 });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const res = await API.get('/reflections');
        const reflections = res.data.reflections;

        if (!Array.isArray(reflections)) {
          toast.error('Unexpected data format received.');
          return;
        }

        const grouped = {};
        let total = 0;
        let moodCount = 0;
        let photoCount = 0;

        reflections.forEach((item) => {
          const dateKey = format(new Date(item.createdAt), 'yyyy-MM-dd');
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(item);
          total++;
          if (item.type === 'mood') moodCount++;
          if (item.image) photoCount++;
        });

        setReflectionsByDate(grouped);
        setSummary({ reflections: total, mood: moodCount, photos: photoCount });
        setLastUpdated(new Date());

        if (total === 0) toast('No reflections found. Start your first one today! 🌟');
      } catch {
        toast.error('Failed to fetch reflections.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchReflections();
  }, [currentUser]);

  const sortedDates = Object.keys(reflectionsByDate).sort((a, b) => new Date(b) - new Date(a));

  if (!currentUser) {
    return (
      <div className="text-center mt-20 text-purple-100">
        <p className="text-xl">Please login to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-8 lg:px-16 xl:px-32 py-5">
      <div className="max-w-screen-sm sm:max-w-screen-md mx-auto">
        <h1 className="text-center sm:text-3xl md:text-6xl italic font-bold text-white opacity-20 pt-2">
          Your Entries
        </h1>

        <div className="bg-white rounded-xl px-6 py-6 shadow-md mb-3 flex flex-wrap justify-around gap-y-4 items-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{summary.reflections}</p>
            <p className="text-sm font-semibold text-gray-500">Reflections</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{summary.mood}</p>
            <p className="text-sm font-semibold text-gray-500">Check-ins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{summary.photos}</p>
            <p className="text-sm font-semibold text-gray-500">Photos</p>
          </div>
        </div>

        {lastUpdated && (
          <p className="text-xs text-center text-purple-200 italic mb-6">
            Last updated: {format(lastUpdated, 'PPPpp')}
          </p>
        )}

        {loading ? (
          <Loader message="Fetching your reflections..." />
        ) : sortedDates.length === 0 ? (
          <div className="text-center mt-20 text-purple-100">
            <p className="text-2xl font-semibold mb-2">No entries yet.</p>
            <p className="text-sm text-purple-200 italic">Start your journey today! ✨</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <motion.div
              key={date}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gray-200 text-center rounded-xl px-3 py-2 w-16">
                  <p className="text-xl font-bold text-[#585791]">
                    {format(new Date(date), 'd')}
                  </p>
                  <p className="text-xs text-[#585791] font-semibold tracking-wide uppercase">
                    {format(new Date(date), 'MMM')}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-[#42426b] font-semibold">
                    {format(new Date(date), 'EEEE')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(date), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {reflectionsByDate[date].map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DashboardCard
                    {...item}
                    onDelete={(deletedId) => {
                      setReflectionsByDate((prev) => {
                        const updated = { ...prev };
                        updated[date] = updated[date].filter((r) => r._id !== deletedId);
                        if (updated[date].length === 0) delete updated[date];
                        return updated;
                      });

                      setSummary((prev) => ({
                        ...prev,
                        reflections: prev.reflections - 1,
                        mood: item.type === 'mood' ? prev.mood - 1 : prev.mood,
                        photos: item.image ? prev.photos - 1 : prev.photos,
                      }));
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
