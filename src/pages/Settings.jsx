import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useRates } from '../context/RateContext';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiSave, FiRotateCcw, FiDollarSign, FiCheck, FiAlertCircle } = FiIcons;

const Settings = () => {
  const { rates, updateRates } = useRates();
  const [formRates, setFormRates] = useState(rates);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleRateChange = (serviceType, field, value) => {
    const numericValue = parseFloat(value) || 0;
    setFormRates(prev => ({
      ...prev,
      [serviceType]: {
        ...prev[serviceType],
        [field]: numericValue
      }
    }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    updateRates(formRates);
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setFormRates(rates);
    setHasChanges(false);
    setSaved(false);
  };

  const serviceTypes = [
    {
      key: 'ambulatory',
      title: 'Ambulatory',
      description: 'Patients who can walk with minimal assistance',
      color: 'from-blue-500 to-blue-600'
    },
    {
      key: 'wheelchair',
      title: 'Wheelchair',
      description: 'Patients requiring wheelchair transportation',
      color: 'from-purple-500 to-purple-600'
    },
    {
      key: 'stretcher',
      title: 'Stretcher',
      description: 'Patients requiring stretcher/gurney transportation',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Rate Settings</h1>
        <p className="text-xl text-gray-600">Configure transport rates for all service types</p>
      </motion.div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <SafeIcon icon={FiAlertCircle} className="text-yellow-600 text-xl" />
          <p className="text-yellow-800">You have unsaved changes. Don't forget to save your updates!</p>
        </motion.div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <SafeIcon icon={FiCheck} className="text-green-600 text-xl" />
          <p className="text-green-800">Settings saved successfully!</p>
        </motion.div>
      )}

      <div className="space-y-6">
        {serviceTypes.map((service, index) => (
          <motion.div
            key={service.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className={`bg-gradient-to-r ${service.color} p-3 rounded-lg`}>
                <SafeIcon icon={FiDollarSign} className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{service.title}</h2>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Fare ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formRates[service.key].baseFare}
                  onChange={(e) => handleRateChange(service.key, 'baseFare', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Fixed charge for the service</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mileage Rate ($/mile)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formRates[service.key].mileageRate}
                  onChange={(e) => handleRateChange(service.key, 'mileageRate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Cost per mile of transport</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadhead Rate ($/mile)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formRates[service.key].deadheadRate}
                  onChange={(e) => handleRateChange(service.key, 'deadheadRate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Cost per mile without passenger</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Rate Preview</h4>
              <p className="text-sm text-gray-600">
                Example: 10 miles + 5 deadhead miles = 
                <span className="font-medium text-gray-800">
                  {' '}${formRates[service.key].baseFare.toFixed(2)} + ${(formRates[service.key].mileageRate * 10).toFixed(2)} + ${(formRates[service.key].deadheadRate * 5).toFixed(2)} = 
                  ${(formRates[service.key].baseFare + (formRates[service.key].mileageRate * 10) + (formRates[service.key].deadheadRate * 5)).toFixed(2)}
                </span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

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
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <SafeIcon icon={FiRotateCcw} className="text-lg" />
          <span className="font-medium">Reset Changes</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
        >
          <SafeIcon icon={FiSave} className="text-lg" />
          <span className="font-medium">Save Settings</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;