import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
export default function Attendance() {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const handleCheckInOut = () => {
    if (!isCheckedIn) {
      setCheckInTime(new Date());
      setIsCheckedIn(true);
    } else {
      setIsCheckedIn(false);
      // In a real app, save attendance record here
    }
  };
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(weekStart, i));
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
        
        <div className="bg-surface p-2 rounded-lg border border-gray-100 flex items-center space-x-4 shadow-sm">
          <div className="text-sm">
            <p className="text-gray-500">Status</p>
            <p className={`font-semibold ${isCheckedIn ? 'text-green-600' : 'text-gray-900'}`}>
              {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </p>
          </div>
          <button 
            onClick={handleCheckInOut}
            className={`px-6 py-2 rounded-md font-medium text-white transition-all shadow-sm ${
              isCheckedIn 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-primary hover:bg-indigo-700'
            }`}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <CalendarIcon size={20} className="text-gray-500" />
                <span>This Week's Attendance</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-4">
                {weekDays.map((day, i) => {
                  const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                  // Mock past attendance
                  const isPast = day < today && !isToday;
                  const status = isPast ? (i === 2 ? 'Absent' : 'Present') : (isToday && isCheckedIn ? 'Present' : '-');
                  
                  return (
                    <div key={i} className={`text-center p-4 rounded-xl border ${isToday ? 'border-primary bg-indigo-50/50' : 'border-gray-100'}`}>
                      <p className="text-xs text-gray-500 uppercase font-medium tracking-wider">{format(day, 'EEE')}</p>
                      <p className="text-lg font-bold text-gray-900 my-1">{format(day, 'd')}</p>
                      <div className="mt-2 flex justify-center">
                        {status === 'Present' && <CheckCircle size={20} className="text-green-500" />}
                        {status === 'Absent' && <XCircle size={20} className="text-red-500" />}
                        {status === '-' && <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Today's Log</h3>
            {checkInTime ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Checked In</p>
                    <p className="text-xs text-gray-500">{format(checkInTime, 'hh:mm a')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">You haven't checked in yet today.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );}