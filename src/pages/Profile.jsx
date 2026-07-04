import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit2, Save, X, Key, Check } from 'lucide-react';

export default function Profile() {
  const { user, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile fields state
  const [formData, setFormData] = useState({
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || '123 Main St, Odoo India HQ',
    department: user?.department || 'Engineering',
    designation: user?.designation || 'Software Developer'
  });

  // Password fields state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChangeInput = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save updated details back to user in localStorage
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
      localStorage.setItem('hrms_users', JSON.stringify(users));
      
      // Update session storage so changes reflect on page reload
      const sessionData = JSON.parse(localStorage.getItem('hrms_session') || '{}');
      localStorage.setItem('hrms_session', JSON.stringify({ ...sessionData, ...formData }));
    }
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwdError("New passwords do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters.");
      return;
    }

    const res = changePassword(passwords.currentPassword, passwords.newPassword);
    if (res.success) {
      setPwdSuccess("Password changed successfully!");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPwdError(res.message);
    }
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-100">
          <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-4xl text-primary font-bold shadow-inner">
            {user?.name?.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
            <p className="text-gray-500">{formData.designation} • {formData.department}</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Login ID (Employee ID)</p>
                <p className="font-mono font-medium text-gray-900">{user?.employeeId || 'Admin Account'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <h4 className="text-lg font-semibold mb-6">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input 
                name="phone"
                type="text" 
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg outline-none transition-all ${isEditing ? 'border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary' : 'bg-gray-50 text-gray-700 border-transparent'}`}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input 
                name="address"
                type="text" 
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-lg outline-none transition-all ${isEditing ? 'border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary' : 'bg-gray-50 text-gray-700 border-transparent'}`}
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            {/* Admin only fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input 
                name="department"
                type="text" 
                disabled={!isEditing || !isAdmin}
                className={`w-full px-4 py-2 rounded-lg outline-none transition-all ${(isEditing && isAdmin) ? 'border border-gray-300 focus:ring-2 focus:ring-primary' : 'bg-gray-50 text-gray-700 border-transparent'}`}
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <input 
                name="designation"
                type="text" 
                disabled={!isEditing || !isAdmin}
                className={`w-full px-4 py-2 rounded-lg outline-none transition-all ${(isEditing && isAdmin) ? 'border border-gray-300 focus:ring-2 focus:ring-primary' : 'bg-gray-50 text-gray-700 border-transparent'}`}
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security settings card */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 p-8">
        <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2">
          <Key size={20} className="text-gray-500" />
          <span>Security Settings</span>
        </h4>
        
        {pwdError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 max-w-lg">
            {pwdError}
          </div>
        )}
        {pwdSuccess && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm border border-green-100 flex items-center space-x-2 max-w-lg">
            <Check size={16} />
            <span>{pwdSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input 
              name="currentPassword"
              type="password" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
              value={passwords.currentPassword}
              onChange={handlePasswordChangeInput}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                name="newPassword"
                type="password" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                value={passwords.newPassword}
                onChange={handlePasswordChangeInput}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                name="confirmPassword"
                type="password" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                value={passwords.confirmPassword}
                onChange={handlePasswordChangeInput}
              />
            </div>
          </div>
          <button 
            type="submit"
            className="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}