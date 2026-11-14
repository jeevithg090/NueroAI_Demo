import { BookOpen, Building2, GraduationCap, type LucideIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { shouldShowRoleSwitcher } from '../../utils/navigation';

interface Role {
  label: string;
  path: string;
  icon: LucideIcon;
}

const roles: Role[] = [
  { label: 'Student', path: '/student', icon: BookOpen },
  { label: 'Teacher', path: '/teacher', icon: GraduationCap },
  { label: 'Admin', path: '/admin', icon: Building2 },
];

export function RoleSwitcher() {
  const { pathname } = useLocation();
  if (!shouldShowRoleSwitcher(pathname)) return null;

  return (
    <nav
      aria-label="Switch demo role"
      className="fixed right-4 bottom-4 z-50 flex rounded-full border border-line bg-surface p-1 shadow-lg sm:right-6 sm:bottom-6"
    >
      {roles.map((role) => (
        <NavLink
          key={role.path}
          to={role.path}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4',
              isActive ? 'bg-accent-solid text-white' : 'text-muted hover:text-fg',
            )
          }
        >
          <role.icon size={16} aria-hidden="true" />
          <span>{role.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
