import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { asdChunks } from '../data/chapters';
import { ModalitySwitch } from '../components/learning/ModalitySwitch';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

export default function LearnASD() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [chunkIndex, setChunkIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isConfused, setIsConfused] = useState(false);
  
  const chunk = asdChunks[chunkIndex];

  const handleNext = () => {
    setSelectedOption(null);
    if (chunkIndex < asdChunks.length - 1) {
      setChunkIndex(prev => prev + 1);
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F1A]">
      {/* Top Bar - Never moves */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#141628] border-b border-[#2A2D45] flex items-center justify-between px-6 z-40">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/student')} className="p-2 hover:bg-[#2A2D45] rounded"><ArrowLeft size={20} /></button>
            <span className="font-medium text-[#F0F2FF]">Chapter 4 · Section {chunkIndex + 1} of {asdChunks.length}</span>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#0D1E35] border border-[#1E4A7A] px-3 py-1.5 rounded-md text-[#60A5FA] text-sm">
               <span className="mr-2">🔵</span> Nila is here to help
            </div>
            <button className="text-[#8B91C7] hover:text-white px-3 py-1.5 text-sm">🔇 Quiet mode</button>
         </div>
      </header>

      {/* Progress Bar - Simple */}
      <div className="fixed top-16 left-0 right-0 h-2 bg-[#1C1F35] z-40">
         <div 
           className="h-full bg-[#60A5FA]"
           style={{ width: `${((chunkIndex) / asdChunks.length) * 100}%` }}
         />
      </div>

      <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto flex gap-10 h-full">
         
         {/* Left Agent (always visible, no layout shift) */}
         <aside className="w-64 hidden lg:flex flex-col shrink-0">
             <div className="bg-[#141628] p-6 border border-[#2A2D45] rounded-xl flex flex-col items-center text-center sticky top-24">
                <div className="w-24 h-24 bg-gradient-to-b from-[#1E4A7A] to-[#0D1E35] rounded-full mb-6 border-4 border-[#60A5FA] flex items-center justify-center text-4xl">
                   🔵
                </div>
                <h3 className="font-bold text-lg mb-2">Nila</h3>
                <p className="text-[#60A5FA] text-sm font-medium mb-4">Right now we are learning about:<br/>{chunk.title.toLowerCase()}</p>
                <div className="w-full h-px bg-[#2A2D45] mb-4" />
                <p className="text-[#8B91C7] text-sm">{chunk.nextPreview}</p>
             </div>
         </aside>

         {/* Main Content Area */}
         <main className="flex-1 max-w-3xl">
            <div className="bg-[#1C1F35] border border-[#2A2D45] rounded-xl p-8 lg:p-12 mb-8">
               <h1 className="font-display text-3xl font-semibold mb-8 text-[#F0F2FF]">
                  {chunk.title}
               </h1>
               <div className="text-xl leading-relaxed text-[#F0F2FF] space-y-6">
                  {chunk.content}
               </div>

               {/* Simple visual */}
               <div className="mt-10 bg-[#141628] p-6 rounded-lg border border-[#2A2D45] flex items-center gap-6">
                  <span className="text-5xl">{chunk.visual.emoji}</span>
                  <span className="text-[#8B91C7] font-medium">{chunk.visual.label}</span>
               </div>
            </div>

            {/* Check */}
            <div className="bg-[#141628] border border-[#2A2D45] rounded-xl p-8">
               <h3 className="text-lg font-medium mb-6">{chunk.confirmQuestion}</h3>
               <div className="grid gap-3">
                  {chunk.options.map((opt, i) => {
                     const isCorrect = i === chunk.correct;
                     const isSelected = selectedOption === i;
                     let style = "bg-[#1C1F35] border-[#2A2D45]";
                     if (selectedOption !== null) {
                        if (isCorrect) style = "bg-[#0D1E35] border-[#60A5FA] text-[#60A5FA]";
                        else if (isSelected) style = "bg-[#3f1616] border-[#EF4444] text-[#EF4444]";
                        else style = "opacity-50 pointer-events-none bg-[#1C1F35] border-[#2A2D45]";
                     }

                     return (
                        <button 
                           key={i} 
                           onClick={() => { if(selectedOption === null) setSelectedOption(i) }}
                           className={`p-4 rounded-lg text-left font-medium border-2 transition-none ${style}`}
                        >
                           {opt}
                        </button>
                     )
                  })}
               </div>
            </div>
         </main>

         {/* Right Sidebar - Visual Schedule */}
         <aside className="w-72 hidden xl:block shrink-0">
            <div className="bg-[#141628] p-6 border border-[#2A2D45] rounded-xl sticky top-24">
               <h3 className="font-bold text-[#8B91C7] mb-6 uppercase text-sm tracking-wider">Schedule</h3>
               <ul className="space-y-4">
                  {asdChunks.map((c, i) => {
                     let status = 'upcoming';
                     if (i < chunkIndex) status = 'done';
                     if (i === chunkIndex) status = 'current';

                     return (
                        <li key={i} className="flex items-start gap-3">
                           {status === 'done' && <CheckCircle2 size={20} className="text-[#34D399] mt-0.5 shrink-0" />}
                           {status === 'current' && <span className="text-[#60A5FA] font-bold shrink-0 w-5">→</span>}
                           {status === 'upcoming' && <Circle size={20} className="text-[#4F547A] mt-0.5 shrink-0" />}
                           
                           <span className={`font-medium ${status === 'current' ? 'text-[#60A5FA]' : status === 'done' ? 'text-[#8B91C7]' : 'text-[#4F547A]'}`}>
                              {c.title}
                           </span>
                        </li>
                     )
                  })}
               </ul>
            </div>
         </aside>

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#141628] border-t border-[#2A2D45] p-4 flex justify-end items-center px-12 z-40 gap-4">
         <button onClick={() => setIsConfused(true)} className="text-[#8B91C7] hover:text-white px-6 py-2 rounded font-medium">
            😕 I don't understand
         </button>
         <button 
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`px-8 py-3 rounded font-bold transition-none ${selectedOption !== null ? 'bg-[#60A5FA] text-[#0D1F35] hover:bg-[#93C5FD]' : 'bg-[#2A2D45] text-[#8B91C7] cursor-not-allowed'}`}
         >
            I understand. Next →
         </button>
      </div>

      <ModalitySwitch isOpen={isConfused} onClose={() => setIsConfused(false)} />
    </div>
  );
}
