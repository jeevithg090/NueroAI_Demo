import { useEffect, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BrainCircuit,
  Activity,
  Eye,
  AudioLines,
  GraduationCap,
  Building2,
  ClipboardList,
  Wand2,
  BookOpenCheck,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { saveProfile } from '../utils/profileUtils';
import { demoProfiles } from '../data/profiles';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import type { LearningMode } from '../types';

interface EngineCard {
  tag: string;
  mode: LearningMode;
  icon: LucideIcon;
  /** CSS colour token for the engine (theme-aware). */
  color: string;
  title: string;
  desc: string;
}

const ENGINE_CARDS: EngineCard[] = [
  {
    tag: 'ADHD',
    mode: 'adhd',
    icon: Activity,
    color: 'var(--color-adhd)',
    title: 'Action-Driven',
    desc: 'Gamified chunking, frequent rewards, and interactive tests.',
  },
  {
    tag: 'ASD',
    mode: 'asd',
    icon: Eye,
    color: 'var(--color-asd)',
    title: 'Predictable & Calm',
    desc: 'Zero surprises, literal language, and constant structure.',
  },
  {
    tag: 'Dyslexia',
    mode: 'dyslexia',
    icon: AudioLines,
    color: 'var(--color-dys)',
    title: 'Audio-First',
    desc: 'Syllabic timing, OpenDyslexic font, and high contrast.',
  },
];

const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: ClipboardList,
    title: 'Answer five questions',
    desc: 'A short onboarding quiz builds a learning profile. No diagnosis or personal data needed.',
  },
  {
    icon: Wand2,
    title: 'Get matched to an engine',
    desc: 'The profile picks the ADHD, ASD or dyslexia engine. Retake the quiz any time.',
  },
  {
    icon: BookOpenCheck,
    title: 'Learn the same chapter',
    desc: 'Every engine teaches the same NCERT content, presented the way that works for you.',
  },
];

const HEADLINE = ['One platform.', 'Three adaptive engines.', 'Zero re-onboarding.'];

