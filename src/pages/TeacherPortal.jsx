import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, File, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { adhdChunks, asdChunks, dyslexiaChunks } from '../data/chapters';

export default function TeacherPortal() {
  const [pipelineState, setPipelineState] = useState('idle'); // idle, uploading, processing, done
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('adhd');

  const steps = [
    { label: 'Parsing PDF', duration: 800 },
    { label: 'Extracting concepts', duration: 1200 },
    { label: 'Generating ADHD mode', duration: 1500 },
    { label: 'Generating ASD mode', duration: 1500 },
    { label: 'Generating Dyslexia mode', duration: 1500 },
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    startPipeline();
  };

  const startPipeline = () => {
    setPipelineState('processing');
    let delay = 0;
    
    steps.forEach((step, idx) => {
      delay += step.duration;
      setTimeout(() => {
        setCurrentStep(idx + 1);
        if (idx === steps.length - 1) {
          setTimeout(() => setPipelineState('done'), 500);
        }
      }, delay);
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] p-6 pt-12 max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold mb-4">Teacher Portal</h1>
        <p className="text-[#8B91C7] text-xl">Transform any curriculum into three adaptive formats instantly.</p>
      </header>

      {pipelineState === 'idle' && (
         <div className="max-w-2xl mx-auto">
            <div className="flex gap-4 mb-8">
               <select className="bg-[#1C1F35] border border-[#2A2D45] rounded-xl px-4 py-3 flex-1 text-white outline-none focus:border-[#818CF8]">
                  <option>Science</option>
                  <option>Mathematics</option>
               </select>
               <select className="bg-[#1C1F35] border border-[#2A2D45] rounded-xl px-4 py-3 flex-1 text-white outline-none focus:border-[#818CF8]">
                  <option>Class 7</option>
                  <option>Class 8</option>
               </select>
               <select className="bg-[#1C1F35] border border-[#2A2D45] rounded-xl px-4 py-3 flex-1 text-white outline-none focus:border-[#818CF8]">
                  <option>NCERT</option>
                  <option>State Board</option>
               </select>
            </div>

            <div 
               onDragOver={(e) => e.preventDefault()} 
               onDrop={handleDrop}
               onClick={startPipeline}
               className="border-2 border-dashed border-[#2A2D45] hover:border-[#818CF8] bg-[#1C1F35]/50 rounded-3xl p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
            >
               <div className="w-20 h-20 bg-[#818CF8]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileUp size={40} className="text-[#818CF8]" />
               </div>
               <h3 className="text-2xl font-bold mb-2">Drag your NCERT PDF here</h3>
               <p className="text-[#8B91C7] mb-8">or click to browse files</p>
               <div className="flex gap-4 text-sm text-[#4F547A] font-medium">
                  <span>Supports: PDF, DOCX</span>
                  <span>•</span>
                  <span>Max size: 50MB</span>
               </div>
            </div>
         </div>
      )}

      {pipelineState === 'processing' && (
         <div className="max-w-xl mx-auto bg-[#1C1F35] border border-[#2A2D45] rounded-3xl p-8 shadow-2xl">
            <h3 className="font-display text-2xl font-bold mb-8 text-center pb-6 border-b border-[#2A2D45]">
               Transformation Pipeline
            </h3>
            <div className="space-y-6 lg:px-8">
               {steps.map((step, idx) => {
                  const isDone = currentStep > idx;
                  const isCurrent = currentStep === idx;
                  const opacity = isDone ? 'opacity-100' : isCurrent ? 'opacity-100' : 'opacity-30';
                  
                  return (
                     <div key={idx} className={`flex items-center justify-between ${opacity} transition-opacity duration-300`}>
                        <span className="font-medium text-lg">{idx + 1}. {step.label}</span>
                        {isDone ? (
                           <CheckCircle2 size={24} className="text-[#34D399]" />
                        ) : isCurrent ? (
                           <Loader2 size={24} className="text-[#818CF8] animate-spin" />
                        ) : (
                           <div className="w-6 h-6 rounded-full border-2 border-[#4F547A]" />
                        )}
                     </div>
                  )
               })}
            </div>
         </div>
      )}

      {pipelineState === 'done' && (
         <div className="fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-8 border-b border-[#2A2D45] pb-4">
               <div>
                  <div className="flex items-center gap-2 text-[#34D399] font-bold mb-2">
                     <CheckCircle2 size={20} /> Successfully generated 6 chunks
                  </div>
                  <h2 className="font-display text-3xl font-bold">Chapter 4: Digestive System</h2>
               </div>
               <div className="flex gap-4 mt-4 sm:mt-0">
                  <button className="text-[#818CF8] font-bold hover:underline px-4 py-2">Download ZIP</button>
                  <button onClick={() => setPipelineState('idle')} className="bg-[#818CF8] hover:bg-[#6366f1] text-white px-6 py-2 rounded-full font-bold transition-colors flex items-center gap-2">
                     Assign to Class 7-A <ArrowRight size={18} />
                  </button>
               </div>
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-[#1C1F35] rounded-xl w-fit border border-[#2A2D45]">
               {['adhd', 'asd', 'dyslexia'].map(mode => (
                  <button 
                     key={mode}
                     onClick={() => setActiveTab(mode)}
                     className={`px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === mode ? 'bg-[#2A2D45] text-white' : 'text-[#8B91C7] hover:text-white'}`}
                  >
                     {mode} Output
                  </button>
               ))}
            </div>

            <div className="bg-[#1C1F35] border border-[#2A2D45] rounded-3xl p-8 min-h-[400px]">
               {activeTab === 'adhd' && (
                  <div className="max-w-2xl">
                     <div className="flex gap-2 mb-4">
                        {adhdChunks[0].keyTerms.map(t => <span key={t} className="bg-[#2D2010] text-[#F59E0B] text-xs font-bold px-2 py-1 rounded">{t}</span>)}
                     </div>
                     <h3 className="font-display text-4xl font-bold mb-6 text-[#F59E0B]">{adhdChunks[0].title}</h3>
                     <p className="text-xl leading-relaxed text-gray-300 mb-8">{adhdChunks[0].content}</p>
                     <div className="bg-[#0D0F1A] border border-[#2A2D45] p-6 rounded-xl">
                        <p className="font-bold text-[#8B91C7] text-sm uppercase mb-3">Generated Quiz</p>
                        <p className="font-medium mb-3">{adhdChunks[0].quickCheck.question}</p>
                        <ul className="list-disc pl-5 text-gray-400 space-y-1">
                           {adhdChunks[0].quickCheck.options.map((o,i) => <li key={i}>{o}</li>)}
                        </ul>
                     </div>
                  </div>
               )}
               {activeTab === 'asd' && (
                  <div className="max-w-2xl">
                     <div className="flex gap-2 mb-4">
                        <span className="bg-[#0D1E35] text-[#60A5FA] text-xs font-bold px-2 py-1 rounded">Literal Language</span>
                        <span className="bg-[#0D1E35] text-[#60A5FA] text-xs font-bold px-2 py-1 rounded">No Metaphors</span>
                     </div>
                     <h3 className="font-display text-3xl font-bold mb-6 text-[#60A5FA]">{asdChunks[0].title}</h3>
                     <p className="text-xl leading-relaxed text-gray-300 mb-8">{asdChunks[0].content}</p>
                     <div className="bg-[#0D0F1A] border border-[#2A2D45] p-6 rounded-xl">
                        <p className="font-bold text-[#8B91C7] text-sm uppercase mb-3">Generated Visual</p>
                        <p className="font-medium text-2xl">{asdChunks[0].visual.emoji} {asdChunks[0].visual.label}</p>
                     </div>
                  </div>
               )}
               {activeTab === 'dyslexia' && (
                  <div className="max-w-2xl dyslexia-mode">
                     <h3 className="font-display text-3xl font-bold mb-6 text-[#34D399]">{dyslexiaChunks[0].title}</h3>
                     <p className="text-xl text-gray-300 mb-8">{dyslexiaChunks[0].content}</p>
                  </div>
               )}
            </div>
         </div>
      )}

    </div>
  );
}
