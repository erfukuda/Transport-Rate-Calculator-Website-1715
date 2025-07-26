import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useRates } from '../context/RateContext';
import * as FiIcons from 'react-icons/fi';

const { FiCalculator, FiSettings, FiDollarSign, FiTrendingUp, FiUsers, FiMapPin } = FiIcons;

const Dashboard = () => {
  const { rates } = useRates();

  const quickStats = [
    {
      title: 'Service Types',
      value: '3',
      subtitle: 'Ambulatory, Wheelchair, Stretcher',
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Base Rates',
      value: `$${rates.ambulatory.baseFare} - $${rates.stretcher.baseFare}`,
      subtitle: 'Range across services',
      icon: FiDollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Mileage Rates',
      value: `$${rates.ambulatory.mileageRate} - $${rates.stretcher.mileageRate}`,
      subtitle: 'Per mile pricing',
      icon: FiMapPin,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Active System',
      value: 'Online',
      subtitle: 'Rate calculator ready',
      icon: FiTrendingUp,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const quickActions = [
    {
      title: 'Calculate Rate',
      description: 'Calculate transport costs for any service type',
      icon: FiCalculator,
      link: '/calculator',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Update Settings',
      description: 'Modify rates and system configuration',
      icon: FiSettings,
      link: '/settings',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          Welcome to Rainbow Road Transport
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600"
        >
          Internal management system for transport rate calculations
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="text-white text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Link to={action.link}>
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className={`bg-gradient-to-r ${action.color} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <SafeIcon icon={action.icon} className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900">{action.title}</h3>
                    <p className="text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Current Rate Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(rates).map(([serviceType, rate]) => (
            <div key={serviceType} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
                {serviceType === 'ambulatory' ? 'Ambulatory' : serviceType === 'wheelchair' ? 'Wheelchair' : 'Stretcher'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare:</span>
                  <span className="font-medium">${rate.baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage Rate:</span>
                  <span className="font-medium">${rate.mileageRate.toFixed(2)}/mile</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadhead Rate:</span>
                  <span className="font-medium">${rate.deadheadRate.toFixed(2)}/mile</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;