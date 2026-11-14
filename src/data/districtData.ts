export const districtStats = {
  totalSchools: 47,
  totalChapters: 312,
  completionRate: 89,
  activeStudents: 1240,
};

export type SchoolStatus = 'complete' | 'processing' | 'queued';

export interface School {
  name: string;
  chaptersTotal: number;
  chaptersDone: number;
  status: SchoolStatus;
}

export const schools: School[] = [
  { name: 'Govt HS Malleshwaram', chaptersTotal: 48, chaptersDone: 48, status: 'complete' },
  { name: 'Govt HS Yelahanka', chaptersTotal: 48, chaptersDone: 32, status: 'processing' },
  { name: 'Govt HS Rajajinagar', chaptersTotal: 48, chaptersDone: 12, status: 'processing' },
  { name: 'Govt HS Hebbal', chaptersTotal: 48, chaptersDone: 0, status: 'queued' },
  { name: 'Govt HS Indiranagar', chaptersTotal: 48, chaptersDone: 48, status: 'complete' },
  { name: 'Govt HS Koramangala', chaptersTotal: 48, chaptersDone: 41, status: 'processing' },
];

export const cognitiveDistribution = [
  { mode: 'Standard', count: 430, color: 'bg-muted/60' },
  { mode: 'ADHD', count: 340, color: 'bg-adhd-solid' },
  { mode: 'Dyslexia', count: 290, color: 'bg-dys-solid' },
  { mode: 'ASD', count: 180, color: 'bg-asd-solid' },
];

export const engagementMetrics = {
  avgSessionMin: 24,
  baselineSessionMin: 16,
  confusedClicks: 847,
  modalitySwitches: 612,
  completions: 1204,
};
