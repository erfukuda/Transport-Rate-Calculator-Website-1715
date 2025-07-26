import React, { createContext, useContext, useState, useEffect } from 'react';

const RateContext = createContext();

export const useRates = () => {
  const context = useContext(RateContext);
  if (!context) {
    throw new Error('useRates must be used within a RateProvider');
  }
  return context;
};

const defaultRates = {
  baseFares: {
    regular: {
      ambulatory: 25.00,
      wheelchair: 30.00,
      stretcher: 45.00
    },
    offHours: {
      ambulatory: 35.00,
      wheelchair: 40.00,
      stretcher: 55.00
    },
    holiday: {
      ambulatory: 45.00,
      wheelchair: 50.00,
      stretcher: 65.00
    }
  },
  mileageRates: {
    regular: {
      ambulatory: 2.50,
      wheelchair: 2.75,
      stretcher: 3.50
    },
    offHours: {
      ambulatory: 3.00,
      wheelchair: 3.25,
      stretcher: 4.00
    },
    holiday: {
      ambulatory: 3.50,
      wheelchair: 3.75,
      stretcher: 4.50
    }
  },
  oneWayRates: {
    ambulatory: 20.00,
    wheelchair: 25.00,
    stretcher: 40.00
  },
  minimumFares: {
    ambulatoryRegularOneWay: 75,
    ambulatoryRegularRoundtrip: 90,
    ambulatoryOffHoursOneWay: 90,
    ambulatoryOffHoursRoundtrip: 115,
    ambulatoryHolidayOneWay: 105,
    ambulatoryHolidayRoundtrip: 140,
    wheelchairRegularOneWay: 75,
    wheelchairRegularRoundtrip: 90,
    wheelchairOffHoursOneWay: 90,
    wheelchairOffHoursRoundtrip: 115,
    wheelchairHolidayOneWay: 105,
    wheelchairHolidayRoundtrip: 140,
    stretcherRegularOneWay: 350,
    stretcherRegularRoundtrip: 650,
    stretcherHolidayOneWay: 410,
    stretcherHolidayRoundtrip: 760
  },
  deadheadRate: 1.50,
  settings: {
    roundMileageToTen: true,
    roundTotalToFive: true,
    roundDeadheadToFive: true,
    minimumMiles: 5,
    deadheadFreeMiles: 15
  }
};

