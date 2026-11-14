import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { lazy, Suspense } from 'react';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { PageLoader } from './components/layout/PageLoader';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { SkipLink } from './components/layout/SkipLink';
import { ScrollToTop } from './components/layout/ScrollToTop';

const Onboarding = lazy(() => import('./pages/Onboarding'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const LessonRoute = lazy(() => import('./pages/LessonRoute'));
const TeacherPortal = lazy(() => import('./pages/TeacherPortal'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export function AppRoutes() {
  return (
    <div className="min-h-screen bg-canvas text-fg">
      <ScrollToTop />
      <SkipLink />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/learn/:mode/:id" element={<LessonRoute />} />
          <Route path="/teacher" element={<TeacherPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <RoleSwitcher />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ErrorBoundary>
    </MotionConfig>
  );
}
