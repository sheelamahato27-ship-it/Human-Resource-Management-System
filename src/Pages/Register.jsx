import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
    role: 'Employee'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Automatically sanitize and capitalize Employee IDs on input change
    if (e.target.name === 'employeeId') {
      value = value.toUpperCase().replace(/\s/g, ''); 
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setError('');

    // Pre-flight validation checks
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    // Cross-validate for duplicate local Employee IDs before calling register
    const existingUsers = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    const isIdTaken = existingUsers.some(
      u => u.employeeId?.trim().toLowerCase() === formData.employeeId.trim().toLowerCase()
    );

    if (isIdTaken) {
      setError("This Employee ID is already registered to another user profile.");
      setIsSubmitting(false);
      return;
    }

    // Clean up trailing/leading spaces on submission names
    const submissionsData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim()
    };

    try {
      const res = register(submissionsData, false);
      
      if (res.success) {
        navigate('/login');
      } else {
        setError(res.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("A critical registration error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 py-12 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-md transition-all">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto shadow-sm mb-3">
            OI
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Join HRMS Portal</h1>
          <p className="text-sm text-gray-400 mt-1">Register your organization credentials</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-lg mb-6 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
            <input 
              name="name" 
              type="text" 
              required
              disabled={isSubmitting}
              placeholder="John Doe"
              className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-primary outline-none transition-all disabled:opacity-60"
              value={formData.name} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Corporate Employee ID</label>
            <input 
              name="employeeId" 
              type="text" 
              required
              disabled={isSubmitting}
              placeholder="e.g., OIDO20260001"
              className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-primary outline-none uppercase font-mono tracking-wider transition-all disabled:opacity-60"
              value={formData.employeeId} 
              onChange={handleChange} 
            />
            <p className="text-[11px] text-gray-400 mt-1.5 leading-normal">
              Must exactly match the structural tracking identifier assignment code provided by HR.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required
              disabled={isSubmitting}
              placeholder="john@company.com"
              className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-primary outline-none transition-all disabled:opacity-60"
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Create Password</label>
            <input 
              name="password" 
              type="password" 
              required
              disabled={isSubmitting}
              placeholder="••••••••"
              className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-primary outline-none transition-all disabled:opacity-60"
              value={formData.password} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Account Role Designation</label>
            <select 
              name="role"
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-primary outline-none transition-all disabled:opacity-60 cursor-pointer"
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="Employee">Standard Employee Track</option>
              <option value="Admin">System Administrator / HR</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg mt-6 transition-all shadow-xs text-sm disabled:opacity-70 flex items-center justify-center"
          >
            {isSubmitting ? 'Creating Secure Account...' : 'Register Account'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Already have an active profile?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}