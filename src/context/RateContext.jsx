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
  ambulatory: {
    baseFare: 25.00,
    mileageRate: 2.50,
    deadheadRate: 1.25
  },
  wheelchair: {
    baseFare: 30.00,
    mileageRate: 2.75,
    deadheadRate: 1.50
  },
  stretcher: {
    baseFare: 45.00,
    mileageRate: 3.50,
    deadheadRate: 2.00
  }
};

export const RateProvider = ({ children }) => {
  const [rates, setRates] = useState(defaultRates);

  useEffect(() => {
    const savedRates = localStorage.getItem('rainbowRoadRates');
    if (savedRates) {
      setRates(JSON.parse(savedRates));
    }
  }, []);

  const updateRates = (newRates) => {
    setRates(newRates);
    localStorage.setItem('rainbowRoadRates', JSON.stringify(newRates));
  };

  const calculateRate = (serviceType, miles, deadheadMiles = 0) => {
    const rate = rates[serviceType];
    if (!rate) return 0;

    const baseFare = rate.baseFare;
    const mileageCost = miles * rate.mileageRate;
    const deadheadCost = deadheadMiles * rate.deadheadRate;

    return {
      baseFare,
      mileageCost,
      deadheadCost,
      total: baseFare + mileageCost + deadheadCost
    };
  };

  return (
    <RateContext.Provider value={{ rates, updateRates, calculateRate }}>
      {children}
    </RateContext.Provider>
  );
};