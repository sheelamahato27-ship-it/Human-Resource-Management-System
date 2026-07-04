import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Briefcase, User, Edit2, ShieldAlert } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { id } = useParams();
  const isAdmin = user?.role === 'Admin';
  
  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Resume');
  
  // Salary State Structure
  const [salaryData, setSalaryData] = useState({
    wage: 50000,
    basicPct: 50,
    hraPct: 50,
    standardAllowance: 4167,
    performancePct: 8.33,
    ltaPct: 8.33,
    pfPct: 12,
    profTax: 200
  });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    if (id) {
      const found = users.find(u => u.id === id || u.employeeId === id);
      setProfileUser(found || user);
    } else {
      setProfileUser(user);
    }
  }, [id, user]);

  if (!profileUser) {
    return (
      <div className="p-12 text-center text-sm font-semibold text-gray-400 flex flex-col items-center justify-center space-y-2">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        <span>Loading corporate profile session...</span>
      </div>
    );
  }

  // Auto Mathematical Components Calculations
  const basic = (salaryData.wage * (salaryData.basicPct / 100));
  const hra = (basic * (salaryData.hraPct / 100));
  const performanceBonus = (basic * (salaryData.performancePct / 100));
  const lta = (basic * (salaryData.ltaPct / 100));
  
  const totalComponents = basic + hra + salaryData.standardAllowance + performanceBonus + lta;
  const fixedAllowance = Math.max(0, salaryData.wage - totalComponents);
  const pf = (basic * (salaryData.pfPct / 100));
  const deductions = pf + salaryData.profTax;

  const tabs = ['Resume', 'Private Info'];
  if (isAdmin) tabs.push('Salary Info');
  tabs.push('Security');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 text-gray-800">
      {/* Profile Banner Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-linear-to-r from-indigo-600 to-indigo-400"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-14 flex items-end space-x-5">
            <div className="w-28 h-28 rounded-xl border-4 border-white bg-indigo-50 text-indigo-700 flex items-center justify-center text-4xl font-extrabold shadow-sm relative group">
              {profileUser.name?.charAt(0) || 'U'}
              {isAdmin && (
                <button className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-primary transition-all">
                  <Edit2 size={12} />
                </button>
              )}
            </div>
            <div className="mb-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{profileUser.name}</h1>
              <p className="text-xs font-semibold text-gray-400 flex items-center mt-0.5 uppercase tracking-wider">
                <Briefcase size={13} className="mr-1.5 text-gray-300" /> {profileUser.role || 'Staff Member'}
              </p>
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
            <div className="flex items-center text-xs text-gray-500">
              <Mail size={14} className="mr-2.5 text-gray-400 shrink-0" />
              <span className="truncate">{profileUser.email}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Phone size={14} className="mr-2.5 text-gray-400 shrink-0" />
              <span>{profileUser.phone || '+1 (555) 000-0000'}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin size={14} className="mr-2.5 text-gray-400 shrink-0" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <User size={14} className="mr-2.5 text-gray-400 shrink-0" />
              <span className="font-mono font-bold text-gray-700">ID: {profileUser.employeeId || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher Options Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-x-auto p-1.5 space-x-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab 
                ? 'bg-indigo-50 text-primary shadow-2xs' 
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Tab Render Workspace */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-75">
        {activeTab === 'Resume' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 mb-3">About Me</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Corporate professional designated within the operations track hierarchy. Specialized execution expertise across development paradigms.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 mb-3">Core Philosophy</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Building seamless and intuitive user experiences that bridge the gap between architectural layout requirements and database structural integrity.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'State Architectures'].map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 mb-3">Certifications</h3>
                  <div className="p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                    <p className="font-semibold text-gray-900 text-xs">Internal Systems Certified Developer</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Issued Jan 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Private Info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 mb-2">Personal Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Date of Birth</span>
                  <span className="font-semibold text-gray-800">15 Aug 1995</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Nationality</span>
                  <span className="font-semibold text-gray-800">American</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 mb-2">Bank Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Disbursement Account No</span>
                  <span className="font-mono font-semibold text-gray-800">XXXX-XXXX-1234</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Salary Info' && isAdmin && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-gray-100 pb-6 gap-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Defined Base Monthly Wage</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">₹</span>
                  <input 
                    type="number" 
                    value={salaryData.wage}
                    onChange={(e) => setSalaryData({...salaryData, wage: Number(e.target.value)})}
                    className="text-2xl font-black text-primary w-36 bg-transparent outline-none border-b border-dashed border-gray-300 focus:border-primary transition-colors"
                  />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">/ Month</span>
                </div>
              </div>
              <div className="sm:text-right bg-gray-50 p-3 rounded-lg border border-gray-100 min-w-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Calculated Yearly CTC</p>
                <p className="text-lg font-black text-gray-900 mt-0.5">₹ {(salaryData.wage * 12).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Earnings Column - FIXED to display ALL hidden mathematical components */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wide text-gray-900 border-b border-gray-100 pb-2 flex justify-between">
                  Monthly Earnings Breakdown <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-sm uppercase tracking-wider">Auto Computed</span>
                </h4>
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <p className="font-semibold text-gray-800">Basic Salary</p>
                      <p className="text-[11px] text-gray-400">50% of Wage baseline allocation</p>
                    </div>
                    <p className="font-mono font-bold text-gray-900">₹ {basic.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800">House Rent Allowance (HRA)</p>
                      <p className="text-[11px] text-gray-400">50% of Basic salary baseline</p>
                    </div>
                    <p className="font-mono font-bold text-gray-900">₹ {hra.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800">Standard Allowance</p>
                      <p className="text-[11px] text-gray-400">Fixed statutory component mapping</p>
                    </div>
                    <p className="font-mono font-bold text-gray-900">₹ {salaryData.standardAllowance.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800">Performance Incentive Pool</p>
                      <p className="text-[11px] text-gray-400">8.33% statutory calculation pool</p>
                    </div>
                    <p className="font-mono font-bold text-gray-900">₹ {performanceBonus.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800">Leave Travel Allowance (LTA)</p>
                      <p className="text-[11px] text-gray-400">8.33% component pool sizing</p>
                    </div>
                    <p className="font-mono font-bold text-gray-900">₹ {lta.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="flex justify-between items-center bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100/50">
                    <div>
                      <p className="font-bold text-indigo-900 text-xs">Special Fixed Allowance</p>
                      <p className="text-[10px] text-indigo-500">Calculated remainder balancing margin</p>
                    </div>
                    <p className="font-mono font-bold text-indigo-900">₹ {fixedAllowance.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                </div>
              </div>

              {/* Deductions & Summary Column */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wide text-gray-900 border-b border-gray-100 pb-2">Deductions & Retainers</h4>
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <p className="font-semibold text-gray-800">PF Contribution Contribution</p>
                      <p className="text-[11px] text-gray-400">12% matched component size of Basic</p>
                    </div>
                    <p className="font-mono font-bold text-red-500">- ₹ {pf.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800">Professional Tax (PT)</p>
                      <p className="text-[11px] text-gray-400">Statutory regional location deduction fix</p>
                    </div>
                    <p className="font-mono font-bold text-red-500">- ₹ {salaryData.profTax.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t-2 bg-green-50/40 p-4 rounded-xl border border-green-100/60">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Net Take-Home Yield</p>
                      <p className="text-[11px] text-green-600 mt-0.5">Estimated liquidity payout after metrics</p>
                    </div>
                    <p className="font-mono text-2xl font-black text-green-600">₹ {(salaryData.wage - deductions).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Security' && (
          <div className="space-y-5 max-w-sm">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 mb-4">Security Settings</h3>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-primary transition-all" />
            </div>
            <button className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-all">
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}