import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, ArrowLeft } from 'lucide-react';

export default function Attendance() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drill-down detail configuration for administrative logging audits
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Interactivity handlers for changing months
  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  // Generate date interval safely memoized to stabilize against render cycle drift
  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    });
  }, [currentDate]);

  // Read current real-time active system users from data layer
  const realRoster = useMemo(() => {
    if (!isAdmin) return [];
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    
    // Filter down to standard staff tracks and enrich with matching visual markers
    return users
      .filter(u => u.role === 'Employee')
      .map((u, index) => ({
        name: u.name || 'Unknown User',
        employeeId: u.employeeId || u.id,
        initial: u.name?.charAt(0).toUpperCase() || 'U',
        bg: index % 2 === 0 ? 'bg-indigo-50 border-indigo-100' : 'bg-pink-50 border-pink-100',
        text: index % 2 === 0 ? 'text-primary' : 'text-pink-600'
      }));
  }, [isAdmin]);

  // Filter roster matching search queries
  const filteredRoster = useMemo(() => {
    return realRoster.filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [realRoster, searchQuery]);

  // Deterministic calculation engine mimicking dynamic historical profiles
  const targetAttendanceLog = useMemo(() => {
    const activeTargetName = isAdmin && selectedEmployee ? selectedEmployee.name : user?.name;
    const seedString = activeTargetName || "User";
    const modifier = seedString.length % 3 === 0 ? 0.85 : 0.92;

    return daysInMonth.map((date, index) => {
      const isWknd = isWeekend(date);
      const hasLeave = !isWknd && ((index * 7) % 29 > 26 * modifier); 
      
      return {
        date: date,
        checkIn: !isWknd && !hasLeave ? '10:00 AM' : '-',
        checkOut: !isWknd && !hasLeave ? '07:00 PM' : '-',
        workHours: !isWknd && !hasLeave ? '09:00' : '-',
        extraHours: !isWknd && !hasLeave ? '01:00' : '-',
        status: isWknd ? 'Weekend' : hasLeave ? 'Leave' : 'Present'
      };
    });
  }, [daysInMonth, isAdmin, selectedEmployee, user?.name]);

  // Compute aggregated stats
  const totalWorkingDays = useMemo(() => daysInMonth.filter(d => !isWeekend(d)).length, [daysInMonth]);
  const daysPresent = useMemo(() => targetAttendanceLog.filter(a => a.status === 'Present').length, [targetAttendanceLog]);
  const leaveCount = useMemo(() => targetAttendanceLog.filter(a => a.status === 'Leave').length, [targetAttendanceLog]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-gray-800">
      
      {/* Top Navigation Panel Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          {isAdmin && selectedEmployee && (
            <button 
              onClick={() => setSelectedEmployee(null)} 
              className="mr-2 p-2 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
              title="Back to Directory"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <button onClick={handlePrevMonth} className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-all">
            <ChevronLeft size={16} />
          </button>
          <div className="font-bold text-sm text-gray-900 min-w-32 text-center uppercase tracking-wider">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <button onClick={handleNextMonth} className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dynamic Header Metrics Dashboard / Controls Toggle */}
        {isAdmin && !selectedEmployee ? (
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active staff logs..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50/50 rounded-lg text-xs focus:bg-white focus:border-primary outline-none transition-all"
            />
            <Search size={14} className="absolute left-3.5 top-2.5 text-gray-400" />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {selectedEmployee && (
              <div className="hidden sm:flex items-center space-x-2 border-r pr-6 border-gray-100">
                <div className={`w-8 h-8 rounded-full ${selectedEmployee.bg} ${selectedEmployee.text} border flex items-center justify-center text-xs font-bold shadow-2xs`}>
                  {selectedEmployee.initial}
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-900 leading-none">{selectedEmployee.name}</span>
                  <span className="text-[10px] font-mono font-medium text-gray-400 mt-0.5 block">{selectedEmployee.employeeId}</span>
                </div>
              </div>
            )}
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 leading-none">{daysPresent}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Present</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 leading-none">{leaveCount}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Leaves</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 leading-none">{totalWorkingDays}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Work Days</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Context Container Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isAdmin && !selectedEmployee ? (
          /* Master Directory Mode - Now reading populated system users array */
          <div className="p-4 space-y-1">
            <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 mb-2">
              Staff Member Roster Register
            </div>
            {filteredRoster.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No matching active employee records found in system scope storage.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredRoster.map((emp) => (
                  <div 
                    key={emp.employeeId} 
                    onClick={() => setSelectedEmployee(emp)}
                    className="flex items-center justify-between p-3 hover:bg-gray-50/80 cursor-pointer rounded-lg transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-full ${emp.bg} ${emp.text} border flex items-center justify-center font-bold text-sm shadow-2xs`}>
                        {emp.initial}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{emp.name}</h4>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">ID Ref: {emp.employeeId}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold border border-gray-200 bg-white px-3 py-1.5 rounded-md text-gray-500 group-hover:text-primary group-hover:border-primary transition-all shadow-2xs">
                      Audit Ledger →
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Detail Audit History View Log Mode */
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5 font-semibold">Calendar Date</th>
                  <th className="px-6 py-3.5 font-semibold">Check In</th>
                  <th className="px-6 py-3.5 font-semibold">Check Out</th>
                  <th className="px-6 py-3.5 font-semibold">Active Hours</th>
                  <th className="px-6 py-3.5 font-semibold">Overtime Margins</th>
                  <th className="px-6 py-3.5 font-semibold">Status Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {targetAttendanceLog.map((record, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-gray-50/60 transition-colors ${
                      record.status === 'Weekend' ? 'bg-gray-50/30 text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    <td className="px-6 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                      {format(record.date, 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 font-mono text-xs">{record.checkIn}</td>
                    <td className="px-6 py-3.5 text-gray-600 font-mono text-xs">{record.checkOut}</td>
                    <td className="px-6 py-3.5 font-mono text-gray-800 text-xs">{record.workHours}</td>
                    <td className="px-6 py-3.5 font-mono text-gray-400 text-xs">{record.extraHours}</td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        record.status === 'Present' ? 'bg-green-50 text-green-700 border-green-200' :
                        record.status === 'Leave' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-gray-100 text-gray-400 border-gray-200'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}