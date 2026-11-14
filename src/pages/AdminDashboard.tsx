import { useEffect, useRef, useState } from 'react';
import {
  districtStats,
  schools,
  engagementMetrics,
  cognitiveDistribution,
  type SchoolStatus,
} from '../data/districtData';
import {
  Building2,
  BookCopy,
  CheckCircle2,
  Users,
  UploadCloud,
  Clock,
  MousePointerClick,
  BrainCircuit,
} from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { AppHeader } from '../components/layout/AppHeader';

const STATUS_BADGES: Record<SchoolStatus, { icon: string; label: string }> = {
  complete: { icon: '✅', label: 'Complete' },
  processing: { icon: '🔄', label: 'Processing' },
  queued: { icon: '⏳', label: 'Queued' },
};

type ScheduleState = 'idle' | 'scheduling' | 'scheduled';

export default function AdminDashboard() {
  useDocumentTitle('District Admin');
  const [scheduleState, setScheduleState] = useState<ScheduleState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const totalStudents = cognitiveDistribution.reduce((sum, c) => sum + c.count, 0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const scheduleRun = () => {
    setScheduleState('scheduling');
    timer.current = setTimeout(() => setScheduleState('scheduled'), 2000);
  };

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-canvas p-4 sm:p-6 pt-10 sm:pt-12 pb-28 max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">District Admin</h1>
            <p className="text-muted text-lg">Bengaluru North District · Subnet: Govt HS</p>
            <p className="mt-2 inline-block rounded-full border border-line px-3 py-1 text-xs text-muted">
              Sample data for demonstration
            </p>
          </div>
          <div className="bg-card border border-line rounded-xl px-4 py-2 flex items-center gap-3">
            <div
              className="w-10 h-10 bg-accent-solid/20 rounded-full flex items-center justify-center text-accent font-bold"
              aria-hidden="true"
            >
              PS
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Priya Sharma</p>
              <p className="text-xs text-muted">Deputy Director</p>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Schools', value: districtStats.totalSchools, icon: Building2 },
            { label: 'Chapters Adapted', value: districtStats.totalChapters, icon: BookCopy },
            { label: 'Completion Rate', value: `${districtStats.completionRate}%`, icon: CheckCircle2 },
            { label: 'Active Students', value: districtStats.activeStudents, icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-line rounded-2xl p-4 sm:p-6">
              <stat.icon size={24} className="text-accent mb-4" aria-hidden="true" />
              <p className="font-mono text-2xl sm:text-3xl font-bold mb-1">
                {stat.value.toLocaleString('en-IN')}
              </p>
              <h2 className="text-muted text-sm">{stat.label}</h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Flow & Schools */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bulk Upload Action */}
            <div className="bg-gradient-to-r from-card to-surface border border-accent/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <UploadCloud className="text-accent" aria-hidden="true" /> Batch Upload Curriculum
                </h2>
                <p className="text-muted text-sm">
                  Upload a ZIP of raw PDFs. It will be transformed into all 3 profiles overnight.
                </p>
                <p className="text-xs font-mono text-muted mt-4">
                  Last batch: Class 7 Science — 14 May 2026 ✅
                </p>
              </div>
              <button
                type="button"
                onClick={scheduleRun}
                disabled={scheduleState !== 'idle'}
                aria-live="polite"
                className="btn btn-primary btn-lg w-full sm:w-auto disabled:opacity-80"
              >
                {scheduleState === 'idle' && 'Schedule Overnight Run'}
                {scheduleState === 'scheduling' && 'Scheduling...'}
                {scheduleState === 'scheduled' && 'Scheduled for tonight ✓'}
              </button>
            </div>

            {/* Schools Progress Table */}
            <div className="bg-card border border-line rounded-3xl p-6 overflow-hidden">
              <h2 className="font-bold text-lg mb-6">School Deployment Progress</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-line text-muted text-sm">
                      <th scope="col" className="pb-3 font-medium">
                        School Name
                      </th>
                      <th scope="col" className="pb-3 font-medium text-right">
                        Chapters
                      </th>
                      <th scope="col" className="hidden pb-3 font-medium w-48 px-4 sm:table-cell">
                        Transformation
                      </th>
                      <th scope="col" className="pb-3 font-medium text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school) => {
                      const progress =
                        school.chaptersTotal > 0 ? (school.chaptersDone / school.chaptersTotal) * 100 : 0;
                      const badge = STATUS_BADGES[school.status];
                      return (
                        <tr
                          key={school.name}
                          className="border-b border-line/50 last:border-0 hover:bg-raised/20"
                        >
                          <td className="py-4 pr-4 font-medium min-w-40">{school.name}</td>
                          <td className="py-4 font-mono text-right text-sm">
                            {school.chaptersDone}/{school.chaptersTotal}
                          </td>
                          <td className="hidden py-4 px-4 w-48 sm:table-cell">
                            <div
                              className="h-2 bg-surface rounded-full overflow-hidden"
                              role="progressbar"
                              aria-label={`${school.name} transformation progress`}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={Math.round(progress)}
                            >
                              <div
                                className={`h-full ${progress === 100 ? 'bg-dys-solid' : 'bg-accent-solid'}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span role="img" aria-label={badge.label} title={badge.label}>
                              {badge.icon}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Charts & Metrics */}
          <div className="space-y-8">
            {/* Condition Breakdown */}
            <div className="bg-card border border-line rounded-3xl p-6">
              <h2 className="font-bold text-lg mb-6">Cognitive Distribution</h2>
              <div className="space-y-4">
                {cognitiveDistribution.map((c) => {
                  const pct = totalStudents > 0 ? Math.round((c.count / totalStudents) * 100) : 0;
                  return (
                    <div key={c.mode} className="relative">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-fg">{c.mode}</span>
                        <span className="font-mono text-muted">
                          {c.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-surface rounded-full overflow-hidden" aria-hidden="true">
                        <div className={`h-full ${c.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-card border border-line rounded-3xl p-6">
              <h2 className="font-bold text-lg mb-6">7-Day Engagement</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-dys-solid/10 rounded-lg">
                    <Clock size={20} className="text-dys" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-mono text-2xl font-bold">{engagementMetrics.avgSessionMin} min</div>
                    <div className="text-sm text-muted">
                      Avg session time{' '}
                      <span className="text-dys font-bold">
                        (+{engagementMetrics.avgSessionMin - engagementMetrics.baselineSessionMin}m vs
                        standard)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-raised" />
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-adhd-solid/10 rounded-lg">
                    <MousePointerClick size={20} className="text-adhd" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold">{engagementMetrics.confusedClicks}</div>
                    <div className="text-sm text-muted">"I'm confused" clicks</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-asd-solid/10 rounded-lg">
                    <BrainCircuit size={20} className="text-asd" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold">{engagementMetrics.modalitySwitches}</div>
                    <div className="text-sm text-muted">Auto-modality switches</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
