import { useParams } from 'react-router-dom';
import { getChapter } from '../data/chapters';
import { StatusScreen } from '../components/layout/StatusScreen';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { isLearningMode } from '../types';
import LearnADHD from './LearnADHD';
import LearnASD from './LearnASD';
import LearnDyslexia from './LearnDyslexia';

/** Resolves `/learn/:mode/:id` to the matching adaptive engine, with clear fallbacks. */
export default function LessonRoute() {
  const { mode, id } = useParams();
  const chapter = getChapter(id);
  useDocumentTitle(chapter?.title ?? 'Lesson not found');

  if (!isLearningMode(mode) || !chapter) {
    return (
      <StatusScreen title="Lesson not found">
        We couldn&apos;t find that lesson. It may have been moved, or the link is incorrect.
      </StatusScreen>
    );
  }

  if (!chapter.hasDemoContent) {
    return (
      <StatusScreen title={chapter.title}>
        Adapted content for this chapter isn&apos;t included in the demo yet. Try{' '}
        <span className="text-white">The Human Digestive System</span> to see the adaptive engines in action.
      </StatusScreen>
    );
  }

  switch (mode) {
    case 'adhd':
      return <LearnADHD key={chapter.id} chapter={chapter} />;
    case 'asd':
      return <LearnASD key={chapter.id} chapter={chapter} />;
    case 'dyslexia':
      return <LearnDyslexia key={chapter.id} chapter={chapter} />;
  }
}
