import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Search, LogOut, User, CheckCircle, Clock } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const userId = user?.employeeId || user?.id || '';

  // Initialize status state accurately scoped to active profile signatures
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    if (!userId) return false;
    return localStorage.getItem(`checked_in_${userId}`) === 'true';
  });

  // EFFECT SYNC: Re-evaluate local storage metrics when active context tokens swap
  useEffect(() => {
    if (userId) {
      setIsCheckedIn(localStorage.getItem(`checked_in_${userId}`) === 'true');
    }
  }, [userId]);

  const handleCheckInToggle = (status) => {
    if (!userId) return;
    setIsCheckedIn(status);
    localStorage.setItem(`checked_in_${userId}`, status);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // FIXED: Simplified path targets matching our unified router hierarchy
  const navLinks = [
    ...(user?.role === 'Admin' ? [{ to: "/employees", label: "Directory" }] : []),
    { to: "/attendance", label: "Attendance" },
    { to: "/leave", label: "Time Off" },
    { to: "/payroll", label: "Payroll" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navbar Header */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-sm">
              OI
            </div>
            <span className="font-bold text-base text-gray-900 hidden sm:block tracking-tight">Company Portal</span>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-primary' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative hidden lg:block w-64">
            <input 
              type="text" 
              placeholder="Search platform controls..." 
              className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary outline-none transition-all"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center focus:outline-none relative transition-transform active:scale-95"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-primary font-bold text-sm shadow-inner">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full shadow-xs ${isCheckedIn ? 'bg-green-500' : 'bg-red-400'}`}></div>
            </button>
            
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'User Profile'}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-100 text-primary rounded">
                      {user?.role}
                    </span>
                  </div>
                  
                  <div className="p-1 border-b border-gray-100 space-y-0.5">
                    <button 
                      onClick={() => handleCheckInToggle(true)}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${isCheckedIn ? 'bg-green-50/60 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <CheckCircle size={15} className={`mr-2 ${isCheckedIn ? 'text-green-500' : 'text-gray-400'}`} /> 
                      <span>Check IN Shift</span>
                    </button>
                    <button 
                      onClick={() => handleCheckInToggle(false)}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${!isCheckedIn ? 'bg-red-50/60 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Clock size={15} className={`mr-2 ${!isCheckedIn ? 'text-red-500' : 'text-gray-400'}`} /> 
                      <span>Check Out Shift</span>
                    </button>
                  </div>
                  
                  <div className="p-1 space-y-0.5">
                    <NavLink 
                      // FIXED: Aligned target routing mapping format with root definitions
                      to={`/profile/${userId}`}
                      onClick={() => setShowDropdown(false)}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <User size={15} className="mr-2 text-gray-400" /> My Profile
                    </NavLink>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      <LogOut size={15} className="mr-2" /> Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content Area Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}