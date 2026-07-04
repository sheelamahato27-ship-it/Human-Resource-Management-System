import { useAuth } from '../context/AuthContext';
import { User, Calendar, FileText, Clock } from 'lucide-react';
export default function EmployeeDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="text-lg font-semibold text-gray-900">{user?.employeeId}</p>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Attendance</p>
            <p className="text-lg font-semibold text-gray-900">95%</p>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Leaves</p>
            <p className="text-lg font-semibold text-gray-900">1</p>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today's Status</p>
            <p className="text-lg font-semibold text-gray-900">Present</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-sm">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500"></div>
              <div>
                <p className="text-gray-900">Checked in at 09:00 AM</p>
                <p className="text-gray-500">Today</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-sm">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500"></div>
              <div>
                <p className="text-gray-900">Applied for Sick Leave</p>
                <p className="text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Upcoming Holidays</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <div>
                <p className="text-gray-900 font-medium">Independence Day</p>
                <p className="text-sm text-gray-500">National Holiday</p>
              </div>
              <span className="text-sm font-medium text-primary">Aug 15</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <div>
                <p className="text-gray-900 font-medium">Labor Day</p>
                <p className="text-sm text-gray-500">National Holiday</p>
              </div>
              <span className="text-sm font-medium text-primary">Sep 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
