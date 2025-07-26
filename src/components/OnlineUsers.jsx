import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiCircle } = FiIcons;

const OnlineUsers = () => {
  const { getOnlineUsers } = useAuth();
  const onlineUsers = getOnlineUsers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
          <SafeIcon icon={FiUsers} className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white darkblue:text-slate-100">
          Online Users ({onlineUsers.length})
        </h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {onlineUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 darkblue:bg-slate-700 rounded-lg p-3"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1">
                <SafeIcon icon={FiCircle} className="text-green-500 text-xs bg-white dark:bg-gray-700 darkblue:bg-slate-700 rounded-full" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white darkblue:text-slate-100">
                {user.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 darkblue:text-slate-400">
                {user.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default OnlineUsers;