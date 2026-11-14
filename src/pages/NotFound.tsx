import { Compass } from 'lucide-react';
import { StatusScreen } from '../components/layout/StatusScreen';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <StatusScreen
      title="Page not found"
      eyebrow="Error 404"
      icon={Compass}
      actionLabel="Go to home page"
      actionTo="/"
    >
      The page you were looking for doesn&apos;t exist. Check the address, or head back to the start.
    </StatusScreen>
  );
}
