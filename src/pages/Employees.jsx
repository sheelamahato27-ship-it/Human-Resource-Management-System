import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Employees() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';
  
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: ''
  });
  const [newCredentials, setNewCredentials] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    setEmployees(users.filter(u => u.role === 'Employee'));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const res = register({ ...formData, role: 'Employee' }, true);
    if (res.success) {
      setNewCredentials({ id: res.user.employeeId, password: res.user.password });
      // Direct state update sync fallback to prevent localized localStorage race states
      setEmployees(prev => [...prev, { ...formData, role: 'Employee', employeeId: res.user.employeeId }]);
      setFormData({ name: '', email: '', phone: '' });
    } else {
      alert(res.message);
    }
  };

  const getStatusDot = (emp) => {
    if (!emp.name) return 'bg-green-500';
    if (emp.name.length % 3 === 0) return 'bg-yellow-400'; // Absent
    if (emp.name.length % 3 === 1) return 'bg-blue-400';   // Leave
    return 'bg-green-500';                                 // Present
  };

  return (
    <div className="space-y-6 text-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Employees Directory</h2>
        {isAdmin && (
          <button 
            onClick={() => { setShowModal(true); setNewCredentials(null); }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>NEW</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {employees.map(emp => {
          const targetId = emp.employeeId || emp.id;
          return (
            <div 
              key={targetId} 
              // FIXED: Corrected route mapping string parameters to match unified app engine paths
              onClick={() => navigate(`/profile/${targetId}`)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer relative group"
            >
              <div className={`absolute top-4 right-4 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusDot(emp)}`}></div>
              
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl text-primary font-bold shadow-inner mb-4">
                  {emp.name ? emp.name.charAt(0) : 'U'}
                </div>
                <h3 className="font-bold text-gray-900 text-lg truncate w-full text-center group-hover:text-primary transition-colors">{emp.name || 'Unknown'}</h3>
                <p className="text-sm text-gray-500 truncate w-full text-center">{emp.email}</p>
                <p className="text-xs text-gray-400 mt-2 font-mono bg-gray-50 px-2 py-0.5 rounded border">{targetId}</p>
              </div>
            </div>
          );
        })}

        {employees.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 text-sm">
            No employee directory profiles verified in system context.
          </div>
        )}
      </div>

      {/* Employee Generation Modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/70">
              <h3 className="font-semibold text-gray-900 text-sm">Create New Employee</h3>
              <button onClick={() => { setShowModal(false); loadEmployees(); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              {!newCredentials ? (
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                    <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                    <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm" placeholder="john@company.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Phone Line</label>
                    <input type="tel" required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm" placeholder="+1 (555) 000-0000" />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-6 text-sm shadow-xs">
                    Generate Employee ID & Password
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="text-md font-bold text-gray-900">Employee Created Successfully!</h4>
                  <div className="bg-gray-50 p-4 rounded-lg text-left space-y-3 border border-gray-200">
                    <p className="text-xs text-gray-500 leading-relaxed">Please share these auto-generated profile markers securely with the user.</p>
                    <div className="pt-2">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Login ID</p>
                      <p className="font-mono text-base font-bold text-gray-900 selection:bg-indigo-100">{newCredentials.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Temporary Password</p>
                      <p className="font-mono text-base font-bold text-primary selection:bg-indigo-100">{newCredentials.password}</p>
                    </div>
                  </div>
                  <button onClick={() => { setShowModal(false); loadEmployees(); }} className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
