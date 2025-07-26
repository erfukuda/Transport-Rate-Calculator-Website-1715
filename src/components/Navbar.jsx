import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useRates } from '../context/RateContext';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiCalculator, FiSettings, FiTruck, FiMoon, FiSun } = FiIcons;

const Navbar = () => {
  const location = useLocation();
  const { theme, updateTheme } = useRates();
  
  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/calculator', icon: FiCalculator, label: 'Rate Calculator' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'darkblue' : 'light';
    updateTheme(newTheme);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <SafeIcon icon={FiTruck} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Rainbow Road Transport</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Internal Management System</p>
            </div>
          </div>

          <div className="flex space-x-1 items-center">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            ))}
            
            <button
              onClick={handleThemeToggle}
              className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <SafeIcon icon={theme === 'light' ? FiMoon : FiSun} className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;