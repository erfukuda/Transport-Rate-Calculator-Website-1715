import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const defaultUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Supervisor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    role: 'Agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  {
    id: 4,
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    role: 'Agent',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
    lastSeen: new Date()
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(defaultUsers[0]); // Default to Admin
  const [users, setUsers] = useState(defaultUsers);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    // Load saved user and audit log from localStorage
    const savedUser = localStorage.getItem('transportCurrentUser');
    const savedAuditLog = localStorage.getItem('transportAuditLog');
    
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }

    if (savedAuditLog) {
      try {
        setAuditLog(JSON.parse(savedAuditLog));
      } catch (e) {
        console.error('Error parsing saved audit log:', e);
      }
    }
  }, []);

  const switchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('transportCurrentUser', JSON.stringify(user));
      
      // Log the user switch
      logActivity('User Switch', `Switched to user: ${user.name} (${user.role})`);
    }
  };

  const logActivity = (action, details, calculationData = null) => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      details,
      calculationData
    };

    const newAuditLog = [logEntry, ...auditLog].slice(0, 1000); // Keep last 1000 entries
    setAuditLog(newAuditLog);
    localStorage.setItem('transportAuditLog', JSON.stringify(newAuditLog));
  };

  const hasPermission = (permission) => {
    const permissions = {
      'Admin': ['view_settings', 'edit_settings', 'view_audit', 'calculate_rates'],
      'Supervisor': ['view_settings', 'view_audit', 'calculate_rates'],
      'Agent': ['calculate_rates']
    };

    return permissions[currentUser.role]?.includes(permission) || false;
  };

  const getOnlineUsers = () => {
    return users.filter(user => user.isOnline);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      auditLog,
      switchUser,
      logActivity,
      hasPermission,
      getOnlineUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};