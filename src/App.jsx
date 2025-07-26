import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RateCalculator from './pages/RateCalculator';
import Settings from './pages/Settings';
import { RateProvider } from './context/RateContext';
import './App.css';

function App() {
  return (
    <RateProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calculator" element={<RateCalculator />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </RateProvider>
  );
}

export default App;