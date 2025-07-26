import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useRates } from '../context/RateContext';
import { useAuth } from '../context/AuthContext';
import OnlineUsers from '../components/OnlineUsers';
import * as FiIcons from 'react-icons/fi';

const { 
  FiCalculator, 
  FiDollarSign, 
  FiMapPin, 
  FiAlertCircle,
  FiNavigation,
  FiTruck,
  FiTag,
  FiChevronDown
} = FiIcons;

const RateCalculator = () => {
  const { calculateRate, rates, theme } = useRates();
  const { hasPermission, logActivity } = useAuth();
  const [formData, setFormData] = useState({
    tripType: 'oneway',
    serviceType: 'ambulatory',
    rateType: 'regular',
    miles: '',
    deadheadMiles: '',
    deadheadMultiplier: 1,
    markup: { type: 'none', value: 0 }
  });

  const [addOns, setAddOns] = useState({
    rampFee: false,
    waitTime: 0,
    secondDriver: false,
    companionFee: 0,
    escort: 0,
    airportMeetGreet: '',
    stopOverFee: 0,
    multipleDestinations: 0
  });

  const [result, setResult] = useState(null);
  const [mobileCollapsed, setMobileCollapsed] = useState({
    regular: true,
    offHours: true,
    holiday: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarkupChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      markup: {
        ...prev.markup,
        [field]: value
      }
    }));
  };

  const handleAddOnChange = (name, value) => {
    setAddOns(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!hasPermission('calculate_rates')) {
      alert('Permission denied: You do not have access to calculate rates');
      return;
    }

    const miles = parseFloat(formData.miles) || 0;
    const deadheadMiles = parseFloat(formData.deadheadMiles) || 0;
    
    const calculation = calculateRate({
      ...formData,
      miles,
      deadheadMiles,
      addOns,
      deadheadMultiplier: parseInt(formData.deadheadMultiplier)
    });
    
    setResult(calculation);
    
    // Log the calculation
    logActivity('Rate Calculation', 'Calculated transport rate', {
      ...formData,
      miles,
      deadheadMiles,
      addOns,
      result: calculation
    });
  };

  const getCurrentRates = () => {
    const { serviceType, rateType, tripType } = formData;
    
    if (rateType === 'regular+offHours') {
      const regularBase = rates.baseFares.regular[serviceType];
      const offHoursBase = rates.baseFares.offHours[serviceType];
      const regularMileage = rates.mileageRates.regular[serviceType];
      const offHoursMileage = rates.mileageRates.offHours[serviceType];
      
      return {
        baseFare: (regularBase + offHoursBase) * (tripType === 'roundtrip' ? 2 : 1),
        mileageRate: regularMileage + offHoursMileage
      };
    }
    
    return {
      baseFare: rates.baseFares[rateType][serviceType] * (tripType === 'roundtrip' ? 2 : 1),
      mileageRate: rates.mileageRates[rateType][serviceType]
    };
  };

  const currentRates = getCurrentRates();

  const formatBreakdown = (result) => {
    if (!result) return '';
    
    let breakdown = `$${result.basePlusMileage.toFixed(2)}`;
    
    if (result.deadheadCost > 0) {
      breakdown += ` + $${result.deadheadCost.toFixed(2)} DH`;
    }
    
    Object.entries(result.addOnCosts).forEach(([key, value]) => {
      const labels = {
        rampFee: 'Ramp',
        waitTime: 'Wait Time',
        secondDriver: '2nd Driver',
        companionFee: 'Companion',
        escort: 'Escort',
        airportMeetGreet: 'Meet & Greet',
        stopOverFee: 'Stop Over',
        multipleDestinations: 'Multi Dest'
      };
      breakdown += ` + $${value.toFixed(2)} ${labels[key]}`;
    });

    if (result.markupAmount > 0) {
      breakdown += ` + $${result.markupAmount.toFixed(2)} Markup`;
    }
    
    return breakdown;
  };

  const getTripTypeColor = (type) => {
    if (type === 'oneway') return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-green-600';
  };

  const getRateTypeColor = (type) => {
    switch (type) {
      case 'regular': 
        return 'from-green-500 to-green-600';
      case 'offHours': 
        return 'from-yellow-500 to-orange-500';
      case 'holiday': 
        return 'from-red-500 to-red-600';
      case 'regular+offHours': 
        return 'from-sky-500 to-sky-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const serviceTypes = [
    { value: 'ambulatory', label: 'Ambulatory' },
    { value: 'wheelchair', label: 'Wheelchair' },
    { value: 'stretcher', label: 'Stretcher' }
  ];

  const rateTypes = [
    { value: 'regular', label: 'Regular' },
    { value: 'offHours', label: 'Off Hours' },
    { value: 'holiday', label: 'Holiday' }
  ];

  const tripTypes = [
    { value: 'oneway', label: 'One Way' },
    { value: 'roundtrip', label: 'Roundtrip' }
  ];

  const deadheadMultipliers = [
    { value: 1, label: 'Normal' },
    { value: 2, label: 'Double (2x)' },
    { value: 4, label: '4x Deadhead' }
  ];

  const minimumFare = result?.minimumFare || 0;
  const calculatedBeforeMinimum = result && (result.baseFare + result.mileageCost + result.deadheadCost + result.totalAddOnCost) < minimumFare;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100 mb-4">Transport Rate Calculator</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Calculate transport costs with comprehensive options</p>
      </motion.div>

      {/* Current Rates Display - Mobile Collapsible */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 dark:bg-blue-900/30 dark:border-blue-800 darkblue:bg-blue-900/30 darkblue:border-blue-700 md:block"
      >
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 darkblue:text-blue-300 mb-2">
          Current Rates for {tripTypes.find(t => t.value === formData.tripType)?.label} - {serviceTypes.find(s => s.value === formData.serviceType)?.label} - {rateTypes.find(r => r.value === formData.rateType)?.label}
        </h3>
        
        {/* Mobile Rate Cards */}
        <div className="md:hidden space-y-2">
          {rateTypes.map((rateType) => (
            <div key={rateType.value} className="border border-blue-200 dark:border-blue-700 darkblue:border-blue-600 rounded-lg">
              <button
                onClick={() => setMobileCollapsed(prev => ({ ...prev, [rateType.value]: !prev[rateType.value] }))}
                className="w-full p-3 text-left flex justify-between items-center"
              >
                <span className="font-medium text-blue-700 dark:text-blue-300 darkblue:text-blue-300">{rateType.label}</span>
                <SafeIcon 
                  icon={FiChevronDown} 
                  className={`transform transition-transform ${mobileCollapsed[rateType.value] ? '' : 'rotate-180'}`}
                />
              </button>
              {!mobileCollapsed[rateType.value] && (
                <div className="px-3 pb-3 space-y-2">
                  {serviceTypes.map((service) => (
                    <div key={service.value} className="flex justify-between text-sm">
                      <span className="text-blue-600 dark:text-blue-400 darkblue:text-blue-400">{service.label}:</span>
                      <span className="text-blue-800 dark:text-blue-300 darkblue:text-blue-300">
                        ${rates.baseFares[rateType.value][service.value].toFixed(2)} + ${rates.mileageRates[rateType.value][service.value].toFixed(2)}/mi
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Display */}
        <div className="hidden md:flex flex-wrap space-x-6 text-sm text-blue-700 dark:text-blue-300 darkblue:text-blue-300">
          <span>Base Fare: ${currentRates.baseFare.toFixed(2)}</span>
          <span>Mileage Rate: ${currentRates.mileageRate.toFixed(2)}/mile</span>
          <span>Deadhead Rate: ${rates.deadheadRate.toFixed(2)}/mile</span>
          {formData.tripType === 'oneway' && (
            <span>One Way Fee: ${rates.oneWayRates[formData.serviceType].toFixed(2)}</span>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
              <SafeIcon icon={FiCalculator} className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">Calculate Rate</h2>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Basic Settings - Mobile: Single Column */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                  <SafeIcon icon={FiNavigation} className="text-lg" />
                  <span>Trip Type</span>
                </label>
                <div className="relative">
                  {formData.tripType && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${getTripTypeColor(formData.tripType)} opacity-10 rounded-lg pointer-events-none`}></div>
                  )}
                  <select
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  >
                    {tripTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                  <SafeIcon icon={FiTruck} className="text-lg" />
                  <span>Transport Type</span>
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                >
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                  <SafeIcon icon={FiTag} className="text-lg" />
                  <span>Rate Type</span>
                </label>
                <div className="relative">
                  {formData.rateType && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${getRateTypeColor(formData.rateType)} opacity-10 rounded-lg pointer-events-none`}></div>
                  )}
                  <select
                    name="rateType"
                    value={formData.rateType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  >
                    {rateTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Miles and Deadhead */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                  Deadhead Miles
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                  Deadhead Multiplier
                </label>
                <select
                  name="deadheadMultiplier"
                  value={formData.deadheadMultiplier}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                >
                  {deadheadMultipliers.map((mult) => (
                    <option key={mult.value} value={mult.value}>
                      {mult.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Markup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                  Markup Type
                </label>
                <select
                  value={formData.markup.type}
                  onChange={(e) => handleMarkupChange('type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                >
                  <option value="none">No Markup</option>
                  <option value="dollar">$ Markup</option>
                  <option value="percent">% Markup</option>
                </select>
              </div>

              {formData.markup.type !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                    Markup Value
                  </label>
                  <input
                    type="number"
                    value={formData.markup.value}
                    onChange={(e) => handleMarkupChange('value', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    placeholder={formData.markup.type === 'percent' ? 'Enter percentage' : 'Enter amount'}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  />
                </div>
              )}
            </div>

            {/* Add-on Services */}
            <div className="border-t border-gray-200 dark:border-gray-700 darkblue:border-slate-600 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white darkblue:text-slate-100 mb-4">Add-on Services</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={addOns.rampFee}
                    onChange={(e) => handleAddOnChange('rampFee', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 darkblue:border-slate-600 dark:bg-gray-700 darkblue:bg-slate-700"
                  />
                  <span className="dark:text-white darkblue:text-slate-100">Ramp Fee ($10)</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={addOns.secondDriver}
                    onChange={(e) => handleAddOnChange('secondDriver', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 darkblue:border-slate-600 dark:bg-gray-700 darkblue:bg-slate-700"
                  />
                  <span className="dark:text-white darkblue:text-slate-100">2nd Driver ($50)</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                    Wait Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={addOns.waitTime}
                    onChange={(e) => handleAddOnChange('waitTime', parseInt(e.target.value) || 0)}
                    min="0"
                    step="30"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 darkblue:text-slate-500 mt-1">$70/hr, increments of 30 mins</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                    Companion Fee (count)
                  </label>
                  <input
                    type="number"
                    value={addOns.companionFee}
                    onChange={(e) => handleAddOnChange('companionFee', parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 darkblue:text-slate-500 mt-1">$25/way per companion</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                    Escort (hours)
                  </label>
                  <input
                    type="number"
                    value={addOns.escort}
                    onChange={(e) => handleAddOnChange('escort', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.5"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 darkblue:text-slate-500 mt-1">$50/hr</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                    Stop Over Fee (count)
                  </label>
                  <input
                    type="number"
                    value={addOns.stopOverFee}
                    onChange={(e) => handleAddOnChange('stopOverFee', parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 darkblue:text-slate-500 mt-1">$25 per stop</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                    Multiple Destinations (legs)
                  </label>
                  <input
                    type="number"
                    value={addOns.multipleDestinations}
                    onChange={(e) => handleAddOnChange('multipleDestinations', parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 darkblue:text-slate-500 mt-1">$35 per leg</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 darkblue:border-slate-600">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 darkblue:text-slate-300 mb-2">
                  Airport Meet & Greet
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      value={addOns.airportMeetGreet}
                      onChange={(e) => handleAddOnChange('airportMeetGreet', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 darkblue:border-slate-600 rounded-lg bg-white dark:bg-gray-700 darkblue:bg-slate-700 dark:text-white darkblue:text-slate-100"
                    >
                      <option value="">None</option>
                      <option value="ORD">ORD ($50)</option>
                      <option value="MDW">MDW ($70)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
              disabled={!hasPermission('calculate_rates')}
            >
              Calculate Rate
            </motion.button>
          </form>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 darkblue:bg-slate-800 rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg">
                <SafeIcon icon={FiDollarSign} className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white darkblue:text-slate-100">Rate Breakdown</h2>
            </div>
          </div>

          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 dark:bg-gray-700 darkblue:bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 darkblue:text-slate-200 mb-2">Rate Breakdown</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 darkblue:text-slate-300 font-mono">
                  {formatBreakdown(result)}
                </p>
              </div>

              {calculatedBeforeMinimum && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 darkblue:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 darkblue:border-yellow-700 rounded-lg p-3 flex items-center space-x-2">
                  <SafeIcon icon={FiAlertCircle} className="text-yellow-600 dark:text-yellow-400 darkblue:text-yellow-400 text-lg flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 darkblue:text-yellow-300">
                    Minimum fare of ${minimumFare.toFixed(2)} applied
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 darkblue:border-slate-600">
                  <span className="text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Base + Mileage:</span>
                  <span className="font-semibold text-lg dark:text-white darkblue:text-slate-100">${result.basePlusMileage.toFixed(2)}</span>
                </div>
                {result.deadheadCost > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 darkblue:border-slate-600">
                    <span className="text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Deadhead Cost:</span>
                    <span className="font-semibold text-lg dark:text-white darkblue:text-slate-100">${result.deadheadCost.toFixed(2)}</span>
                  </div>
                )}
                {result.totalAddOnCost > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 darkblue:border-slate-600">
                    <span className="text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Add-ons:</span>
                    <span className="font-semibold text-lg dark:text-white darkblue:text-slate-100">${result.totalAddOnCost.toFixed(2)}</span>
                  </div>
                )}
                {result.markupAmount > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 darkblue:border-slate-600">
                    <span className="text-gray-600 dark:text-gray-300 darkblue:text-slate-400">Markup:</span>
                    <span className="font-semibold text-lg dark:text-white darkblue:text-slate-100">${result.markupAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 darkblue:from-green-900/30 darkblue:to-green-800/30 rounded-lg px-4">
                  <span className="text-green-800 dark:text-green-300 darkblue:text-green-300 font-semibold text-lg">Total:</span>
                  <span className="text-green-800 dark:text-green-300 darkblue:text-green-300 font-bold text-2xl">${result.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 darkblue:bg-blue-900/30 rounded-lg p-4 text-sm">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 darkblue:text-blue-300 mb-2">Mileage Summary</h4>
                <div className="space-y-1 text-blue-700 dark:text-blue-300 darkblue:text-blue-300">
                  <div className="flex justify-between">
                    <span>Total Mileage:</span>
                    <span>{result.breakdown.displayMiles} Miles</span>
                  </div>
                  {result.breakdown.deadheadMiles > 0 && (
                    <div className="flex justify-between">
                      <span>Deadhead Mileage:</span>
                      <span>{result.breakdown.deadheadMiles} Miles</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <SafeIcon icon={FiCalculator} className="text-gray-300 dark:text-gray-600 darkblue:text-slate-600 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 darkblue:text-slate-500 text-lg">Enter details and calculate to see rate breakdown</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Online Users Component */}
      <OnlineUsers />
    </div>
  );
};

export default RateCalculator;