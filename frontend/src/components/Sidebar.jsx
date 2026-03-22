import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, CheckSquare, Settings, X, Database, Wrench, Shield, CalendarDays, Image } from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const hasAccess = (moduleName) => {
    if (!user) return false;
    const role = user.role?.toUpperCase() || '';
    if (['SA', 'SUPER_ADMIN', 'DIR', 'DIRECTOR'].includes(role)) return true;

    // Fallback for Phase 1 Demo roles
    if (moduleName === 'Enquiry') return true; // Everyone can see enquiries for now
    if (moduleName === 'Quotation') return ['SALES', 'MANAGER', 'DESIGN ENGINEER', 'DESIGN'].includes(role) || role.includes('DESIGN');
    if (moduleName === 'QAP') return ['QUALITY', 'MANAGER', 'PRODUCTION'].includes(role) || role.includes('QUALITY');
    if (moduleName === 'Admin') return ['ADMIN', 'MANAGER'].includes(role);

    return user?.permissions?.[moduleName]?.view === true;
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/app', show: true },
    { label: 'Tasks', icon: CalendarDays, path: '/app/tasks', show: true },
    { label: 'Customers', icon: Database, path: '/app/customers', show: true },
    { label: 'Gallery & Files', icon: Image, path: '/app/gallery', show: true },
    { label: 'Enquiries', icon: Users, path: '/app/enquiries', show: hasAccess('Enquiry') },
    { label: 'Quotations', icon: FileText, path: '/app/quotations', show: hasAccess('Quotation') },
    { label: 'Quality Assurance', icon: CheckSquare, path: '/app/qaps', show: hasAccess('QAP') },
  ];

  if (hasAccess('Admin')) {
    navItems.push({ label: 'Field Builder', icon: Wrench, path: '/app/field-builder', show: true });
    navItems.push({ label: 'Role Builder', icon: Shield, path: '/app/role-builder', show: true });
    navItems.push({ label: 'User Management', icon: Users, path: '/app/admin', show: true });
  }

  const visibleNavItems = navItems.filter(item => item.show);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-brand-600 font-bold text-lg tracking-tight hover:text-brand-700 hover:opacity-80 transition-opacity"
          title="Go to Home"
        >
          <Database className="w-5 h-5 text-brand-500" />
          <span>Jagtap Engg</span>
        </NavLink>
        <button onClick={onClose} className="p-1 -mr-2 text-slate-400 hover:text-slate-600 rounded-md">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-brand-50 text-brand-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-xs font-semibold text-slate-700">Intan Networks</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Automated Workflow v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