export default function Landing() {
  useDocumentTitle();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, tts: 600, langs: 0 });

  useEffect(() => {
    let frame = 0;
    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      setStats({
        students: Math.floor(easeProgress * 250),
        tts: Math.floor(600 - easeProgress * 200),
        langs: Math.floor(easeProgress * 20),
      });

      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleStartDemo = (mode: LearningMode) => {
    saveProfile(demoProfiles[mode]);
    navigate('/student');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_20%_40%,_var(--nl-hero-glow-1)_0%,_transparent_55%),radial-gradient(ellipse_at_80%_10%,_var(--nl-hero-glow-2)_0%,_transparent_55%)]">
      <header className="border-b border-line/60 backdrop-blur-sm">
        <nav
          aria-label="Main"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5"
        >
          <Link to="/" className="-ml-2 flex min-h-11 items-center gap-2 rounded-full px-2">
            <BrainCircuit className="text-accent" size={28} aria-hidden="true" />
            <span className="font-display text-lg font-semibold tracking-tight whitespace-nowrap sm:text-xl">
              NeuroLearn AI
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/onboarding" className="btn btn-inverse">
              Try Demo
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col items-center px-4 pt-14 pb-16 text-center sm:px-6 sm:pt-24">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-card/70 px-4 py-1.5 text-sm font-medium text-muted"
        >
          <Sparkles size={16} className="text-accent" aria-hidden="true" />
          Track 3 · Education · PS1
        </motion.p>

        <h1 className="font-display mb-6 text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl md:text-7xl">
          {HEADLINE.map((word, i) => (
            <motion.span
              key={word}
              className="block"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
            >
              {word === 'Zero re-onboarding.' ? (
                <>
                  Zero <span className="whitespace-nowrap">re-onboarding.</span>
                </>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-pretty text-muted sm:mb-12 sm:text-xl"
        >
          NCERT curriculum in <span className="text-fg">→</span> personalised learning out. Fully offline.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4"
        >
          <Link
            to="/onboarding"
            className="btn btn-primary btn-lg shadow-[0_0_24px_color-mix(in_oklab,var(--nl-accent-solid)_35%,transparent)]"
          >
            Start as Student <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/teacher" className="btn btn-secondary btn-lg">
            <GraduationCap size={18} aria-hidden="true" />
            Teacher Portal
          </Link>
          <Link to="/admin" className="btn btn-secondary btn-lg">
            <Building2 size={18} aria-hidden="true" />
            Admin
          </Link>
        </motion.div>

        {/* Engine cards */}
        <section aria-labelledby="engines-heading" className="mt-20 w-full max-w-5xl sm:mt-24">
          <h2 id="engines-heading" className="sr-only">
            Try an adaptive engine
          </h2>
          <p className="mb-6 text-sm text-muted">Skip the quiz and jump straight into an engine:</p>
          <motion.ul
            className="grid w-full grid-cols-1 gap-4 text-left sm:gap-6 md:grid-cols-3"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } },
            }}
          >
            {ENGINE_CARDS.map((c) => (
              <motion.li
                key={c.tag}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <button
                  type="button"
                  className="card group relative h-full w-full overflow-hidden p-6 text-left shadow-card transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-line-strong"
                  style={{ outlineColor: c.color } as CSSProperties}
                  onClick={() => handleStartDemo(c.mode)}
                  aria-label={`Demo the ${c.tag} engine as a student`}
                >
                  <span
                    className="absolute top-0 bottom-0 left-0 w-1 transition-all group-hover:w-1.5"
                    style={{ backgroundColor: c.color }}
                    aria-hidden="true"
                  />
                  <c.icon color={c.color} size={32} className="mb-4" aria-hidden="true" />
                  <span className="eyebrow mb-1 block" style={{ color: c.color }}>
                    {c.title}
                  </span>
                  <span className="font-display mb-2 block text-xl font-bold">{c.tag} Engine</span>
                  <span className="mb-4 block text-sm leading-relaxed text-muted">{c.desc}</span>
                  <span
                    className="flex items-center gap-1 text-sm font-semibold group-hover:underline"
                    style={{ color: c.color }}
                  >
                    Demo as Student <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading" className="mt-20 w-full max-w-5xl text-left sm:mt-24">
          <h2 id="how-heading" className="font-display mb-8 text-center text-2xl font-bold sm:text-3xl">
            How the student journey works
          </h2>
          <ol className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="card flex gap-4 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-solid/15 text-accent">
                  <step.icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="mb-1 font-mono text-xs text-subtle">Step {i + 1}</p>
                  <h3 className="mb-1 font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Stats strip */}
        <motion.section
          aria-label="Product goals"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-20 w-full max-w-4xl border-t border-line pt-10"
        >
          <dl className="grid grid-cols-2 gap-8 text-muted sm:grid-cols-4">
            <div className="flex flex-col-reverse">
              <dt className="text-sm">Students Supported</dt>
              <dd className="font-mono text-2xl font-bold text-fg sm:text-3xl">{stats.students}M+</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-sm">TTS Latency</dt>
              <dd className="font-mono text-2xl font-bold text-fg sm:text-3xl">&lt;{stats.tts}ms</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-sm">Languages via Bhashini</dt>
              <dd className="font-mono text-2xl font-bold text-fg sm:text-3xl">{stats.langs}+</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-sm">Inference Cost</dt>
              <dd className="font-mono text-2xl font-bold text-fg sm:text-3xl">₹0</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-subtle">
            Figures are design goals for the full product, not measurements from this prototype.
          </p>
        </motion.section>
      </main>

      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-subtle sm:flex-row sm:px-6">
          <p>NeuroLearn AI · interactive prototype</p>
          <p>Sample content: NCERT Class 7 Science, Chapter “The Human Digestive System”</p>
        </div>
      </footer>
    </div>
  );
}
