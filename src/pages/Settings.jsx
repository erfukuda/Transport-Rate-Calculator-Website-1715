import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useRates } from '../context/RateContext';
import { useAuth } from '../context/AuthContext';
import OnlineUsers from '../components/OnlineUsers';
import * as FiIcons from 'react-icons/fi';

const { 
  FiSettings, 
  FiSave, 
  FiRotateCcw, 
  FiDollarSign, 
  FiCheck, 
  FiAlertCircle, 
  FiToggleLeft, 
  FiToggleRight, 
  FiMoon, 
  FiSun,
  FiX 
} = FiIcons;

const Settings = () => {
  const { rates, updateRates, theme, updateTheme } = useRates();
  const { hasPermission, logActivity } = useAuth();
  const [formRates, setFormRates] = useState(rates);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Check permissions
  if (!hasPermission('view_settings')) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <SafeIcon icon={FiAlertCircle} className="text-red-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100 mb-2">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 darkblue:text-slate-400">You do not have permission to view settings.</p>
      </div>
    );
  }

  const handleRateChange = (category, rateType, serviceType, value) => {
    const numericValue = parseFloat(value) || 0;
    setFormRates(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [rateType]: {
          ...prev[category][rateType],
          [serviceType]: numericValue
        }
      }
    }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleOneWayRateChange = (serviceType, value) => {
    const numericValue = parseFloat(value) || 0;
    setFormRates(prev => ({
      ...prev,
      oneWayRates: {
        ...prev.oneWayRates,
        [serviceType]: numericValue
      }
    }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleMinimumFareChange = (key, value) => {
    const numericValue = parseFloat(value) || 0;
    setFormRates(prev => ({
      ...prev,
      minimumFares: {
        ...prev.minimumFares,
        [key]: numericValue
      }
    }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleDeadheadRateChange = (value) => {
    const numericValue = parseFloat(value) || 0;
    setFormRates(prev => ({
      ...prev,
      deadheadRate: numericValue
    }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleSettingChange = (setting, value) => {
    setFormRates(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value
      }
    }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleSaveClick = () => {
    if (!hasPermission('edit_settings')) {
      alert('Permission denied: You cannot edit settings');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => {
    try {
      updateRates(formRates);
      logActivity('Settings Update', 'Updated rate settings', formRates);
      setHasChanges(false);
      setSaved(true);
      setShowConfirmation(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert(error.message);
      setShowConfirmation(false);
    }
  };

  const handleCancelSave = () => {
    setShowConfirmation(false);
  };

  const handleReset = () => {
    setFormRates(rates);
    setHasChanges(false);
    setSaved(false);
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'darkblue' : 'light';
    updateTheme(newTheme);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return FiMoon;
    if (theme === 'dark') return FiSun;
    return FiSun;
  };

  const getThemeText = () => {
    if (theme === 'light') return 'Switch to Dark Mode';
    if (theme === 'dark') return 'Switch to Navy Blue Mode';
    return 'Switch to Light Mode';
  };

  const serviceTypes = [
    { key: 'ambulatory', title: 'Ambulatory', color: 'from-blue-500 to-blue-600' },
    { key: 'wheelchair', title: 'Wheelchair', color: 'from-purple-500 to-purple-600' },
    { key: 'stretcher', title: 'Stretcher', color: 'from-pink-500 to-pink-600' }
  ];

  const rateCategories = [
    { key: 'regular', title: 'Regular', description: 'Standard business hours rates' },
    { key: 'offHours', title: 'Off Hours', description: 'After hours and weekend rates' },
    { key: 'holiday', title: 'Holiday', description: 'Holiday and special occasion rates' }
  ];

  const tripTypes = ['Oneway', 'Roundtrip'];

  const minimumFares = [];
  serviceTypes.forEach(service => {
    rateCategories.forEach(rate => {
      tripTypes.forEach(trip => {
        minimumFares.push({
          key: `${service.key}${rate.key.charAt(0).toUpperCase() + rate.key.slice(1)}${trip}`,
          label: `${service.title} ${rate.title} ${trip}`
        });
      });
    });
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100 mb-4">Rate Settings</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Configure comprehensive transport rates and settings</p>
      </motion.div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/30 darkblue:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 darkblue:border-yellow-700 rounded-lg p-4 flex items-center space-x-3"
        >
          <SafeIcon icon={FiAlertCircle} className="text-yellow-600 dark:text-yellow-400 darkblue:text-yellow-400 text-xl" />
          <p className="text-yellow-800 dark:text-yellow-300 darkblue:text-yellow-300">You have unsaved changes. Don't forget to save your updates!</p>
        </motion.div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/30 darkblue:bg-green-900/30 border border-green-200 dark:border-green-800 darkblue:border-green-700 rounded-lg p-4 flex items-center space-x-3"
        >
          <SafeIcon icon={FiCheck} className="text-green-600 dark:text-green-400 darkblue:text-green-400 text-xl" />
          <p className="text-green-800 dark:text-green-300 darkblue:text-green-300">Settings saved successfully!</p>
        </motion.div>
      )}

      {/* Theme Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 rounded-lg">
              <SafeIcon icon={getThemeIcon()} className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">Theme Settings</h2>
          </div>
          <button
            onClick={handleThemeChange}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
          >
            {getThemeText()}
          </button>
        </div>
      </motion.div>

      {/* System Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-3 rounded-lg">
            <SafeIcon icon={FiSettings} className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">System Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 darkblue:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700">
              <div>
                <span className="font-medium text-gray-800 dark:text-white darkblue:text-slate-100">Round Mileage to Nearest 10</span>
                <p className="text-sm text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Round up miles to nearest 10</p>
              </div>
              <button
                type="button"
                onClick={() => handleSettingChange('roundMileageToTen', !formRates.settings.roundMileageToTen)}
                className="ml-4"
                disabled={!hasPermission('edit_settings')}
              >
                <SafeIcon 
                  icon={formRates.settings.roundMileageToTen ? FiToggleRight : FiToggleLeft} 
                  className={`text-2xl ${formRates.settings.roundMileageToTen ? 'text-green-500' : 'text-gray-400 dark:text-gray-500 darkblue:text-slate-500'}`} 
                />
              </button>
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 darkblue:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700">
              <div>
                <span className="font-medium text-gray-800 dark:text-white darkblue:text-slate-100">Round Total to $5</span>
                <p className="text-sm text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Round final total to nearest $5</p>
              </div>
              <button
                type="button"
                onClick={() => handleSettingChange('roundTotalToFive', !formRates.settings.roundTotalToFive)}
                className="ml-4"
                disabled={!hasPermission('edit_settings')}
              >
                <SafeIcon 
                  icon={formRates.settings.roundTotalToFive ? FiToggleRight : FiToggleLeft} 
                  className={`text-2xl ${formRates.settings.roundTotalToFive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500 darkblue:text-slate-500'}`} 
                />
              </button>
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 darkblue:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700">
              <div>
                <span className="font-medium text-gray-800 dark:text-white darkblue:text-slate-100">Round Deadhead to $5</span>
                <p className="text-sm text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Round deadhead cost to nearest $5</p>
              </div>
              <button
                type="button"
                onClick={() => handleSettingChange('roundDeadheadToFive', !formRates.settings.roundDeadheadToFive)}
                className="ml-4"
                disabled={!hasPermission('edit_settings')}
              >
                <SafeIcon 
                  icon={formRates.settings.roundDeadheadToFive ? FiToggleRight : FiToggleLeft} 
                  className={`text-2xl ${formRates.settings.roundDeadheadToFive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500 darkblue:text-slate-500'}`} 
                />
              </button>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
              Minimum Miles
            </label>
            <input
              type="number"
              value={formRates.settings.minimumMiles}
              onChange={(e) => handleSettingChange('minimumMiles', parseInt(e.target.value) || 5)}
              min="1"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
              disabled={!hasPermission('edit_settings')}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 darkblue:text-slate-500 mt-1">Minimum chargeable miles</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
              Deadhead Free Miles
            </label>
            <input
              type="number"
              value={formRates.settings.deadheadFreeMiles}
              onChange={(e) => handleSettingChange('deadheadFreeMiles', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
              disabled={!hasPermission('edit_settings')}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 darkblue:text-slate-500 mt-1">Free deadhead miles before charging</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 darkblue:border-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                Deadhead Rate ($/mile)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formRates.deadheadRate}
                onChange={(e) => handleDeadheadRateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                disabled={!hasPermission('edit_settings')}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 darkblue:text-slate-500 mt-1">Cost per mile for deadhead mileage</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* One Way Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-lg">
            <SafeIcon icon={FiDollarSign} className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">One Way Rates</h2>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 darkblue:border-slate-600 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {serviceTypes.map((service) => (
              <div key={service.key} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                  {service.title} ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formRates.oneWayRates[service.key]}
                  onChange={(e) => handleOneWayRateChange(service.key, e.target.value)}
                  className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  disabled={!hasPermission('edit_settings')}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Base Fares */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg">
            <SafeIcon icon={FiDollarSign} className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">Base Fares</h2>
        </div>

        <div className="space-y-8">
          {rateCategories.map((category) => (
            <div key={category.key} className="border border-gray-200 dark:border-gray-700 darkblue:border-slate-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white darkblue:text-slate-100 mb-2">{category.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 darkblue:text-slate-400 mb-4">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {serviceTypes.map((service) => (
                  <div key={service.key} className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                      {service.title} ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formRates.baseFares[category.key][service.key]}
                      onChange={(e) => handleRateChange('baseFares', category.key, service.key, e.target.value)}
                      className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                      disabled={!hasPermission('edit_settings')}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mileage Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg">
            <SafeIcon icon={FiDollarSign} className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">Mileage Rates</h2>
        </div>

        <div className="space-y-8">
          {rateCategories.map((category) => (
            <div key={category.key} className="border border-gray-200 dark:border-gray-700 darkblue:border-slate-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white darkblue:text-slate-100 mb-2">{category.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 darkblue:text-slate-400 mb-4">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {serviceTypes.map((service) => (
                  <div key={service.key} className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                      {service.title} ($/mile)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formRates.mileageRates[category.key][service.key]}
                      onChange={(e) => handleRateChange('mileageRates', category.key, service.key, e.target.value)}
                      className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                      disabled={!hasPermission('edit_settings')}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Minimum Fares */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg">
            <SafeIcon icon={FiDollarSign} className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">Minimum Fares</h2>
        </div>

        <p className="text-gray-600 dark:text-gray-300 darkblue:text-slate-400 mb-6">
          Set the minimum charge amount for each service type and rate combination
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {minimumFares.map((fare) => (
            <div key={fare.key} className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                {fare.label}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formRates.minimumFares[fare.key]}
                onChange={(e) => handleMinimumFareChange(fare.key, e.target.value)}
                className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                disabled={!hasPermission('edit_settings')}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save/Reset Buttons */}
      {hasPermission('edit_settings') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 text-gray-700 dark:text-gray-300 darkblue:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 darkblue:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <SafeIcon icon={FiRotateCcw} className="text-lg" />
            <span className="font-medium">Reset Changes</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveClick}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
          >
            <SafeIcon icon={FiSave} className="text-lg" />
            <span className="font-medium">Save Settings</span>
          </motion.button>
        </motion.div>
      )}

      {/* Save Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`rounded-xl p-6 max-w-md w-full shadow-2xl ${
                theme === 'darkblue' 
                  ? 'bg-slate-800 text-slate-100 border border-slate-600' 
                  : theme === 'dark' 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Confirm Changes</h3>
                <button onClick={handleCancelSave} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 darkblue:text-slate-400 darkblue:hover:text-slate-200">
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
              <div className="mb-6">
                <p className={`${
                  theme === 'darkblue' 
                    ? 'text-slate-300' 
                    : theme === 'dark' 
                      ? 'text-gray-300' 
                      : 'text-gray-600'
                }`}>
                  Are you sure you want to save these changes? This will update all rate settings.
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelSave}
                  className={`px-4 py-2 border rounded-lg hover:bg-opacity-50 ${
                    theme === 'darkblue' 
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                      : theme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSave}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700"
                >
                  Confirm Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Users Component */}
      <OnlineUsers />
    </div>
  );
};

export default Settings;