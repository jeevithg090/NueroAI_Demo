import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { adhdChunks } from '../data/chapters';
import { ModalitySwitch } from '../components/learning/ModalitySwitch';
import { ArrowLeft, Target, Timer } from 'lucide-react';
import clsx from 'clsx';

export default function LearnADHD() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [chunkIndex, setChunkIndex] = useState(0);
  const [xp, setXp] = useState(240);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isConfused, setIsConfused] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  const chunk = adhdChunks[chunkIndex];

  useEffect(() => {
    if (isFocusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
  }, [isFocusMode]);

  const handleOptionSelect = (evt, idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    if (idx === chunk.quickCheck.correct) {
      const rect = evt.target.getBoundingClientRect();
      confetti({
        particleCount: 80,
        spread: 70,
        colors: ['#F59E0B', '#FCD34D'],
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
      });
      setXp(prev => prev + chunk.xpReward);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (chunkIndex < adhdChunks.length - 1) {
      setChunkIndex(prev => prev + 1);
    } else {
      navigate('/student');
    }
  };

  return (
    <div className={clsx("min-h-screen bg-[#0D0F1A] transition-all duration-700", isFocusMode && "overflow-hidden")}>
      {/* Top Bar */}
      <motion.header 
         animate={{ opacity: isFocusMode ? 0 : 1, y: isFocusMode ? -50 : 0 }}
         className="fixed top-0 left-0 right-0 h-16 bg-[#1C1F35] border-b border-[#2A2D45] flex items-center justify-between px-6 z-40"
      >
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/student')} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft size={20} /></button>
            <span className="font-medium text-[#8B91C7]">Chapter 4 · Chunk {chunkIndex + 1}/{adhdChunks.length}</span>
         </div>
         <div className="flex items-center gap-6 font-mono font-bold">
            <span className="text-[#8B91C7] font-medium hidden md:inline"><Timer size={16} className="inline mr-1" /> 18:32 <span className="text-xs">remaining</span></span>
            <span className="text-[#F59E0B]">⭐ {xp} XP</span>
            <span className="text-orange-500 hidden sm:inline">🔥 4 Streak</span>
            <button onClick={() => setIsFocusMode(true)} className="flex items-center gap-2 bg-[#2D2010] text-[#F59E0B] px-4 py-1.5 rounded-full border border-[#78450A] hover:bg-[#F59E0B] hover:text-white transition-colors">
               Focus Mode <Target size={16} />
            </button>
         </div>
      </motion.header>

      {/* Progress */}
      <motion.div animate={{ opacity: isFocusMode ? 0 : 1 }} className="fixed top-16 left-0 right-0 h-1 bg-[#2A2D45] z-40">
         <motion.div 
           className="h-full bg-[#F59E0B]"
           initial={{ width: 0 }}
           animate={{ width: `${((chunkIndex) / adhdChunks.length) * 100}%` }}
           transition={{ duration: 0.5 }}
         />
      </motion.div>

      {/* Mascot (Hidden in focus mode) */}
      <motion.div 
        animate={{ opacity: isFocusMode ? 0 : 1, y: isFocusMode ? 50 : 0 }}
        className="fixed top-24 right-8 z-30 flex flex-col items-end hidden md:flex"
      >
         <motion.div 
           animate={{ y: [0, -8, 0] }} 
           transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
           className="bg-[#2D2010] border border-[#78450A] text-[#F59E0B] px-4 py-3 rounded-2xl rounded-tr-sm mb-4 shadow-xl max-w-[200px] text-sm font-bold leading-tight"
         >
           You're doing great! {adhdChunks.length - chunkIndex} more to go! 🚀
         </motion.div>
         <div className="w-16 h-16 bg-[#F59E0B] rounded-3xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            ⚡
         </div>
      </motion.div>

      {/* Main Content Area */}
      <main className={clsx(
         "pt-32 pb-32 px-6 max-w-3xl mx-auto transition-all duration-700 relative",
         isFocusMode && "pt-[20vh] !max-w-2xl"
      )}>
         <AnimatePresence mode="wait">
            <motion.div
               key={chunkIndex}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
               {isFocusMode && (
                  <div className="absolute top-4 right-4 text-[#8B91C7] flex items-center gap-2 font-mono text-sm">
                     <Timer size={14} /> 12:45
                  </div>
               )}
               <div className="flex items-center gap-4 mb-6">
                  <span className="bg-[#1C1F35] text-[#8B91C7] font-bold px-3 py-1 rounded-full text-sm">#{chunk.id}</span>
                  <span className="text-[#8B91C7] text-sm font-medium">⏱ ~{chunk.estimatedMinutes} min read</span>
               </div>
               
               <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  {chunk.title}
               </h1>
               
               <div className="text-xl md:text-2xl leading-relaxed text-[#F0F2FF] mb-12">
                 {chunk.content.split(new RegExp(`(${chunk.keyTerms.join('|')})`, 'gi')).map((part, i) => {
                    const isTerm = chunk.keyTerms.some(t => t.toLowerCase() === part.toLowerCase());
                    return isTerm ? (
                       <span key={i} className="text-[#F59E0B] font-bold bg-[#2D2010] px-2 rounded">{part}</span>
                    ) : (
                       <span key={i}>{part}</span>
                    )
                 })}
               </div>

               {!isFocusMode && (
                  <div className="bg-[#1C1F35] rounded-3xl p-6 border border-[#2A2D45] mt-12">
                     <h3 className="font-bold mb-6 text-[#8B91C7] text-sm uppercase tracking-wider">Quick Check</h3>
                     <p className="text-xl font-medium mb-6">{chunk.quickCheck.question}</p>
                     <div className="grid gap-3">
                        {chunk.quickCheck.options.map((opt, i) => {
                           const isCorrect = i === chunk.quickCheck.correct;
                           const isSelected = selectedOption === i;
                           let style = "bg-[#2A2D45] border-[#4F547A] hover:border-[#8B91C7]";
                           if (selectedOption !== null) {
                              if (isCorrect) style = "bg-[#064E3B] border-[#10B981] text-[#10B981]";
                              else if (isSelected) style = "bg-[#7F1D1D] border-[#EF4444] text-[#EF4444]";
                              else style = "opacity-50 pointer-events-none bg-[#2A2D45] border-[#4F547A]";
                           }

                           return (
                              <button 
                                 key={i} 
                                 onClick={(e) => handleOptionSelect(e, i)}
                                 disabled={selectedOption !== null}
                                 className={`p-4 rounded-xl text-left font-medium border-2 transition-all ${style}`}
                              >
                                 {opt}
                              </button>
                           )
                        })}
                     </div>
                  </div>
               )}
            </motion.div>
         </AnimatePresence>
      </main>

      {/* Confused / Next Bottom Bar */}
      {!isFocusMode && (
         <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0D0F1A] to-transparent pointer-events-none flex justify-between items-end max-w-5xl mx-auto z-30">
            <button 
               onClick={() => setIsConfused(true)}
               className="pointer-events-auto bg-[#1C1F35] border border-[#2A2D45] text-[#8B91C7] hover:text-white px-6 py-3 rounded-full font-semibold transition-colors flex gap-2 items-center"
            >
               😕 I'm confused
            </button>
            <AnimatePresence>
               {selectedOption !== null && (
                  <motion.button 
                     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                     onClick={handleNext}
                     className="pointer-events-auto bg-[#F59E0B] text-black px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform"
                  >
                     Got it! Next →
                  </motion.button>
               )}
            </AnimatePresence>
         </div>
      )}

      {/* Focus Mode Exit overlay hint */}
      {isFocusMode && (
         <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
            <button 
              onClick={() => setIsFocusMode(false)}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full backdrop-blur-md text-sm font-medium transition-colors"
            >
               Exit Focus Mode
            </button>
         </div>
      )}

      <ModalitySwitch isOpen={isConfused} onClose={() => setIsConfused(false)} />
    </div>
  );
}
