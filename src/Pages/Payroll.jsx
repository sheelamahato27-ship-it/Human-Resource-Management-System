import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Download, Edit2, CheckCircle, Clock, Users, Save, X, ArrowUpRight } from 'lucide-react';

export default function Payroll() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  
  // Dynamic state database module 
  const [payrollData, setPayrollData] = useState([
    { id: 1, employeeName: 'Jane Smith', month: 'June 2026', base: 5000, bonus: 500, deductions: 200, net: 5300, status: 'Paid' },
    { id: 2, employeeName: 'John Doe', month: 'June 2026', base: 4500, bonus: 0, deductions: 150, net: 4350, status: 'Processing' },
    { id: 3, employeeName: user?.name || 'Demo Employee', month: 'June 2026', base: 6000, bonus: 1000, deductions: 300, net: 6700, status: 'Paid' },
  ]);

  // Editing Subsystem Context Trackers
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ base: 0, bonus: 0, deductions: 0 });

  // Derive filtered records dynamically
  const displayData = isAdmin ? payrollData : payrollData.filter(p => p.employeeName === user?.name);

  // Extract the user's latest paycheck metrics safely
  const userRecord = payrollData.find(p => p.employeeName === user?.name) || { base: 0, bonus: 0, deductions: 0, net: 0, month: 'June 2026' };

  // Calculate high-level metrics for the Admin Control Overview
  const totalCompanyOutflow = payrollData.reduce((acc, curr) => acc + curr.net, 0);
  const pendingProcessingCount = payrollData.filter(p => p.status === 'Processing').length;

  // Inline Modification Handling Layers
  const startEditing = (record) => {
    setEditingId(record.id);
    setEditForm({ base: record.base, bonus: record.bonus, deductions: record.deductions });
  };

  const handleSaveEdit = (id) => {
    setPayrollData(prev => prev.map(item => {
      if (item.id === id) {
        const base = Number(editForm.base) || 0;
        const bonus = Number(editForm.bonus) || 0;
        const deductions = Number(editForm.deductions) || 0;
        return {
          ...item,
          base,
          bonus,
          deductions,
          net: base + bonus - deductions
        };
      }
      return item;
    }));
    setEditingId(null);
  };

  const handleReleasePayment = (id) => {
    setPayrollData(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'Paid' } : item
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 pb-12 text-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isAdmin ? 'Payroll Control Panel' : 'My Payroll Hub'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage, track, and view distributed compensation statements.</p>
        </div>
      </div>

      {/* Dynamic Summary Cards Layer */}
      {isAdmin ? (
        /* Admin Statistical Insights Grid */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Gross Dynamic Payout</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">${totalCompanyOutflow.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-primary">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Active Staff Profiles</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{payrollData.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{pendingProcessingCount} Runs</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
              <Clock size={20} />
            </div>
          </div>
        </div>
      ) : (
        /* Employee Personal Earnings Breakdowns */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary text-white p-6 rounded-xl shadow-md flex flex-col justify-between">
            <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">Net Pay ({userRecord.month})</p>
            <h3 className="text-3xl font-bold mt-2">${userRecord.net.toLocaleString()}</h3>
          </div>
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Base Component</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">${userRecord.base.toLocaleString()}</h3>
          </div>
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Next Projected Payout</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">July 31, 2026</h3>
          </div>
        </div>
      )}

      {/* Salary History Matrix Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-md font-bold flex items-center space-x-2 text-gray-800">
            <DollarSign size={18} className="text-gray-400" />
            <span>Compensation & Ledger Logs</span>
          </h3>
          <span className="text-xs bg-gray-50 border px-2.5 py-1 rounded-md text-gray-500 font-medium">
            Showing {displayData.length} records
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                {isAdmin && <th className="px-6 py-3.5 font-semibold">Employee</th>}
                <th className="px-6 py-3.5 font-semibold">Month</th>
                <th className="px-6 py-3.5 font-semibold">Base Allocation</th>
                <th className="px-6 py-3.5 font-semibold">Bonus Variable</th>
                <th className="px-6 py-3.5 font-semibold">Deductions</th>
                <th className="px-6 py-3.5 font-bold text-gray-900">Net Distributed</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {displayData.map((record) => {
                const isEditing = editingId === record.id;
                const computedNet = isEditing 
                  ? (Number(editForm.base) || 0) + (Number(editForm.bonus) || 0) - (Number(editForm.deductions) || 0)
                  : record.net;

                return (
                  <tr key={record.id} className="hover:bg-gray-50/80 transition-colors">
                    {isAdmin && <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{record.employeeName}</td>}
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{record.month}</td>
                    
                    {/* Base Cell */}
                    <td className="px-6 py-4 text-gray-600 font-mono">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editForm.base}
                          onChange={e => setEditForm(prev => ({ ...prev, base: e.target.value }))}
                          className="border w-20 px-2 py-1 rounded text-sm focus:border-primary outline-none"
                        />
                      ) : (
                        `$${record.base.toLocaleString()}`
                      )}
                    </td>
                    
                    {/* Bonus Cell */}
                    <td className="px-6 py-4 text-green-600 font-mono whitespace-nowrap">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editForm.bonus}
                          onChange={e => setEditForm(prev => ({ ...prev, bonus: e.target.value }))}
                          className="border w-16 px-2 py-1 rounded text-sm text-green-600 focus:border-primary outline-none"
                        />
                      ) : (
                        `+$${record.bonus.toLocaleString()}`
                      )}
                    </td>
                    
                    {/* Deductions Cell */}
                    <td className="px-6 py-4 text-red-500 font-mono whitespace-nowrap">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editForm.deductions}
                          onChange={e => setEditForm(prev => ({ ...prev, deductions: e.target.value }))}
                          className="border w-16 px-2 py-1 rounded text-sm text-red-500 focus:border-primary outline-none"
                        />
                      ) : (
                        `-$${record.deductions.toLocaleString()}`
                      )}
                    </td>
                    
                    {/* Calculated Net Output Cell */}
                    <td className="px-6 py-4 font-bold text-gray-900 font-mono">
                      ${computedNet.toLocaleString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs rounded-full font-medium ${
                        record.status === 'Paid' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {record.status === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {record.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      {isEditing ? (
                        <>
                          <button onClick={() => handleSaveEdit(record.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-all" title="Save Ledger Structure">
                            <Save size={15} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-all" title="Cancel Modification">
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          {isAdmin && record.status === 'Processing' && (
                            <button onClick={() => handleReleasePayment(record.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all inline-flex items-center gap-0.5 text-xs font-semibold" title="Approve Distribution">
                              <ArrowUpRight size={14} /> Release
                            </button>
                          )}
                          {isAdmin && (
                            <button onClick={() => startEditing(record)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-md transition-all" title="Edit Structure">
                              <Edit2 size={15} />
                            </button>
                          )}
                          <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-md transition-all" title="Download Payslip">
                            <Download size={15} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}