import React, { useEffect, useState } from 'react';
import HomepageCard from '../components/HomepageCard';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

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
        await API.post('/assignedTask/assign'); // assign if not already
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
        // Go to edit page if exists
        navigate(`/reflection/${type === 'daily-challenge' ? 'challenge' : 'daily'}/${existing._id}`, {
          state: { assignedTaskId, title, content },
        });
      } else {
        // Go to create page
        navigate(route, {
          state: { assignedTaskId, title, content },
        });
      }
    } catch (err) {
      navigate(route, {
        state: { assignedTaskId, title, content },
      });
    }
  };

  return (
    <div className="min-h-screen w-full px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Date Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">Today</h2>
          <p className="text-sm font-semibold text-purple-100">{todayFormatted}</p>
        </div>

        {/* Daily Reflection Card */}
        {tasks['daily-reflection'] && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            <HomepageCard
              title={tasks['daily-reflection'].title}
              description={todayFormatted}
              preview={tasks['daily-reflection'].content}
              icon="🧠"
              type="daily-reflection"
              assignedTaskId={tasks['daily-reflection'].assignedTaskId}
              route="/task/daily-reflection"
              background="bg-white bg-opacity-20 backdrop-blur-md border border-white/10 shadow-md text-white"
              onClick={() =>
                handleCardClick(
                  'daily-reflection',
                  tasks['daily-reflection'].assignedTaskId,
                  tasks['daily-reflection'].title,
                  tasks['daily-reflection'].content,
                  '/task/daily-reflection'
                )
              }
            />
          </motion.div>
        )}

        {/* Daily Challenge Card */}
        {tasks['daily-challenge'] && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <HomepageCard
              title="Daily Challenge"
              description={todayFormatted}
              icon="🏔️"
              type="daily-challenge"
              assignedTaskId={tasks['daily-challenge'].assignedTaskId}
              route="/task/daily-challenge"
              background="bg-white bg-opacity-20 backdrop-blur-md border border-white/10 shadow-md text-white"
              onClick={() =>
                handleCardClick(
                  'daily-challenge',
                  tasks['daily-challenge'].assignedTaskId,
                  'Daily Challenge',
                  tasks['daily-challenge'].content,
                  '/task/daily-challenge'
                )
              }
            />
          </motion.div>
        )}

        {/* Mood Check-in (Static) */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <HomepageCard
            title="Daily Check-in"
            description="How are you feeling today?"
            icon="😊"
            type="mood"
            route="/task/mood"
            background="bg-white bg-opacity-20 backdrop-blur-md border border-white/10 shadow-md text-white"
            onClick={() => navigate('/task/mood', { state: { type: 'mood' } })}
          />
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-3xl px-6 py-5 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 text-white shadow-lg">
            <blockquote className="italic text-lg text-center font-light">
              “Be happy in the moment, that’s enough. Each moment is all we need, not more.”
            </blockquote>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
