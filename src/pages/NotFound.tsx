import { StatusScreen } from '../components/layout/StatusScreen';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <StatusScreen title="Page not found" actionLabel="Go to home page" actionTo="/">
      The page you were looking for doesn&apos;t exist.
    </StatusScreen>
  );
}
