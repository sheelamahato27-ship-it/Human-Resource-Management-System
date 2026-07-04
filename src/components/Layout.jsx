import { useAuth } from '../context/AuthContext';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, User, Calendar, FileText, LogOut, DollarSign, Users } from 'lucide-react';
export default function Layout() {
  const { user, logout } = useAuth();
  const employeeLinks = [
    { to: "/employee", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/employee/profile", label: "My Profile", icon: <User size={20} /> },
    { to: "/employee/attendance", label: "Attendance", icon: <Calendar size={20} /> },
    { to: "/employee/leave", label: "Leave Requests", icon: <FileText size={20} /> },
    { to: "/employee/payroll", label: "Payroll", icon: <DollarSign size={20} /> },
  ];
  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/employees", label: "Employees", icon: <Users size={20} /> },
    { to: "/admin/attendance", label: "Attendance", icon: <Calendar size={20} /> },
    { to: "/admin/leave", label: "Leave Approvals", icon: <FileText size={20} /> },
    { to: "/admin/payroll", label: "Payroll Control", icon: <DollarSign size={20} /> },
  ];
  const links = user?.role === 'Admin' ? adminLinks : employeeLinks;
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary">HRMS</h1>
          <p className="text-xs text-gray-500 mt-1">{user?.role} Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/employee' || link.to === '/admin'}
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-primary font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center space-x-3 text-red-600 hover:bg-red-50 w-full px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}