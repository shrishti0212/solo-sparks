import React from 'react';
import { useParams } from 'react-router-dom';

import DailyReflectionForm from '../components/reflections/DailyReflectionForm';
import DailyChallengeForm from '../components/reflections/DailyChallengeForm';
import MoodForm from '../components/reflections/MoodForm';
import PhotoForm from '../components/reflections/PhotoForm';
import JournalForm from '../components/reflections/JournalForm';

const TaskPage = () => {
  const { type } = useParams();

  const renderForm = () => {
    switch (type) {
      case 'daily-reflection':
        return <DailyReflectionForm />;
      case 'daily-challenge':
        return <DailyChallengeForm />;
      case 'mood':
        return <MoodForm />;
      case 'photo':
        return <PhotoForm />;
      case 'journal':
        return <JournalForm />;
      default:
        return <p className="text-center mt-10">Invalid task type: {type}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {renderForm()}
    </div>
  );
};

export default TaskPage;
