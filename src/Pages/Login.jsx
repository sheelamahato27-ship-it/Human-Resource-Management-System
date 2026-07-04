import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Login() {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract deep-linked location history if routed from a ProtectedRoute guard
  const fromDestination = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      // Execute credential check on context layer
      const res = login(credential.trim(), password);
      
      if (res.success) {
        // Forward to their previous destination page or the base routing dispatcher
        navigate(fromDestination, { replace: true });
      } else {
        setError(res.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected system error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-md transition-all">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto shadow-sm mb-3">
            OI
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to manage your workstation session</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-lg mb-6 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Email Address or Employee ID
            </label>
            <input 
              type="text" 
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-primary outline-none transition-all disabled:opacity-60"
              placeholder="admin@hrms.com or OIXXXX20260001"
              value={credential}
              onChange={e => setCredential(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Password
              </label>
              <span className="text-xs text-gray-400 cursor-not-allowed hover:text-gray-500">
                Forgot?
              </span>
            </div>
            <input 
              type="password" 
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-primary outline-none transition-all disabled:opacity-60"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-xs text-sm mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? 'Verifying Session...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Don't have an employee account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register Corporate ID
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}