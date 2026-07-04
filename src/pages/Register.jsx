import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Upload } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    companyName: '',
    companyLogo: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, companyLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Register user as Admin with company details
    const { confirmPassword: _, ...registerData } = formData;
    const res = register(registerData);
    
    if (res.success) {
      navigate('/login');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-surface p-8 rounded-xl shadow-xl w-full max-w-lg border border-gray-100">
        <div className="text-center mb-8">
          {formData.companyLogo ? (
            <img src={formData.companyLogo} alt="Company Logo" className="mx-auto h-16 w-auto object-contain mb-3 rounded-lg shadow-sm" />
          ) : (
            <div className="mx-auto h-16 w-16 bg-indigo-50 rounded-xl flex items-center justify-center text-primary font-bold text-2xl mb-3 shadow-inner">
              HRMS
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Corporate Account</h1>
          <p className="text-gray-500 mt-2">Sign up as Admin/HR to manage your team</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input 
                name="companyName" 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={formData.companyName} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden" 
                  id="logo-upload" 
                />
                <label 
                  htmlFor="logo-upload"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium text-gray-700"
                >
                  <Upload size={16} className="text-gray-500" />
                  <span>{formData.companyLogo ? "Change Logo" : "Upload Logo"}</span>
                </label>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 my-2" />

          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HR/Admin Full Name</label>
              <input 
                name="name" 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={formData.name} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                name="phone" 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={formData.phone} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Corporate Email Address</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all pr-10"
                  value={formData.password} 
                  onChange={handleChange} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input 
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all pr-10"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg mt-6 shadow-md transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}