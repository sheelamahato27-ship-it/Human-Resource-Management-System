import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Download, Edit2 } from 'lucide-react';
export default function Payroll() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [payrollData] = useState([
    { id: 1, employeeName: 'Jane Smith', month: 'June 2026', base: 5000, bonus: 500, deductions: 200, net: 5300, status: 'Paid' },
    { id: 2, employeeName: 'John Doe', month: 'June 2026', base: 4500, bonus: 0, deductions: 150, net: 4350, status: 'Processing' },
    { id: 3, employeeName: user?.name, month: 'June 2026', base: 6000, bonus: 1000, deductions: 300, net: 6700, status: 'Paid' },
  ]);
  const displayData = isAdmin ? payrollData : payrollData.filter(p => p.employeeName === user?.name);
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{isAdmin ? 'Payroll Control' : 'My Payroll'}</h2>
      </div>
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary text-white p-6 rounded-xl shadow-md">
            <p className="text-indigo-100 text-sm mb-1">Net Pay (Last Month)</p>
            <h3 className="text-3xl font-bold">$6,700</h3>
          </div>
          <div className="bg-surface border border-gray-100 p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Base Salary</p>
            <h3 className="text-2xl font-bold text-gray-900">$6,000</h3>
          </div>
          <div className="bg-surface border border-gray-100 p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Next Payout</p>
            <h3 className="text-2xl font-bold text-gray-900">July 31, 2026</h3>
          </div>
        </div>
      )}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <DollarSign size={20} className="text-gray-500" />
            <span>Salary History</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                {isAdmin && <th className="px-6 py-3 font-medium">Employee</th>}
                <th className="px-6 py-3 font-medium">Month</th>
                <th className="px-6 py-3 font-medium">Base</th>
                <th className="px-6 py-3 font-medium">Bonus</th>
                <th className="px-6 py-3 font-medium">Deductions</th>
                <th className="px-6 py-3 font-medium text-gray-900">Net Pay</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {isAdmin && <td className="px-6 py-4 font-medium text-gray-900">{record.employeeName}</td>}
                  <td className="px-6 py-4 text-gray-600">{record.month}</td>
                  <td className="px-6 py-4 text-gray-600">${record.base}</td>
                  <td className="px-6 py-4 text-green-600">+${record.bonus}</td>
                  <td className="px-6 py-4 text-red-600">-${record.deductions}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${record.net}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      record.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {isAdmin && (
                      <button className="text-gray-400 hover:text-primary transition-colors" title="Edit Structure">
                        <Edit2 size={16} />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-primary transition-colors" title="Download Payslip">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}