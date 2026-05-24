import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BrainCircuit, Activity, Eye, AudioLines, GraduationCap, Building2 } from 'lucide-react';
import { saveProfile } from '../utils/profileUtils';
import { demoProfiles } from '../data/profiles';

export default function Landing() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, tts: 600, langs: 0 });

  useEffect(() => {
    let frame;
    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      setStats({
        students: Math.floor(easeProgress * 250),
        tts: Math.floor(600 - (easeProgress * 200)),
        langs: Math.floor(easeProgress * 20),
      });

      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const words = ["One platform.", "Three adaptive engines.", "Zero re-onboarding."];

  const handleStartDemo = (mode) => {
    import('../utils/profileUtils').then(({ saveProfile }) => {
        import('../data/profiles').then(({ demoProfiles }) => {
            saveProfile(demoProfiles[mode]);
            navigate('/student');
        });
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_20%_50%,_#1a1060_0%,_transparent_60%),radial-gradient(ellipse_at_80%_20%,_#0a2040_0%,_transparent_60%)]">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-[#818CF8]" size={28} />
          <span className="font-display font-semibold text-xl tracking-tight">NeuroLearn AI</span>
        </div>
        <button 
          onClick={() => navigate('/onboarding')}
          className="bg-white text-black px-5 py-2.5 rounded-full font-medium hover:bg-white/90 transition-colors"
        >
          Try Demo
        </button>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-8 inline-flex items-center gap-2 border border-white/20"
        >
          <Sparkles size={16} className="text-[#818CF8]" />
          Track 3 · Education · PS1
        </motion.div>

        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="block"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[#8B91C7] text-xl max-w-2xl mx-auto mb-12"
        >
          NCERT curriculum in <span className="text-white">→</span> personalised learning out. Fully offline.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button onClick={() => navigate('/onboarding')} className="bg-[#818CF8] hover:bg-[#6366f1] text-white px-8 py-3.5 rounded-full font-semibold transition-colors shadow-[0_0_20px_rgba(129,140,248,0.3)]">
            Start as Student
          </button>
          <button onClick={() => navigate('/teacher')} className="bg-[#1C1F35] border border-[#2A2D45] hover:bg-[#2A2D45] text-white px-8 py-3.5 rounded-full font-semibold transition-colors flex items-center gap-2">
            <GraduationCap size={18} />
            Teacher Portal
          </button>
          <button onClick={() => navigate('/admin')} className="bg-[#1C1F35] border border-[#2A2D45] hover:bg-[#2A2D45] text-white px-8 py-3.5 rounded-full font-semibold transition-colors flex items-center gap-2">
            <Building2 size={18} />
            Admin
          </button>
        </motion.div>

        {/* Condition Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full max-w-5xl"
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } }
          }}
        >
          {[
            { tag: 'ADHD', mode: 'adhd', icon: Activity, color: '#F59E0B', title: 'Action-Driven', desc: 'Gamified chunking, frequent rewards, and interactive tests.' },
            { tag: 'ASD', mode: 'asd', icon: Eye, color: '#60A5FA', title: 'Predictable & Calm', desc: 'Zero surprises, literal language, and constant structure.' },
            { tag: 'Dyslexia', mode: 'dyslexia', icon: AudioLines, color: '#34D399', title: 'Audio-First', desc: 'Syllabic timing, OpenDyslexic font, and high contrast.' }
          ].map((c) => (
            <motion.div
              key={c.tag}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#1C1F35] border border-[#2A2D45] rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-shadow"
              style={{ '--hover-color': c.color }}
              onClick={() => handleStartDemo(c.mode)}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-2" style={{ backgroundColor: c.color }} />
              <c.icon color={c.color} size={32} className="mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">{c.tag} Engine</h3>
              <p className="text-[#8B91C7] text-sm leading-relaxed mb-4">{c.desc}</p>
              <div className="text-sm font-medium flex items-center gap-1 group-hover:underline" style={{ color: c.color }}>
                Demo as Student →
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.2, duration: 1 }}
           className="mt-20 border-t border-white/10 pt-10 flex flex-wrap justify-center gap-12 text-[#8B91C7]"
        >
          <div className="flex flex-col">
            <span className="font-mono text-3xl text-white font-bold">{stats.students}M+</span>
            <span className="text-sm">Students Supported</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl text-white font-bold">&lt;{stats.tts}ms</span>
            <span className="text-sm">TTS Latency</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl text-white font-bold">{stats.langs}+</span>
            <span className="text-sm">Languages via Bhashini</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl text-white font-bold">₹0</span>
            <span className="text-sm">Inference Cost</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
