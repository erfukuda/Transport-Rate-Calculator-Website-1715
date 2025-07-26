import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useRates } from '../context/RateContext';
import * as FiIcons from 'react-icons/fi';

const { FiCalculator, FiSettings, FiDollarSign, FiTrendingUp, FiUsers, FiMapPin, FiClock, FiToggleRight } = FiIcons;

const Dashboard = () => {
  const { rates, theme } = useRates();

  const quickStats = [
    {
      title: 'Service Types',
      value: '3',
      subtitle: 'Ambulatory, Wheelchair, Stretcher',
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Rate Types',
      value: '4',
      subtitle: 'Regular, Off Hours, Holiday, Combined',
      icon: FiClock,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Base Rates Range',
      value: `$${rates.baseFares.regular.ambulatory} - $${rates.baseFares.holiday.stretcher}`,
      subtitle: 'Across all rate types',
      icon: FiDollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'System Features',
      value: 'Active',
      subtitle: 'Advanced calculations ready',
      icon: FiTrendingUp,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const quickActions = [
    {
      title: 'Calculate Rate',
      description: 'Comprehensive rate calculator with add-ons',
      icon: FiCalculator,
      link: '/calculator',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Update Settings',
      description: 'Configure rates, rules, and system settings',
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
          className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Welcome to Rainbow Road Transport
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 dark:text-gray-300"
        >
          Enhanced internal management system with comprehensive rate calculations
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="text-white text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stat.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.subtitle}</p>
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className={`bg-gradient-to-r ${action.color} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <SafeIcon icon={action.icon} className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">{action.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* System Settings Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <SafeIcon icon={FiToggleRight} className={`text-3xl mx-auto mb-2 ${rates.settings.roundMileageToTen ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`} />
            <h4 className="font-semibold text-gray-800 dark:text-white">Round Mileage to 10</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{rates.settings.roundMileageToTen ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <SafeIcon icon={FiToggleRight} className={`text-3xl mx-auto mb-2 ${rates.settings.roundTotalToFive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`} />
            <h4 className="font-semibold text-gray-800 dark:text-white">Round Total to $5</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{rates.settings.roundTotalToFive ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-white">Minimum Miles</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{rates.settings.minimumMiles}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">miles minimum</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-white">Free Deadhead</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{rates.settings.deadheadFreeMiles}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">miles free</p>
          </div>
        </div>
      </motion.div>

      {/* Rate Structure Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Current Rate Structure</h3>
        
        <div className="space-y-8">
          {Object.entries(rates.baseFares).map(([rateType, services]) => (
            <div key={rateType} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 capitalize">
                {rateType === 'offHours' ? 'Off Hours/Weekend' : rateType} Rates
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(services).map(([serviceType, baseFare]) => (
                  <div key={serviceType} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 dark:text-white mb-3 capitalize">
                      {serviceType === 'ambulatory' ? 'Ambulatory' : serviceType === 'wheelchair' ? 'Wheelchair' : 'Stretcher'}
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Base Fare:</span>
                        <span className="font-medium dark:text-white">${baseFare.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Mileage Rate:</span>
                        <span className="font-medium dark:text-white">${rates.mileageRates[rateType][serviceType].toFixed(2)}/mile</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Deadhead Rate</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${rates.deadheadRate.toFixed(2)}/mile</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">After {rates.settings.deadheadFreeMiles} free miles</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;