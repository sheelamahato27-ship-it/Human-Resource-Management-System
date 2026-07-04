import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ID Helper: Get Company Initials
const getCompanyInitials = (name) => {
  if (!name) return 'CO';
  const words = name.trim().split(/\s+/);
  if (words.length > 1) {
    return words.map(w => w.charAt(0).toUpperCase()).join('').substring(0, 3);
  }
  return name.substring(0, 2).toUpperCase();
};

// ID Helper: Get Employee First & Last Name Initials
const getEmployeeInitials = (name) => {
  if (!name) return 'XX';
  const parts = name.trim().split(/\s+/);
  const firstInitial = parts[0]?.charAt(0).toUpperCase() || 'X';
  const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : 'X';
  return firstInitial + lastInitial;
};

// ID Generator: CompanyInitials + EmployeeInitials + Year + Serial
const generateEmployeeId = (companyName, employeeName, joiningDateStr) => {
  const companyInitials = getCompanyInitials(companyName);
  const employeeInitials = getEmployeeInitials(employeeName);
  
  const joiningDate = joiningDateStr ? new Date(joiningDateStr) : new Date();
  const year = joiningDate.getFullYear().toString();
  
  const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
  const employeesInYear = users.filter(u => {
    if (u.role !== 'Employee' || !u.joiningDate) return false;
    const uYear = new Date(u.joiningDate).getFullYear().toString();
    return uYear === year;
  });
  
  const serial = (employeesInYear.length + 1).toString().padStart(4, '0');
  return `${companyInitials}${employeeInitials}${year}${serial}`;
};

// Password Generator: Random temp password
const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = 'TMP-';
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

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
          companyName: 'Odoo India',
          companyLogo: ''
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

  const login = (loginIdOrEmail, password) => {
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    const foundUser = users.find(u => 
      (u.email?.toLowerCase() === loginIdOrEmail?.toLowerCase() || 
       u.employeeId?.toLowerCase() === loginIdOrEmail?.toLowerCase()) && 
      u.password === password
    );
    if (foundUser) {
      // Don't store password in session
      const { password: _, ...sessionData } = foundUser;
      setUser(sessionData);
      localStorage.setItem('hrms_session', JSON.stringify(sessionData));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    if (users.find(u => u.email?.toLowerCase() === userData.email?.toLowerCase())) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    const newUser = {
      ...userData,
      id: `admin-${Date.now()}`,
      role: 'Admin'
    };
    
    users.push(newUser);
    localStorage.setItem('hrms_users', JSON.stringify(users));
    return { success: true };
  };

  const createEmployee = (employeeData) => {
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    if (users.find(u => u.email?.toLowerCase() === employeeData.email?.toLowerCase())) {
      return { success: false, message: 'Employee with this email already exists' };
    }

    const currentCompany = user?.companyName || 'Odoo India';
    const employeeId = generateEmployeeId(currentCompany, employeeData.name, employeeData.joiningDate);
    const tempPassword = generateTempPassword();

    const newEmployee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
      employeeId,
      password: tempPassword,
      role: 'Employee',
      status: 'Active',
      companyName: currentCompany
    };

    users.push(newEmployee);
    localStorage.setItem('hrms_users', JSON.stringify(users));
    return { success: true, employeeId, tempPassword };
  };

  const changePassword = (currentPassword, newPassword) => {
    const users = JSON.parse(localStorage.getItem('hrms_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    if (users[userIndex].password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    users[userIndex].password = newPassword;
    localStorage.setItem('hrms_users', JSON.stringify(users));
    
    // Update local state if needed (session values don't include password)
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_session');
  };

  const value = {
    user,
    login,
    register,
    createEmployee,
    changePassword,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};