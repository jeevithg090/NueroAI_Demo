import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dyslexiaChunks } from '../data/chapters';
import { ModalitySwitch } from '../components/learning/ModalitySwitch';
import { speakWithHighlight, VoiceAgent } from '../utils/tts';
import { addSyllableDots } from '../utils/syllables';
import { ArrowLeft, Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import clsx from 'clsx';

export default function LearnDyslexia() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [chunkIndex, setChunkIndex] = useState(0);
  const [isConfused, setIsConfused] = useState(false);
  
  const [fontSize, setFontSize] = useState('text-xl');
  const [isDyslexicFont, setIsDyslexicFont] = useState(true);
  const [syllableMode, setSyllableMode] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  
  const chunk = dyslexiaChunks[chunkIndex];
  const words = chunk.content.split(' ');
  const stopAudioRef = useRef(null);
  
  useEffect(() => {
    if (isDyslexicFont) {
        document.body.classList.add('dyslexia-mode');
    } else {
        document.body.classList.remove('dyslexia-mode');
    }
    return () => document.body.classList.remove('dyslexia-mode');
  }, [isDyslexicFont]);

  useEffect(() => {
    return () => {
      if (stopAudioRef.current) stopAudioRef.current();
    }
  }, []);

  const handlePlayToggle = () => {
    if (isPlaying) {
       if (stopAudioRef.current) stopAudioRef.current();
       setIsPlaying(false);
       setHighlightIndex(-1);
    } else {
       setIsPlaying(true);
       stopAudioRef.current = speakWithHighlight(chunk.content, (idx) => {
          setHighlightIndex(idx);
          if (idx === -1) setIsPlaying(false); // ended
       }, 0.8);
    }
  };

  const handleNext = () => {
    if (stopAudioRef.current) stopAudioRef.current();
    setIsPlaying(false);
    setHighlightIndex(-1);
    if (chunkIndex < dyslexiaChunks.length - 1) {
      setChunkIndex(prev => prev + 1);
    } else {
      navigate('/student');
    }
  };

  const processWord = (word, i) => {
    let displayWord = word;
    if (syllableMode) displayWord = addSyllableDots(word);
    
    // strip punctuation for term matching
    const cleanWord = word.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    const isTerm = chunk.keyTerms.some(t => t.toLowerCase() === cleanWord.toLowerCase());

    return (
       <span 
         key={i} 
         className={clsx(
            "transition-colors duration-150 inline-block mr-[0.2em] mb-[0.2em] rounded px-1 -ml-1 cursor-pointer",
            highlightIndex === i ? "bg-[#34D399] text-[#0A2419]" : (isTerm ? "bg-[#0A2419] border-b-2 border-[#34D399] text-[#34D399]" : "")
         )}
         onClick={() => {
            if (isTerm && !isPlaying) {
                const va = new VoiceAgent('dyslexia');
                va.speak(`${cleanWord}. This is a key term.`);
            }
         }}
       >
          {displayWord}
       </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0F1A]">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#0A2419] border-b border-[#0F5A37] flex items-center justify-between px-6 z-40">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/student')} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft size={24} /></button>
            <span className="font-bold text-[#34D399] text-lg">Part {chunkIndex + 1} of {dyslexiaChunks.length}</span>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[#05130D] p-1.5 rounded-lg border border-[#0F5A37]">
               <button onClick={() => setFontSize('text-lg')} className="px-3 py-1 hover:bg-[#34D399]/20 rounded text-sm font-bold text-[#34D399]">A-</button>
               <button onClick={() => setFontSize('text-xl')} className="px-3 py-1 hover:bg-[#34D399]/20 rounded text-base font-bold text-[#34D399]">A</button>
               <button onClick={() => setFontSize('text-3xl')} className="px-3 py-1 hover:bg-[#34D399]/20 rounded text-xl font-bold text-[#34D399]">A+</button>
            </div>
            <button 
               onClick={() => setIsDyslexicFont(!isDyslexicFont)}
               className={clsx("px-4 py-2 rounded font-bold border transition-colors border-[#0F5A37]", isDyslexicFont ? "bg-[#34D399] text-[#0A2419]" : "bg-[#05130D] text-[#34D399]")}
            >
               OpenDyslexic
            </button>
         </div>
      </header>

      <main className="pt-32 pb-40 px-6 max-w-4xl mx-auto flex flex-col items-center">
         
         {/* Voice Agent UI */}
         <div className="w-full bg-[#1C1F35] border border-[#2A2D45] rounded-3xl p-6 mb-12 flex flex-col sm:flex-row items-center gap-6 shadow-lg">
             <div className="w-20 h-20 bg-[#0A2419] border-2 border-[#34D399] rounded-full flex items-center justify-center shrink-0">
                <span className="text-3xl">🎧</span>
             </div>
             <div className="flex-1 text-center sm:text-left">
                <h3 className="font-sans font-bold text-lg mb-1">Sam <span className="text-[#8B91C7] text-sm font-normal">is ready to read</span></h3>
                <div className="flex justify-center sm:justify-start items-center gap-1 h-6">
                   {/* Fake waveform */}
                   {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1.5 bg-[#34D399] rounded-full" style={{ height: isPlaying ? '100%' : '20%', transition: 'height 0.2s', animation: isPlaying ? `waveform 1s infinite ${i * 0.1}s` : 'none' }} />
                   ))}
                </div>
             </div>
             <div className="flex items-center gap-2">
                 <button onClick={handlePlayToggle} className="bg-[#34D399] text-[#0A2419] p-4 rounded-full hover:scale-105 transition-transform flex items-center gap-2 font-bold font-sans">
                    {isPlaying ? <><Pause size={20}/> Pause</> : <><Play size={20}/> Play Text</>}
                 </button>
             </div>
         </div>

         {/* Content Area */}
         <div className="w-full max-w-3xl">
             <h1 className="text-4xl font-bold mb-10 text-[#F0F2FF] border-b border-[#2A2D45] pb-6">
                {chunk.title}
             </h1>
             
             <div className={clsx("text-[#F0F2FF]", fontSize)}>
                {words.map((word, i) => processWord(word, i))}
             </div>
         </div>

         <div className="mt-16 bg-[#05130D] border border-[#0F5A37] p-6 rounded-2xl w-full max-w-3xl flex justify-between items-center">
             <span className="font-sans font-medium text-[#34D399]">Break words into syllables?</span>
             <button onClick={() => setSyllableMode(!syllableMode)} className={clsx("px-6 py-2 rounded-full font-bold transition-colors font-sans", syllableMode ? "bg-[#34D399] text-[#0A2419]" : "bg-[#0A2419] text-[#34D399] border-2 border-[#34D399]")}>
                {syllableMode ? 'ON' : 'OFF'}
             </button>
         </div>

      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0A2419] border-t border-[#0F5A37] flex justify-between items-center z-30 font-sans">
         <button onClick={() => setIsConfused(true)} className="text-[#34D399] hover:bg-[#34D399]/10 px-6 py-3 rounded-full font-bold transition-colors">
            😕 Play that again / Confused
         </button>
         <button onClick={handleNext} className="bg-[#34D399] text-[#0A2419] px-8 py-3 rounded-full font-extrabold text-lg flex items-center gap-2 hover:scale-105 transition-transform">
            Got it! Next →
         </button>
      </div>

      <ModalitySwitch isOpen={isConfused} onClose={() => setIsConfused(false)} />
    </div>
  );
}
