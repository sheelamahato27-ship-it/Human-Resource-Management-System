import { useAuth } from '../context/AuthContext';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard states
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    present: 0,
    onLeave: 0,
    pendingLeaves: 0
  });

  useEffect(() => {
    // 1. Fetch directories
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    const activeEmployees = users.filter(u => u.role === 'Employee');
    setEmployees(activeEmployees);

    // 2. Compute dynamic metrics from our mock collections
    const attendanceRecords = JSON.parse(localStorage.getItem('hrms_attendance') || '[]');
    const leaveRecords = JSON.parse(localStorage.getItem('hrms_leaves') || '[]');

    // Get today's localized ISO date stamp (YYYY-MM-DD)
    const todayStr = new Date().toISOString().split('T')[0];

    // Count records marked present for today
    const presentTodayCount = attendanceRecords.filter(rec => 
      rec.date === todayStr && rec.status === 'Present'
    ).length;

    // Count records approved for leave overlapping today
    const activeLeavesCount = leaveRecords.filter(leave => 
      leave.status === 'Approved' && 
      todayStr >= leave.startDate && 
      todayStr <= leave.endDate
    ).length;

    // Count unprocessed leaves pending verification
    const pendingReviewCount = leaveRecords.filter(leave => 
      leave.status === 'Pending'
    ).length;

    setStats({
      present: presentTodayCount,
      onLeave: activeLeavesCount,
      pendingLeaves: pendingReviewCount
    });
  }, []);

  return (
    <div className="space-y-6 text-gray-800">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Control Center</h2>
        <p className="text-sm text-gray-500 mt-1">Operational status update for {user?.name}</p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-primary rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Staff</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{employees.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Present Today</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{stats.present}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <UserX size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">On Leave</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{stats.onLeave}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Tasks</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{stats.pendingLeaves}</p>
          </div>
        </div>
      </div>

      {/* Directory Snapshot View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/40">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Recent Employee Additions</h3>
          <button 
            // FIXED: Pointed to the unified route parameters path
            onClick={() => navigate('/employees')}
            className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-md font-semibold text-primary hover:border-primary transition-colors shadow-xs"
          >
            View Directory
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Employee ID</th>
                <th className="px-6 py-3 font-semibold">Email Account</th>
                <th className="px-6 py-3 font-semibold">System Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400 text-xs">
                    No active employee profiles found in local system scope.
                  </td>
                </tr>
              ) : (
                employees.slice(0, 5).map((emp) => {
                  const targetId = emp.employeeId || emp.id;
                  return (
                    <tr 
                      key={targetId} 
                      // FIXED: Aligned row linking syntax with standard profile locations
                      onClick={() => navigate(`/profile/${targetId}`)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-3.5 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary text-xs font-bold shadow-inner">
                          {emp.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{emp.name}</span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-600 font-mono text-xs">{targetId}</td>
                      <td className="px-6 py-3.5 text-gray-500 text-xs">{emp.email}</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-green-100">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}