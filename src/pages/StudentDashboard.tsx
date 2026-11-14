import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { loadProfile } from '../utils/profileUtils';
import { chapters } from '../data/chapters';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { MODE_LABELS, type LearningMode } from '../types';

const MotionLink = motion.create(Link);

const modeColors: Record<LearningMode, string> = {
  adhd: 'bg-[#F59E0B] text-[#2D2010]',
  asd: 'bg-[#60A5FA] text-[#0D1E35]',
  dyslexia: 'bg-[#34D399] text-[#0A2419]',
};

const modeBorders: Record<LearningMode, string> = {
  adhd: 'border-[#F59E0B]',
  asd: 'border-[#60A5FA]',
  dyslexia: 'border-[#34D399]',
};

export default function StudentDashboard() {
  useDocumentTitle('Student Dashboard');
  const [profile] = useState(loadProfile);

  if (!profile) return <Navigate to="/onboarding" replace />;

  const mode = profile.recommendedMode;
  const modeLabel = MODE_LABELS[mode];
  const [continueChapter, ...otherChapters] = chapters;

  return (
    <main className="min-h-screen p-4 sm:p-6 max-w-5xl mx-auto pt-10 pb-28">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Hi, {profile.name || 'Student'} 👋</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider ${modeColors[mode]}`}
          >
            {modeLabel} Mode
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {profile.vector.map((v, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8B91C7]" style={{ opacity: v + 0.2 }} />
            ))}
          </div>
          <Link
            to="/onboarding"
            className="flex items-center gap-1 text-sm text-[#8B91C7] hover:text-white px-2 py-1 rounded"
          >
            <RotateCcw size={14} aria-hidden="true" /> Retake quiz
          </Link>
        </div>
      </header>

      <section className="mb-12" aria-labelledby="continue-heading">
        <h2 id="continue-heading" className="text-[#8B91C7] text-lg mb-4">
          Continue where you left off
        </h2>
        <MotionLink
          to={`/learn/${mode}/${continueChapter.id}`}
          whileHover={{ scale: 1.01 }}
          className={`bg-[#1C1F35] border-l-4 ${modeBorders[mode]} rounded-r-2xl rounded-l-md p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg`}
        >
          <div className="w-full md:w-auto">
            <div className="text-[#8B91C7] text-sm font-medium mb-1">
              {continueChapter.class} {continueChapter.subject} · {continueChapter.board}
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">{continueChapter.title}</h3>

            <div className="flex items-center gap-4 text-sm w-full md:w-80">
              <div
                className="flex-1 bg-[#141628] rounded-full h-2"
                role="progressbar"
                aria-label="Chapter progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={continueChapter.progress}
              >
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: `${continueChapter.progress}%` }}
                />
              </div>
              <span className="font-mono text-[#8B91C7]">{continueChapter.progress}%</span>
            </div>
          </div>

          <div
            className={`px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 ${modeColors[mode]} opacity-90 hover:opacity-100`}
          >
            Continue in {modeLabel} <BookOpen size={18} aria-hidden="true" />
          </div>
        </MotionLink>
      </section>

      <section aria-labelledby="chapters-heading">
        <h2 id="chapters-heading" className="text-[#8B91C7] text-lg mb-4">
          All Chapters — adapted for you
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherChapters.map((ch, i) => (
            <motion.li
              key={ch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/learn/${mode}/${ch.id}`}
                className="h-full bg-[#1C1F35] border border-[#2A2D45] rounded-2xl p-6 hover:border-[#4F547A] transition-colors flex flex-col"
              >
                <div className="text-[#8B91C7] text-xs font-medium mb-2">
                  {ch.class} {ch.subject}
                </div>
                <h3 className="font-display text-lg font-bold mb-6 flex-1">{ch.title}</h3>
                <div className="flex justify-between items-center border-t border-[#2A2D45] pt-4">
                  <span className="text-[#8B91C7] text-sm flex items-center gap-1">
                    <span aria-hidden="true">⏱</span> {ch.estimatedTime[mode]}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#141628] border ${modeBorders[mode]} text-white`}
                  >
                    {ch.hasDemoContent ? modeLabel : 'Preview soon'}
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>
    </main>
  );
}
