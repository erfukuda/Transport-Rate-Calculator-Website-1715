import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useRates } from '../context/RateContext';
import { useAuth } from '../context/AuthContext';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome, 
  FiCalculator, 
  FiSettings, 
  FiTruck, 
  FiMoon, 
  FiSun, 
  FiUser, 
  FiChevronDown,
  FiFileText
} = FiIcons;

const Navbar = () => {
  const location = useLocation();
  const { theme, updateTheme } = useRates();
  const { currentUser, switchUser, users, hasPermission } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/calculator', icon: FiCalculator, label: 'Rate Calculator' }
  ];

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'darkblue' : 'light';
    updateTheme(newTheme);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 darkblue:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-gray-700 darkblue:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Centered and Bigger */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-lg">
                <SafeIcon icon={FiTruck} className="text-white text-2xl" />
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex space-x-1 items-center">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-300 darkblue:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span className="font-medium hidden md:inline">{item.label}</span>
                </motion.div>
              </Link>
            ))}
            
            <button
              onClick={handleThemeToggle}
              className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700 text-gray-600 dark:text-gray-300 darkblue:text-slate-300"
            >
              <SafeIcon icon={theme === 'light' ? FiMoon : FiSun} className="text-lg" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700 transition-all duration-200"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <SafeIcon icon={FiChevronDown} className="text-gray-600 dark:text-gray-300 darkblue:text-slate-300" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 darkblue:border-slate-600 z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 darkblue:border-slate-600">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white darkblue:text-slate-100">{currentUser.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 darkblue:text-slate-400">{currentUser.role}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700 text-gray-700 dark:text-gray-300 darkblue:text-slate-300"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <SafeIcon icon={FiUser} />
                        <span>Profile</span>
                      </Link>

                      {hasPermission('view_settings') && (
                        <Link
                          to="/settings"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700 text-gray-700 dark:text-gray-300 darkblue:text-slate-300"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <SafeIcon icon={FiSettings} />
                          <span>Settings</span>
                        </Link>
                      )}

                      {hasPermission('view_audit') && (
                        <Link
                          to="/audit"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700 text-gray-700 dark:text-gray-300 darkblue:text-slate-300"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <SafeIcon icon={FiFileText} />
                          <span>Audit Log</span>
                        </Link>
                      )}
                    </div>

                    {/* Switch User Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 darkblue:border-slate-600 py-2">
                      <p className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 darkblue:text-slate-400 uppercase tracking-wider">
                        Switch User
                      </p>
                      {users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700 text-left ${
                            currentUser.id === user.id ? 'bg-blue-50 dark:bg-blue-900/30 darkblue:bg-blue-900/30' : ''
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-white darkblue:text-slate-100">{user.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 darkblue:text-slate-400">{user.role}</p>
                          </div>
                          {currentUser.id === user.id && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;