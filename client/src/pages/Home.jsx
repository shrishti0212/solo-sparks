import React, { useEffect, useState } from 'react';
import HomepageCard from '../components/HomepageCard';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { FiEdit3, FiCamera, FiSmile, FiPlus, FiX } from 'react-icons/fi';
import pink from "../images/pink.png";
import sleeping from "../images/sleeping.png";
import green from "../images/Frame.png";

const Home = () => {
  const navigate = useNavigate();
  const [isFabOpen, setIsFabOpen] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const [tasks, setTasks] = useState({
    'daily-reflection': null,
    'daily-challenge': null,
  });

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        await API.post('/assignedTask/assign');
        const res = await API.get('/assignedTask/today');
        const taskData = {
          'daily-reflection': null,
          'daily-challenge': null,
        };
        res.data.forEach((task) => {
          taskData[task.type] = {
            assignedTaskId: task._id,
            title: task.promptId?.title,
            content: task.promptId?.content,
          };
        });
        setTasks(taskData);
      } catch (err) {
        console.error('Failed to fetch assigned tasks:', err);
      }
    };
    fetchAssignedTasks();
  }, []);

  const handleCardClick = async (type, assignedTaskId, title, content, route) => {
    try {
      const res = await API.get(`/reflections/task/${assignedTaskId}`);
      const existing = res.data;
      if (existing && existing._id) {
        navigate(`/reflection/${type === 'daily-challenge' ? 'challenge' : 'daily'}/${existing._id}`, {
          state: { assignedTaskId, title, content },
        });
      } else {
        navigate(route, {
          state: { assignedTaskId, title, content },
        });
      }
    } catch {
      navigate(route, {
        state: { assignedTaskId, title, content },
      });
    }
  };

  return (
    <div className="min-h-screen w-full px-6 py-8 bg-gradient-to-br from-[#8589EB] to-[#A3ABFF]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">Today</h2>
          <p className="text-sm font-semibold text-purple-100">{todayFormatted}</p>
        </div>

        {tasks['daily-reflection'] && (
          <motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4 }}>
            <HomepageCard
              title={tasks['daily-reflection'].title}
              description={todayFormatted}
              preview={tasks['daily-reflection'].content}
              icon={<FiEdit3 />}
              type="daily-reflection"
              assignedTaskId={tasks['daily-reflection'].assignedTaskId}
              route="/task/daily-reflection"
              background="bg-[#D9A4D1] shadow-md text-white"
              sticker={pink}
              onClick={() => handleCardClick('daily-reflection', tasks['daily-reflection'].assignedTaskId, tasks['daily-reflection'].title, tasks['daily-reflection'].content, '/task/daily-reflection')}
            />
          </motion.div>
        )}

        {tasks['daily-challenge'] && (
          <motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <HomepageCard
              title="Daily Challenge"
              description={todayFormatted}
              preview={tasks['daily-challenge'].content}
              icon={<FiCamera />}
              type="daily-challenge"
              assignedTaskId={tasks['daily-challenge'].assignedTaskId}
              route="/task/daily-challenge"
              background="bg-[#6D75B0] shadow-md text-white"
              sticker={sleeping}
              onClick={() => handleCardClick('daily-challenge', tasks['daily-challenge'].assignedTaskId, 'Daily Challenge', tasks['daily-challenge'].content, '/task/daily-challenge')}
            />
          </motion.div>
        )}

        <motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <HomepageCard
            title="Daily Check-in"
            description="How are you feeling today?"
            icon={<FiSmile />}
            type="mood"
            route="/task/mood"
            background="bg-[#A6D4E0] backdrop-blur-md border border-white/10 shadow-md text-white"
            sticker={green}
            onClick={() => navigate('/task/mood', { state: { type: 'mood' } })}
          />
        </motion.div>

        <motion.div className="mb-24" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <div className="rounded-3xl px-6 py-5 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 text-white shadow-lg">
            <blockquote className="italic text-lg text-center font-light">
              “Be happy in the moment, that’s enough. Each moment is all we need, not more.”
            </blockquote>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {isFabOpen && (
          <div className="flex gap-3 transition-all duration-300">
            <button onClick={() => navigate('/task/journal', { state: { type: 'journal' } })} className="bg-[#8576FF] text-white p-3 rounded-full shadow-lg hover:opacity-90 transition">
              <FiEdit3 className="text-xl" />
            </button>
            <button onClick={() => navigate('/task/photo', { state: { type: 'photo' } })} className="bg-[#8576FF] text-white p-3 rounded-full shadow-lg hover:opacity-90 transition">
              <FiCamera className="text-xl" />
            </button>
            <button onClick={() => navigate('/task/mood', { state: { type: 'mood' } })} className="bg-[#8576FF] text-white p-3 rounded-full shadow-lg hover:opacity-90 transition">
              <FiSmile className="text-xl" />
            </button>
          </div>
        )}
        <button onClick={() => setIsFabOpen(!isFabOpen)} className="bg-[#8576FF] text-white p-4 rounded-full shadow-xl hover:opacity-90 transition">
          {isFabOpen ? <FiX className="text-xl" /> : <FiPlus className="text-xl" />}
        </button>
      </div>
    </div>
  );
};

export default Home;
