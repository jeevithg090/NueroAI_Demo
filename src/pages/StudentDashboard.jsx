import { useEffect, useState } from 'react';
import { loadProfile } from '../utils/profileUtils';
import { chapters } from '../data/chapters';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) navigate('/onboarding');
    setProfile(p);
  }, [navigate]);

  if (!profile) return null;

  const modeColors = {
    adhd: 'bg-[#F59E0B] text-white',
    asd: 'bg-[#60A5FA] text-white',
    dyslexia: 'bg-[#34D399] text-[#0A2419]',
  };

  const modeBorders = {
    adhd: 'border-[#F59E0B]',
    asd: 'border-[#60A5FA]',
    dyslexia: 'border-[#34D399]',
  };

  const continueChapter = chapters[0];

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto pt-10">
      <header className="flex justify-between items-center mb-12">
        <h1 className="font-display text-4xl font-bold">Hi, {profile.name || 'Student'} 👋</h1>
        <div className="flex items-center gap-3">
           <div className={`px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider ${modeColors[profile.recommendedMode]}`}>
             {profile.recommendedMode} Mode
           </div>
           <div className="flex gap-1">
             {profile.vector.map((v, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8B91C7]" style={{ opacity: v + 0.2 }} />
             ))}
           </div>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-[#8B91C7] text-lg mb-4">Continue where you left off</h2>
        <motion.div 
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate(`/learn/${profile.recommendedMode}/${continueChapter.id}`)}
          className={`bg-[#1C1F35] border-l-4 ${modeBorders[profile.recommendedMode]} rounded-r-2xl rounded-l-md p-6 md:p-8 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg`}
        >
          <div>
            <div className="text-[#8B91C7] text-sm font-medium mb-1">{continueChapter.class} {continueChapter.subject} · {continueChapter.board}</div>
            <h3 className="font-display text-2xl font-bold mb-4">{continueChapter.title}</h3>
            
            <div className="flex items-center gap-4 text-sm w-full md:w-80">
               <div className="flex-1 bg-[#141628] rounded-full h-2">
                 <div className="bg-white h-2 rounded-full" style={{ width: `${continueChapter.progress}%` }} />
               </div>
               <span className="font-mono text-[#8B91C7]">{continueChapter.progress}%</span>
            </div>
          </div>
          
          <div className={`px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 ${modeColors[profile.recommendedMode]} opacity-90 hover:opacity-100`}>
            Continue in {profile.recommendedMode.toUpperCase()} <BookOpen size={18} />
          </div>
        </motion.div>
      </section>

      <section>
        <h2 className="text-[#8B91C7] text-lg mb-4">All Chapters — adapted for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {chapters.slice(1).map((ch, i) => (
              <motion.div 
                key={ch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/learn/${profile.recommendedMode}/${ch.id}`)}
                className="bg-[#1C1F35] border border-[#2A2D45] rounded-2xl p-6 cursor-pointer hover:border-[#4F547A] transition-colors flex flex-col"
              >
                <div className="text-[#8B91C7] text-xs font-medium mb-2">{ch.class} {ch.subject}</div>
                <h4 className="font-display text-lg font-bold mb-6 flex-1">{ch.title}</h4>
                <div className="flex justify-between items-center border-t border-[#2A2D45] pt-4">
                  <span className="text-[#8B91C7] text-sm flex items-center gap-1">
                    ⏱ {ch.estimatedTime[profile.recommendedMode]}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#141628] border ${modeBorders[profile.recommendedMode]} text-white`}>
                    {profile.recommendedMode}
                  </span>
                </div>
              </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
}
