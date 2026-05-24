/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import StudentDashboard from './pages/StudentDashboard';
import LearnADHD from './pages/LearnADHD';
import LearnASD from './pages/LearnASD';
import LearnDyslexia from './pages/LearnDyslexia';
import TeacherPortal from './pages/TeacherPortal';
import AdminDashboard from './pages/AdminDashboard';
import { RoleSwitcher } from './components/layout/RoleSwitcher';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
        <Routes>
          <Route path="/"                  element={<Landing />} />
          <Route path="/onboarding"        element={<Onboarding />} />
          <Route path="/student"           element={<StudentDashboard />} />
          <Route path="/learn/adhd/:id"    element={<LearnADHD />} />
          <Route path="/learn/asd/:id"     element={<LearnASD />} />
          <Route path="/learn/dyslexia/:id" element={<LearnDyslexia />} />
          <Route path="/teacher"           element={<TeacherPortal />} />
          <Route path="/admin"             element={<AdminDashboard />} />
          <Route path="*"                  element={<Navigate to="/" />} />
        </Routes>
        <RoleSwitcher />
      </div>
    </BrowserRouter>
  );
}
