import React from 'react';
import HomepageCard from '../components/HomepageCard';
import { useNavigate } from 'react-router-dom';
import { Plus, ImagePlus, Smile, FileText } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen text-white px-8 py-4 relative">
      {/* Date Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold italic">Today</h2>
        <p className="text-sm font-semibold text-purple-100">{today}</p>
      </div>

      {/* Daily Reflection Card */}
      <div className="mb-4">
        <HomepageCard
          title="TRUTH"
          description="Every Tuesday, speak your truth"
          icon="🧠"
          type="daily-reflection"
          route="/task/daily-reflection"
          preview="I believe true leadership means _______."
          background="bg-[#7c83de] text-purple-800"
        />
      </div>

      {/* Daily Challenge Card */}
      <div className="mb-4">
        <HomepageCard
          title="Daily Challenge"
          description={today}
          icon="🏔️"
          type="daily-challenge"
          route="/task/daily-challenge"
          background="bg-purple-700"
          
        />
      </div>

      {/* Daily Check-in Card */}
      <div className="mb-4">
        <HomepageCard
          title="Daily Check-in"
          description="How are you feeling today?"
          icon="😊"
          type="mood"
          route="/task/mood"
          background="bg-[#a974d2]"  // light purple (you can change)
       />
      </div>


      {/* Motivational Quote */}
      <div className="mb-24">
        <div className="rounded-3xl p-5 bg-purple-300 text-white shadow-md">
          <blockquote className="italic text-center">
            “Be happy in the moment, that’s enough. Each moment is all we need, not more.”
          </blockquote>
        </div>
      </div>



      {/* Floating Add Buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-white text-purple-600 rounded-full p-4 shadow-lg">
          <div className="flex gap-4 items-center">
            <button onClick={() => navigate('/task/photo', { state: { type: 'photo' } })}>
              <ImagePlus size={24} />
            </button>
            <button onClick={() => navigate('/task/mood', { state: { type: 'mood' } })}>
              <Smile size={24} />
            </button>
            <button onClick={() => navigate('/task/journal', { state: { type: 'journal' } })}>
              <FileText size={24} />
            </button>
            <button className="bg-purple-600 text-white p-2 rounded-full" disabled>
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
