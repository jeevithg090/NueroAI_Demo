import { BookOpen, GraduationCap, Building2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const roles = [
  { label: 'Student',  path: '/student',  icon: BookOpen },
  { label: 'Teacher',  path: '/teacher',  icon: GraduationCap },
  { label: 'Admin',    path: '/admin',    icon: Building2 },
];

export function RoleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  
  if (location.pathname === '/') return null;

  return (
    <div className="fixed bottom-6 right-6 flex bg-[#141628] border border-[#2A2D45] rounded-full shadow-lg p-1 z-50">
      {roles.map(role => (
        <button
          key={role.path}
          onClick={() => navigate(role.path)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
            location.pathname.startsWith(role.path) 
              ? "bg-[#818CF8] text-white" 
              : "text-[#8B91C7] hover:text-white"
          )}
        >
          <role.icon size={16} />
          {role.label}
        </button>
      ))}
    </div>
  );
}
