import { useState } from 'react';
import { districtStats, schools, engagementMetrics } from '../data/districtData';
import { Building2, BookCopy, CheckCircle2, Users, UploadCloud, Clock, MousePointerClick, BrainCircuit } from 'lucide-react';

export default function AdminDashboard() {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] p-6 pt-12 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="font-display text-4xl font-bold mb-2">District Admin</h1>
           <p className="text-[#8B91C7] text-lg">Bengaluru North District · Subnet: Govt HS</p>
        </div>
        <div className="bg-[#1C1F35] border border-[#2A2D45] rounded-xl px-4 py-2 flex items-center gap-3">
           <div className="w-10 h-10 bg-[#818CF8]/20 rounded-full flex items-center justify-center text-[#818CF8] font-bold">PS</div>
           <div>
              <p className="text-sm font-bold leading-tight">Priya Sharma</p>
              <p className="text-xs text-[#8B91C7]">Deputy Director</p>
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
         ].map((stat, i) => (
            <div key={i} className="bg-[#1C1F35] border border-[#2A2D45] rounded-2xl p-6">
               <stat.icon size={24} className="text-[#818CF8] mb-4" />
               <h3 className="font-mono text-3xl font-bold mb-1">{stat.value}</h3>
               <p className="text-[#8B91C7] text-sm">{stat.label}</p>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Flow & Schools */}
         <div className="lg:col-span-2 space-y-8">
            {/* Bulk Upload Action */}
            <div className="bg-gradient-to-r from-[#1C1F35] to-[#141628] border border-[#818CF8]/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div>
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                     <UploadCloud className="text-[#818CF8]" /> Batch Upload Curriculum
                  </h3>
                  <p className="text-[#8B91C7] text-sm">Upload a ZIP of raw PDFs. It will be transformed into all 3 profiles overnight.</p>
                  <p className="text-xs font-mono text-white/50 mt-4">Last batch: Class 7 Science — 14 May 2026 ✅</p>
               </div>
               <button 
                  onClick={() => { setUploading(true); setTimeout(() => setUploading(false), 2000) }}
                  disabled={uploading}
                  className="bg-[#818CF8] hover:bg-[#6366f1] text-white px-8 py-4 rounded-full font-bold whitespace-nowrap transition-colors w-full sm:w-auto"
               >
                  {uploading ? 'Scheduling...' : 'Schedule Overnight Run'}
               </button>
            </div>

            {/* Schools Progress Table */}
            <div className="bg-[#1C1F35] border border-[#2A2D45] rounded-3xl p-6 overflow-hidden">
               <h3 className="font-bold text-lg mb-6">School Deployment Progress</h3>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-[#2A2D45] text-[#8B91C7] text-sm">
                           <th className="pb-3 font-medium">School Name</th>
                           <th className="pb-3 font-medium text-right">Chapters</th>
                           <th className="pb-3 font-medium w-48 px-4">Transformation</th>
                           <th className="pb-3 font-medium text-center">Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        {schools.map((school, i) => {
                           const progress = (school.chaptersDone / school.chaptersTotal) * 100;
                           return (
                              <tr key={i} className="border-b border-[#2A2D45]/50 last:border-0 hover:bg-[#2A2D45]/20">
                                 <td className="py-4 font-medium">{school.name}</td>
                                 <td className="py-4 font-mono text-right text-sm">{school.chaptersDone}/{school.chaptersTotal}</td>
                                 <td className="py-4 px-4 w-48">
                                    <div className="h-2 bg-[#141628] rounded-full overflow-hidden">
                                       <div 
                                          className={`h-full ${progress === 100 ? 'bg-[#34D399]' : 'bg-[#818CF8]'}`}
                                          style={{ width: `${progress}%` }}
                                       />
                                    </div>
                                 </td>
                                 <td className="py-4 text-center">
                                    {school.status === 'complete' && <span className="text-[#34D399]">✅</span>}
                                    {school.status === 'processing' && <span className="text-[#818CF8]">🔄</span>}
                                    {school.status === 'queued' && <span className="text-[#F59E0B]">⏳</span>}
                                 </td>
                              </tr>
                           )
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Right Column: Charts & Metrics */}
         <div className="space-y-8">
            {/* Condition Breakdown */}
            <div className="bg-[#1C1F35] border border-[#2A2D45] rounded-3xl p-6">
               <h3 className="font-bold text-lg mb-6">Cognitive Distribution</h3>
               <div className="space-y-4">
                  {[
                     { mode: 'Standard', count: 430, total: 1240, color: 'bg-white/20' },
                     { mode: 'ADHD', count: 340, total: 1240, color: 'bg-[#F59E0B]' },
                     { mode: 'Dyslexia', count: 290, total: 1240, color: 'bg-[#34D399]' },
                     { mode: 'ASD', count: 180, total: 1240, color: 'bg-[#60A5FA]' },
                  ].map(c => {
                     const pct = Math.round((c.count / c.total) * 100);
                     return (
                        <div key={c.mode} className="relative">
                           <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-[#c4c8e7]">{c.mode}</span>
                              <span className="font-mono text-[#8B91C7]">{c.count} ({pct}%)</span>
                           </div>
                           <div className="h-2 bg-[#141628] rounded-full overflow-hidden">
                              <div className={`h-full ${c.color}`} style={{ width: `${pct}%` }} />
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-[#1C1F35] border border-[#2A2D45] rounded-3xl p-6">
               <h3 className="font-bold text-lg mb-6">7-Day Engagement</h3>
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="p-2 bg-[#34D399]/10 rounded-lg"><Clock size={20} className="text-[#34D399]" /></div>
                     <div>
                        <div className="font-mono text-2xl font-bold">{engagementMetrics.avgSessionMin} min</div>
                        <div className="text-sm text-[#8B91C7]">Avg session time <span className="text-[#34D399] font-bold">(+8m vs standard)</span></div>
                     </div>
                  </div>
                  <div className="w-full h-px bg-[#2A2D45]" />
                  <div className="flex items-start gap-4">
                     <div className="p-2 bg-[#F59E0B]/10 rounded-lg"><MousePointerClick size={20} className="text-[#F59E0B]" /></div>
                     <div>
                        <div className="font-mono text-xl font-bold">{engagementMetrics.confusedClicks}</div>
                        <div className="text-sm text-[#8B91C7]">"I'm confused" clicks</div>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="p-2 bg-[#60A5FA]/10 rounded-lg"><BrainCircuit size={20} className="text-[#60A5FA]" /></div>
                     <div>
                        <div className="font-mono text-xl font-bold">{engagementMetrics.modalitySwitches}</div>
                        <div className="text-sm text-[#8B91C7]">Auto-modality switches</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