export const RateProvider = ({ children }) => {
  const [rates, setRates] = useState(defaultRates);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedRates = localStorage.getItem('rainbowRoadRates');
    if (savedRates) {
      try {
        const parsed = JSON.parse(savedRates);
        setRates({ ...defaultRates, ...parsed });
      } catch (e) {
        console.error('Error parsing saved rates:', e);
      }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('rainbowRoadTheme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const updateRates = (newRates) => {
    setRates(newRates);
    localStorage.setItem('rainbowRoadRates', JSON.stringify(newRates));
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('rainbowRoadTheme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const roundMileage = (miles) => {
    if (rates.settings.roundMileageToTen) {
      return Math.ceil(miles / 10) * 10;
    }
    return Math.ceil(miles);
  };

  const roundTotal = (amount) => {
    if (rates.settings.roundTotalToFive) {
      return Math.ceil(amount / 5) * 5;
    }
    return amount;
  };

  const roundDeadhead = (amount) => {
    if (rates.settings.roundDeadheadToFive) {
      return Math.ceil(amount / 5) * 5;
    }
    return amount;
  };

  const getMinimumFare = (serviceType, rateType, tripType) => {
    const key = `${serviceType}${rateType.charAt(0).toUpperCase() + rateType.slice(1)}${tripType.charAt(0).toUpperCase() + tripType.slice(1)}`;
    return rates.minimumFares[key] || 0;
  };

  const calculateRate = (params) => {
    const {
      serviceType,
      rateType,
      tripType,
      miles,
      deadheadMiles = 0,
      deadheadMultiplier = 1,
      addOns = {},
      markup = { type: 'none', value: 0 }
    } = params;

    // Get base rates based on rate type
    let baseFare = 0;
    let mileageRate = 0;

    if (rateType === 'regular+offHours') {
      baseFare = rates.baseFares.regular[serviceType] + rates.baseFares.offHours[serviceType];
      mileageRate = rates.mileageRates.regular[serviceType] + rates.mileageRates.offHours[serviceType];
    } else {
      baseFare = rates.baseFares[rateType][serviceType];
      mileageRate = rates.mileageRates[rateType][serviceType];
    }

    // Apply trip type multiplier to base fare
    const tripMultiplier = tripType === 'roundtrip' ? 2 : 1;
    
    // Add one-way rate if applicable
    let oneWayRate = 0;
    if (tripType === 'oneway') {
      oneWayRate = rates.oneWayRates[serviceType];
    }

    const totalBaseFare = (baseFare * tripMultiplier) + (oneWayRate * (tripType === 'oneway' ? 1 : 0));

    // Calculate miles with minimum and rounding
    let processedMiles = Math.max(miles, rates.settings.minimumMiles);
    processedMiles = roundMileage(processedMiles);
    
    // For roundtrip, we don't multiply miles by 2 for display, but we do for cost calculation
    const displayMiles = processedMiles;
    const calculationMiles = processedMiles * (tripType === 'roundtrip' ? 2 : 1);
    const mileageCost = calculationMiles * mileageRate;

    // Calculate deadhead cost
    let processedDeadheadMiles = Math.max(0, deadheadMiles - rates.settings.deadheadFreeMiles);
    processedDeadheadMiles = processedDeadheadMiles * deadheadMultiplier;
    let deadheadCost = processedDeadheadMiles * rates.deadheadRate;
    deadheadCost = roundDeadhead(deadheadCost);

    // Calculate add-ons
    let addOnCosts = {};
    let totalAddOnCost = 0;

    if (addOns.rampFee) {
      addOnCosts.rampFee = 10;
      totalAddOnCost += 10;
    }

    if (addOns.waitTime > 0) {
      // If less than 30 minutes, divide by 2
      let waitHours;
      if (addOns.waitTime < 30) {
        waitHours = 0.5 / 2; // Half of a 30-minute increment
      } else {
        waitHours = Math.ceil(addOns.waitTime / 30) * 0.5;
      }
      addOnCosts.waitTime = waitHours * 70;
      totalAddOnCost += addOnCosts.waitTime;
    }

    if (addOns.secondDriver) {
      addOnCosts.secondDriver = 50;
      totalAddOnCost += 50;
    }

    if (addOns.companionFee > 0) {
      const companionCost = addOns.companionFee * 25 * tripMultiplier;
      addOnCosts.companionFee = companionCost;
      totalAddOnCost += companionCost;
    }

    if (addOns.escort > 0) {
      addOnCosts.escort = addOns.escort * 50;
      totalAddOnCost += addOnCosts.escort;
    }

    if (addOns.airportMeetGreet) {
      const cost = addOns.airportMeetGreet === 'ORD' ? 50 : 70;
      addOnCosts.airportMeetGreet = cost;
      totalAddOnCost += cost;
    }

    if (addOns.stopOverFee > 0) {
      addOnCosts.stopOverFee = addOns.stopOverFee * 25;
      totalAddOnCost += addOnCosts.stopOverFee;
    }

    if (addOns.multipleDestinations > 0) {
      addOnCosts.multipleDestinations = addOns.multipleDestinations * 35;
      totalAddOnCost += addOnCosts.multipleDestinations;
    }

    // Calculate subtotal before markup
    let subtotal = totalBaseFare + mileageCost + deadheadCost + totalAddOnCost;

    // Check minimum fare
    const minimumFare = getMinimumFare(serviceType, rateType, tripType);
    if (subtotal < minimumFare) {
      subtotal = minimumFare;
    }

    // Apply markup
    let markupAmount = 0;
    if (markup.type === 'dollar') {
      markupAmount = markup.value;
    } else if (markup.type === 'percent') {
      markupAmount = subtotal * (markup.value / 100);
    }

    // Calculate final total
    const beforeRounding = subtotal + markupAmount;
    const total = roundTotal(beforeRounding);

    return {
      baseFare: totalBaseFare,
      mileageCost,
      deadheadCost,
      addOnCosts,
      totalAddOnCost,
      markupAmount,
      subtotal,
      total,
      minimumFare,
      breakdown: {
        originalMiles: miles,
        processedMiles,
        calculationMiles,
        displayMiles,
        deadheadMiles: processedDeadheadMiles,
        tripMultiplier,
        deadheadMultiplier,
        oneWayRate
      }
    };
  };

  return (
    <RateContext.Provider value={{ 
      rates, 
      updateRates, 
      calculateRate, 
      roundMileage, 
      roundTotal, 
      theme, 
      updateTheme 
    }}>
      {children}
    </RateContext.Provider>
  );
};