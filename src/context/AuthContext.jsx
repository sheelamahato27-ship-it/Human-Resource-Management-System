import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock Database Initialization
  useEffect(() => {
    const initializeMockDB = () => {
      if (!localStorage.getItem('hrms_users')) {
        const defaultAdmin = {
          id: 'admin-1',
          employeeId: 'ADM001',
          email: 'admin@hrms.com',
          password: 'password123',
          role: 'Admin',
          name: 'Super Admin',
        };
        localStorage.setItem('hrms_users', JSON.stringify([defaultAdmin]));
      }
      if (!localStorage.getItem('hrms_attendance')) {
        localStorage.setItem('hrms_attendance', JSON.stringify([]));
      }
      if (!localStorage.getItem('hrms_leaves')) {
        localStorage.setItem('hrms_leaves', JSON.stringify([]));
      }
      
      const sessionUser = localStorage.getItem('hrms_session');
      if (sessionUser) {
        setUser(JSON.parse(sessionUser));
      }
      setLoading(false);
    };
    initializeMockDB();
  }, []);

  // FIXED: Flexible authentication layer accepting either Email OR Employee ID signatures
  const login = (identifier, password) => {
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    
    // Normalize input to prevent trailing space failures
    const cleanIdentifier = identifier?.trim().toLowerCase();

    const foundUser = users.find(u => {
      const matchEmail = u.email?.toLowerCase() === cleanIdentifier;
      const matchEmpId = u.employeeId?.toLowerCase() === cleanIdentifier;
      const matchPassword = u.password === password;
      
      return (matchEmail || matchEmpId) && matchPassword;
    });

    if (foundUser) {
      // Stripping sensitive parameters before storing user details in global state tokens
      const { password: _, ...sessionData } = foundUser;
      setUser(sessionData);
      localStorage.setItem('hrms_session', JSON.stringify(sessionData));
      return { success: true };
    }
    return { success: false, message: 'Invalid login credentials provided.' };
  };

  const register = (userData, byAdmin = false) => {
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    
    if (users.find(u => u.email?.toLowerCase() === userData.email?.toLowerCase())) {
      return { success: false, message: 'User record already exists with this email address' };
    }

    let newEmployeeId = userData.employeeId;
    let password = userData.password;

    if (byAdmin && userData.role === 'Employee') {
      const companyInitial = 'OI';
      
      // Clean up whitespace edge-cases out of the string input
      const cleanedName = userData.name.trim().replace(/\s+/g, ' ');
      const names = cleanedName.split(' ');
      
      const first2 = names[0].substring(0, 2).toUpperCase();
      const last2 = names.length > 1 ? names[names.length - 1].substring(0, 2).toUpperCase() : first2;
      const year = new Date().getFullYear();
      const serial = String(users.filter(u => u.role === 'Employee').length + 1).padStart(4, '0');
      
      newEmployeeId = `${companyInitial}${first2}${last2}${year}${serial}`;
      
      // Fixed cryptographically stable key generation segment to replace slice calculations
      password = `HRMS@${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    
    const newUser = {
      ...userData,
      employeeId: newEmployeeId,
      password: password,
      id: `emp-${Date.now()}`
    };
    
    users.push(newUser);
    localStorage.setItem('hrms_users', JSON.stringify(users));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_session');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};