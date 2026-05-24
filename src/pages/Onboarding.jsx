import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/onboardingQuestions';
import { generateProfile, saveProfile } from '../utils/profileUtils';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [vector, setVector] = useState([0,0,0]);

  const handleSelect = (qId, value) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        setAnalyzing(true);
        const profile = generateProfile(newAnswers);
        saveProfile(profile);
        
        // fake analyze animation
        setTimeout(() => setVector([profile.vector[0], 0, 0]), 300);
        setTimeout(() => setVector([profile.vector[0], profile.vector[1], 0]), 600);
        setTimeout(() => setVector(profile.vector), 900);
        
        setTimeout(() => {
          navigate('/student');
        }, 3000);
      }
    }, 400);
  };

  const progress = ((currentQ) / questions.length) * 100;

  if (analyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
         >
           <h2 className="font-display text-3xl mb-8">Analysing your profile...</h2>
           <div className="flex gap-4 items-end justify-center mb-8 h-32">
             {[0, 1, 2].map((i) => (
                <motion.div 
                  key={i}
                  className="w-16 bg-[#818CF8] rounded-t-lg"
                  initial={{ height: 0 }}
                  animate={{ height: vector[i] * 120 + 10 }}
                  transition={{ type: 'spring', damping: 20 }}
                />
             ))}
           </div>
           <p className="text-[#8B91C7] font-mono">
             [ {vector.map(v => v.toFixed(2)).join(', ')} ]
           </p>
         </motion.div>
      </div>
    )
  }

  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col relative overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-[#2A2D45] w-full fixed top-0">
        <motion.div 
          className="h-full bg-[#818CF8]" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <div className="text-center mb-12">
              <span className="text-4xl block mb-4">{q.icon}</span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">{q.question}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(q.id, opt.value)}
                    className={`p-6 md:p-8 rounded-2xl border text-left text-lg font-medium transition-all ${
                      isSelected 
                        ? 'border-[#818CF8] bg-[#818CF8]/10' 
                        : 'border-[#2A2D45] bg-[#1C1F35] hover:border-[#8B91C7]'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
