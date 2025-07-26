import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useRates } from '../context/RateContext';
import * as FiIcons from 'react-icons/fi';

const { FiCalculator, FiDollarSign, FiMapPin, FiUsers, FiCopy, FiCheck } = FiIcons;

const RateCalculator = () => {
  const { calculateRate } = useRates();
  const [formData, setFormData] = useState({
    serviceType: 'ambulatory',
    miles: '',
    deadheadMiles: ''
  });
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const miles = parseFloat(formData.miles) || 0;
    const deadheadMiles = parseFloat(formData.deadheadMiles) || 0;
    
    const calculation = calculateRate(formData.serviceType, miles, deadheadMiles);
    setResult(calculation);
  };

  const handleCopyResult = () => {
    if (result) {
      const text = `Rainbow Road Transport - Rate Calculation
Service Type: ${formData.serviceType.charAt(0).toUpperCase() + formData.serviceType.slice(1)}
Miles: ${formData.miles}
Deadhead Miles: ${formData.deadheadMiles}
Base Fare: $${result.baseFare.toFixed(2)}
Mileage Cost: $${result.mileageCost.toFixed(2)}
Deadhead Cost: $${result.deadheadCost.toFixed(2)}
Total: $${result.total.toFixed(2)}`;
      
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const serviceTypes = [
    { value: 'ambulatory', label: 'Ambulatory', icon: FiUsers },
    { value: 'wheelchair', label: 'Wheelchair', icon: FiUsers },
    { value: 'stretcher', label: 'Stretcher', icon: FiUsers }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Rate Calculator</h1>
        <p className="text-xl text-gray-600">Calculate transport costs for any service type</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
              <SafeIcon icon={FiCalculator} className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Calculate Rate</h2>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {serviceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miles
              </label>
              <div className="relative">
                <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="miles"
                  value={formData.miles}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  placeholder="Enter miles"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadhead Miles (Optional)
              </label>
              <div className="relative">
                <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="deadheadMiles"
                  value={formData.deadheadMiles}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  placeholder="Enter deadhead miles"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              Calculate Rate
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg">
                <SafeIcon icon={FiDollarSign} className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Rate Breakdown</h2>
            </div>
            {result && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyResult}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <SafeIcon icon={copied ? FiCheck : FiCopy} className={`text-sm ${copied ? 'text-green-600' : 'text-gray-600'}`} />
                <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            )}
          </div>

          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Service Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Type:</span>
                    <span className="font-medium capitalize">{formData.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Miles:</span>
                    <span className="font-medium">{formData.miles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadhead Miles:</span>
                    <span className="font-medium">{formData.deadheadMiles || '0'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Base Fare:</span>
                  <span className="font-semibold text-lg">${result.baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Mileage Cost:</span>
                  <span className="font-semibold text-lg">${result.mileageCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Deadhead Cost:</span>
                  <span className="font-semibold text-lg">${result.deadheadCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg px-4">
                  <span className="text-green-800 font-semibold text-lg">Total:</span>
                  <span className="text-green-800 font-bold text-2xl">${result.total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <SafeIcon icon={FiCalculator} className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Enter details and calculate to see rate breakdown</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RateCalculator;