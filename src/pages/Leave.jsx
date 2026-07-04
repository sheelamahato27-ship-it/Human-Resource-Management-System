                                                                                                                                                                                   import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Check, X, Clock } from 'lucide-react';
export default function Leave() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Sick Leave', startDate: '2026-07-10', endDate: '2026-07-11', status: 'Pending', remarks: 'Fever', employeeName: 'John Doe' },
    { id: 2, type: 'Paid Leave', startDate: '2026-08-01', endDate: '2026-08-05', status: 'Approved', remarks: 'Vacation', employeeName: 'Jane Smith' }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Paid Leave',
    startDate: '',
    endDate: '',
    remarks: ''
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeave = {
      ...formData,
      id: Date.now(),
      status: 'Pending',
      employeeName: user.name
    };
    setLeaves([newLeave, ...leaves]);
    setShowForm(false);
    setFormData({ type: 'Paid Leave', startDate: '', endDate: '', remarks: '' });
  };
  const updateStatus = (id, newStatus) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved': return <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">Approved</span>;
      case 'Rejected': return <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full font-medium">Rejected</span>;
      default: return <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full font-medium">Pending</span>;
    }
  };
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{isAdmin ? 'Leave Approvals' : 'Leave Requests'}</h2>
        {!isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Apply for Leave'}
          </button>
        )}
      </div>
      {!isAdmin && showForm && (
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">New Leave Application</h3>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>Paid Leave</option>
                  <option>Sick Leave</option>
                  <option>Unpaid Leave</option>
                </select>
              </div>
              <div className="hidden md:block"></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input 
                  type="date" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea 
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                value={formData.remarks}
                onChange={e => setFormData({...formData, remarks: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700">
              Submit Request
            </button>
          </form>
        </div>
      )}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                {isAdmin && <th className="px-6 py-3 font-medium">Employee</th>}
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Remarks</th>
                <th className="px-6 py-3 font-medium">Status</th>
                {isAdmin && <th className="px-6 py-3 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.filter(l => isAdmin || l.employeeName === user.name).map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  {isAdmin && <td className="px-6 py-4 font-medium text-gray-900">{leave.employeeName}</td>}
                  <td className="px-6 py-4 text-gray-600">{leave.type}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {format(new Date(leave.startDate), 'MMM d, yyyy')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">{leave.remarks}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(leave.status)}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right space-x-2">
                      {leave.status === 'Pending' ? (
                        <>
                          <button onClick={() => updateStatus(leave.id, 'Approved')} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Approve">
                            <Check size={18} />
                          </button>
                          <button onClick={() => updateStatus(leave.id, 'Rejected')} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">Processed</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}