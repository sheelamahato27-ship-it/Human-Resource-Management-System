import { useAuth } from '../context/AuthContext';
import { Users, UserCheck, UserX, Clock, UserPlus, X, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const { user, createEmployee } = useAuth();
  const [employees, setEmployees] = useState([]);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  
  // New Employee Form data
  const [newEmpData, setNewEmpData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    baseSalary: '5000',
    joiningDate: new Date().toISOString().split('T')[0]
  });
  
  // Generated Credentials state
  const [generatedCreds, setGeneratedCreds] = useState({
    employeeId: '',
    tempPassword: ''
  });
  
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);

  const fetchEmployees = () => {
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    setEmployees(users.filter(u => u.role === 'Employee'));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    setNewEmpData({ ...newEmpData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setError('');

    const res = createEmployee(newEmpData);
    if (res.success) {
      setGeneratedCreds({
        employeeId: res.employeeId,
        tempPassword: res.tempPassword
      });
      setShowAddModal(false);
      setShowCredentialsModal(true);
      
      // Reset form
      setNewEmpData({
        name: '',
        email: '',
        department: 'Engineering',
        designation: 'Software Engineer',
        baseSalary: '5000',
        joiningDate: new Date().toISOString().split('T')[0]
      });
      
      // Refresh list
      fetchEmployees();
    } else {
      setError(res.message);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPwd(true);
      setTimeout(() => setCopiedPwd(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-sm text-gray-500">{user?.companyName} • HR Operations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
        >
          <UserPlus size={16} />
          <span>Add Employee</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-lg font-semibold text-gray-900">{employees.length}</p>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Present Today</p>
            <p className="text-lg font-semibold text-gray-900">--</p>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">On Leave</p>
            <p className="text-lg font-semibold text-gray-900">--</p>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Approvals</p>
            <p className="text-lg font-semibold text-gray-900">0</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Employee Directory</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
            {employees.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Department</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No employees found. Click "Add Employee" to create one.
                  </td>
                </tr>
              ) : (
                employees.map((emp, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary text-xs font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.designation}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-700">{emp.employeeId}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{emp.email}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{emp.department}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                        {emp.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 relative">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Add New Employee</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  name="name" 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={newEmpData.name} 
                  onChange={handleInputChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Corporate Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  required
                  placeholder="e.g. john.doe@company.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={newEmpData.email} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select 
                    name="department"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    value={newEmpData.department}
                    onChange={handleInputChange}
                  >
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input 
                    name="designation" 
                    type="text" 
                    required
                    placeholder="e.g. Frontend Dev"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    value={newEmpData.designation} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary ($)</label>
                  <input 
                    name="baseSalary" 
                    type="number" 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    value={newEmpData.baseSalary} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                  <input 
                    name="joiningDate" 
                    type="date" 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    value={newEmpData.joiningDate} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-primary hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Generated Modal */}
      {showCredentialsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto">
              <UserCheck size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Employee Registered!</h3>
              <p className="text-sm text-gray-500">
                Please copy and share these system-generated login credentials with the employee:
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-150 text-left font-sans">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Generated Login ID</p>
                <div className="flex justify-between items-center bg-white border border-gray-200 px-3 py-2 rounded-lg">
                  <span className="font-mono font-bold text-gray-800">{generatedCreds.employeeId}</span>
                  <button 
                    onClick={() => copyToClipboard(generatedCreds.employeeId, 'id')}
                    className="text-gray-400 hover:text-primary transition-colors p-1 rounded hover:bg-gray-50"
                  >
                    {copiedId ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Temporary Password</p>
                <div className="flex justify-between items-center bg-white border border-gray-200 px-3 py-2 rounded-lg">
                  <span className="font-mono text-gray-700 font-medium">{generatedCreds.tempPassword}</span>
                  <button 
                    onClick={() => copyToClipboard(generatedCreds.tempPassword, 'pwd')}
                    className="text-gray-400 hover:text-primary transition-colors p-1 rounded hover:bg-gray-50"
                  >
                    {copiedPwd ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowCredentialsModal(false)}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}