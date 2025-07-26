import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import OnlineUsers from '../components/OnlineUsers';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUser, 
  FiMail, 
  FiBriefcase, 
  FiCamera, 
  FiEdit3, 
  FiSave, 
  FiX,
  FiShield,
  FiClock
} = FiIcons;

const Profile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role
  });

  const handleSave = () => {
    // In a real app, you would update the user data here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role
    });
    setIsEditing(false);
  };

  const permissions = {
    'Admin': [
      'View and edit all settings',
      'Access audit logs',
      'Calculate rates',
      'Manage users',
      'Full system access'
    ],
    'Supervisor': [
      'View settings (read-only)',
      'Access audit logs',
      'Calculate rates',
      'Monitor system usage'
    ],
    'Agent': [
      'Calculate rates',
      'View basic information'
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100 mb-4">User Profile</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Manage your account information and preferences</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header with background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Profile Content */}
        <div className="relative px-8 pb-8">
          {/* Profile Picture */}
          <div className="flex justify-center -mt-16 mb-6">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 darkblue:border-slate-800 shadow-lg object-cover"
              />
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
                <SafeIcon icon={FiCamera} className="text-sm" />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center mb-8">
            {isEditing ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  />
                </div>
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <SafeIcon icon={FiSave} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 text-gray-700 dark:text-gray-300 darkblue:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700 transition-colors duration-200"
                  >
                    <SafeIcon icon={FiX} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100 mb-2">{currentUser.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 darkblue:text-slate-400 mb-1">{currentUser.email}</p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentUser.role === 'Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    currentUser.role === 'Supervisor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    <SafeIcon icon={FiShield} className="inline mr-1" />
                    {currentUser.role}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 darkblue:text-slate-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <SafeIcon icon={FiEdit3} />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 darkblue:bg-slate-700 rounded-lg p-6 text-center">
              <SafeIcon icon={FiUser} className="text-3xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 dark:text-white darkblue:text-slate-100 mb-1">Full Name</h3>
              <p className="text-gray-600 dark:text-gray-400 darkblue:text-slate-400">{currentUser.name}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 darkblue:bg-slate-700 rounded-lg p-6 text-center">
              <SafeIcon icon={FiMail} className="text-3xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 dark:text-white darkblue:text-slate-100 mb-1">Email Address</h3>
              <p className="text-gray-600 dark:text-gray-400 darkblue:text-slate-400">{currentUser.email}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 darkblue:bg-slate-700 rounded-lg p-6 text-center">
              <SafeIcon icon={FiBriefcase} className="text-3xl text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 dark:text-white darkblue:text-slate-100 mb-1">Role</h3>
              <p className="text-gray-600 dark:text-gray-400 darkblue:text-slate-400">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Permissions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
            <SafeIcon icon={FiShield} className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">Role Permissions</h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 darkblue:bg-blue-900/30 border border-blue-200 dark:border-blue-800 darkblue:border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 darkblue:text-blue-300 mb-4">
            {currentUser.role} Permissions
          </h3>
          <ul className="space-y-2">
            {permissions[currentUser.role]?.map((permission, index) => (
              <li key={index} className="flex items-center space-x-3 text-blue-700 dark:text-blue-300 darkblue:text-blue-300">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>{permission}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg">
            <SafeIcon icon={FiClock} className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">Recent Activity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 darkblue:bg-slate-700 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">24</div>
            <div className="text-gray-600 dark:text-gray-400 darkblue:text-slate-400">Rate Calculations Today</div>
          </div>
          
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 darkblue:bg-slate-700 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
            <div className="text-gray-600 dark:text-gray-400 darkblue:text-slate-400">Total Calculations This Week</div>
          </div>
          
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 darkblue:bg-slate-700 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">2.5h</div>
            <div className="text-gray-600 dark:text-gray-400 darkblue:text-slate-400">Time Active Today</div>
          </div>
        </div>
      </motion.div>

      {/* Online Users Component */}
      <OnlineUsers />
    </div>
  );
};

export default Profile;