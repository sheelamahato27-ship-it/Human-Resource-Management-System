import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { format, addMonths, startOfYear, getDaysInMonth, startOfMonth, getDay, differenceInDays, parse, isValid, eachDayOfInterval } from 'date-fns';
import { Check, X, Plus, Calendar as CalendarIcon } from 'lucide-react';

export default function Leave() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [activeTab, setActiveTab] = useState('Time Off');
  
  // Modals & Forms State
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('Paid Time off');

  // Employee Stats (Mock totals)
  const availablePaid = 24;
  const availableSick = 7;

  // Tracked Requests State
  const [requests, setRequests] = useState([
    { id: 1, emp: 'John Doe', start: '2026-10-28', end: '2026-10-28', type: 'Paid Time Off', status: 'Pending' },
    { id: 2, emp: 'Sarah Smith', start: '2026-11-01', end: '2026-11-03', type: 'Sick Leave', status: 'Approved' }
  ]);

  // Calendar Engine Core Context References (Fixed to current project timeline 2026)
  const [currentYearDate] = useState(() => new Date(2026, 0, 1)); 
  const currentYear = currentYearDate.getFullYear();
  
  const months = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => addMonths(startOfYear(currentYearDate), i));
  }, [currentYearDate]);

  // Safe Pre-processed Map supporting complete cross-interval lookup coverage
  const approvedLeaveMap = useMemo(() => {
    const map = new Set();
    requests.forEach(r => {
      if (r.status !== 'Approved' || !r.start || !r.end) return;
      
      try {
        const startParsed = new Date(r.start);
        const endParsed = new Date(r.end);

        if (isValid(startParsed) && isValid(endParsed)) {
          const daysRange = eachDayOfInterval({ start: startParsed, end: endParsed });
          daysRange.forEach(date => {
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            map.add(key);
          });
        }
      } catch (e) {
        console.error("Date parsing mismatch handled:", e);
      }
    });
    return map;
  }, [requests]);

  // Fallback safe calculations for auto-allocation counter modules
  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isValid(start) || !isValid(end)) return 0;
    return Math.max(1, differenceInDays(end, start) + 1);
  }, [startDate, endDate]);

  const handleStatusChange = (id, newStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleCreateRequest = () => {
    if (!startDate || !endDate) return;

    const newRequest = {
      id: Date.now(),
      emp: user?.name || 'Current User',
      start: startDate,
      end: endDate,
      type: leaveType,
      status: 'Pending'
    };

    setRequests(prev => [newRequest, ...prev]);
    
    // Reset Form fields
    setStartDate('');
    setEndDate('');
    setLeaveType('Paid Time off');
    setShowModal(false);
  };

  const filteredRequests = requests.filter(req => {
    return (req.emp?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
           (req.type?.toLowerCase() || '').includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-20 px-4 max-w-7xl mx-auto text-gray-800">
      {isAdmin ? (
        /* Admin Dashboard View */
        <>
          <div className="flex border-b border-gray-200 mb-6">
            {['Time Off', 'Allocation'].map(tab => (
              <button 
                key={tab}
                className={`px-4 py-2 font-medium text-sm transition-all -mb-px ${activeTab === tab ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm font-bold text-gray-900 tracking-wide uppercase px-2">
                Operational Pipeline
              </div>
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-4 py-1.5 rounded-lg text-sm w-full sm:w-64 outline-none focus:border-primary focus:ring-2 focus:ring-indigo-100 transition-all" 
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">Name</th>
                    <th className="px-6 py-4 whitespace-nowrap">Start Date</th>
                    <th className="px-6 py-4 whitespace-nowrap">End Date</th>
                    <th className="px-6 py-4 whitespace-nowrap">Time off Type</th>
                    <th className="px-6 py-4 whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-gray-400 text-sm">
                        No allocation adjustments matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map(req => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{req.emp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {isValid(new Date(req.start)) ? format(new Date(req.start), 'dd/MM/yyyy') : req.start}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {isValid(new Date(req.end)) ? format(new Date(req.end), 'dd/MM/yyyy') : req.end}
                        </td>
                        <td className="px-6 py-4 text-primary font-medium whitespace-nowrap">{req.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            req.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                            req.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' : 
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {req.status === 'Pending' && (
                            <div className="flex space-x-2">
                              <button onClick={() => handleStatusChange(req.id, 'Rejected')} className="p-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors" title="Reject"><X size={16} /></button>
                              <button onClick={() => handleStatusChange(req.id, 'Approved')} className="p-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors" title="Approve"><Check size={16} /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Employee Interactive Grid View */
        <>
          <div className="border border-gray-100 rounded-xl shadow-sm p-6 bg-white">
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm mb-8"
            >
              <Plus size={16} /> <span>NEW REQUEST</span>
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="text-center p-6 border rounded-xl bg-gray-50/50">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Paid Time Off</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{availablePaid} <span className="text-sm font-normal text-gray-500">Days Available</span></p>
              </div>
              <div className="text-center p-6 border rounded-xl bg-gray-50/50">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Sick Time Off</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{availableSick} <span className="text-sm font-normal text-gray-500">Days Available</span></p>
              </div>
            </div>

            {/* Micro Calendar Rendering Engine */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><CalendarIcon className="mr-2 text-primary" size={18} /> {currentYear} Leave Matrix</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {months.map((month, idx) => {
                  const daysInMonth = getDaysInMonth(month);
                  const firstDay = getDay(startOfMonth(month));
                  const blanks = Array.from({ length: firstDay });
                  const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);
                  
                  return (
                    <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-white shadow-2xs">
                      <h4 className="text-center font-bold text-gray-800 mb-3 text-sm">{format(month, 'MMMM')}</h4>
                      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                      </div>
                      <div className="grid grid-cols-7 text-center text-xs gap-y-1.5 font-medium">
                        {blanks.map((_, i) => <div key={`blank-${idx}-${i}`}></div>)}
                        {days.map(d => {
                          const dateKey = `${month.getFullYear()}-${month.getMonth()}-${d}`;
                          const isLeave = approvedLeaveMap.has(dateKey);
                          
                          return (
                            <div 
                              key={`day-${idx}-${d}`} 
                              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-all ${
                                isLeave 
                                  ? 'bg-red-500 text-white font-bold shadow-xs' 
                                  : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                              }`}
                            >
                              {d}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Leave Request Dialog Overlay */}
      {showModal && !isAdmin && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/70">
              <h3 className="font-semibold text-gray-900 text-sm">Request Time Off</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="sm:w-1/3 text-sm font-medium text-gray-600 mb-1 sm:mb-0">Employee</label>
                <input type="text" disabled value={user?.name || 'Current User'} className="sm:w-2/3 bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 outline-none" />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="sm:w-1/3 text-sm font-medium text-gray-600 mb-1 sm:mb-0">Time off Type</label>
                <select 
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="sm:w-2/3 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-primary"
                >
                  <option>Paid Time Off</option>
                  <option>Sick Leave</option>
                  <option>Unpaid Leaves</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start">
                <label className="sm:w-1/3 text-sm font-medium text-gray-600 pt-2 mb-1 sm:mb-0">Validity Period</label>
                <div className="sm:w-2/3 flex flex-col sm:flex-row items-center gap-2 w-full">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" />
                  <span className="text-gray-400 text-xs font-medium uppercase">to</span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="sm:w-1/3 text-sm font-medium text-gray-600 mb-1 sm:mb-0">Calculated Allocation</label>
                <div className="sm:w-2/3 flex items-center space-x-2">
                  <input type="text" disabled value={calculatedDays} className="w-16 bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center font-bold text-gray-700" />
                  <span className="text-sm text-gray-500">Days Auto-Computed</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex justify-end space-x-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">Discard</button>
              <button onClick={handleCreateRequest} className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-xs">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}