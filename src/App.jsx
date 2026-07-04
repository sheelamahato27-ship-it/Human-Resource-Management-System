import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Layout from './components/Layout';
import EmployeeDashboard from './Pages/EmployeeDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import Profile from './Pages/profile';
import Attendance from './Pages/Attendance';
import Leave from './Pages/Leave';
import Payroll from './Pages/Payroll';
import Employees from './Pages/Employees';
// Robust Route Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Loading authentication session...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
const App = () => {
  const { user, loading } = useAuth();
  return (
    <Router>
      <Routes>
        {/* Public Authentication Gateways */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Universal Unified Protected Dashboard Core */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dynamic Core landing point resolver based on validated auth tokens */}
          <Route 
            index 
            element={
              loading ? (
                <div className="p-8 text-center text-gray-500">Resolving Landing Portal...</div>
              ) : user?.role === 'Admin' ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          {/* Unified Feature Views (Both Roles use identical paths inside Layout navigation links) */}
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<Leave />} />
          <Route path="payroll" element={<Payroll />} />
          {/* Strict Admin-Only Functional Route Scopes */}
          <Route 
            path="admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="employees" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Employees />
              </ProtectedRoute>
            } 
          />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
        </Route>
        {/* Global Catch-all Error Fallback Routing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
export default App;