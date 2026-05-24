import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X } from 'lucide-react';

export function ModalitySwitch({ isOpen, onClose, currentMode, chunkId }) {
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setThinking(true);
      const timer = setTimeout(() => {
        setThinking(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 200 }}
          className="fixed inset-0 bg-[#0D0F1A]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
             <X size={24} />
          </button>

          {thinking ? (
             <div className="flex flex-col items-center gap-6">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                   <BrainCircuit size={64} className="text-[#F59E0B]" />
                </motion.div>
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-mono text-xl"
                >
                   Switching modality...
                </motion.p>
             </div>
          ) : (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-2xl w-full text-center"
             >
                <h2 className="font-display text-4xl mb-4">No worries! Let's try this.</h2>
                <p className="text-[#8B91C7] text-lg mb-12">I've generated a visual diagram instead of text.</p>
                
                <div className="bg-[#1C1F35] border border-[#2A2D45] rounded-3xl p-8 flex flex-col items-center gap-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <BrainCircuit size={120} />
                   </div>
                   
                   <div className="flex flex-col items-center gap-4 z-10 w-full relative">
                      {['👄 Mouth (Saliva)', '⏬ Oesophagus (Peristalsis)', '🫙 Stomach (Acids)'].map((step, i) => (
                         <motion.div
                           key={i}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.3 }}
                           className="bg-[#2A2D45] px-6 py-4 rounded-xl w-full max-w-sm border border-[#4F547A] font-bold text-lg"
                         >
                            {step}
                         </motion.div>
                      ))}
                      <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[#8B91C7]">
                          ↓
                      </motion.div>
                      <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.9 }}
                         className="bg-[#2A2D45] px-6 py-4 rounded-xl w-full max-w-sm border border-[#4F547A] font-bold text-lg"
                      >
                         🩸 Bloodstream (Energy)
                      </motion.div>
                   </div>
                </div>

                <div className="mt-12 flex justify-center">
                   <button onClick={onClose} className="bg-white text-black px-8 py-3 rounded-full font-bold">
                      Got it now!
                   </button>
                </div>
             </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
