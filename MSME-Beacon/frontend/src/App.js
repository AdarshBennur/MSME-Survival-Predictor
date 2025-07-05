import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { PredictionProvider } from './context/PredictionContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import BusinessDataPage from './pages/BusinessDataPage';
import RiskPredictionPage from './pages/RiskPredictionPage';
import RecommendationsPage from './pages/RecommendationsPage';
import InsightsPage from './pages/InsightsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';

function App() {
  return (
    <PredictionProvider>
      <Router>
      <Routes>
        {/* Public Routes - No Authentication Required */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Application Routes - Authentication Optional */}
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/business-data" element={<BusinessDataPage />} />
        <Route path="/risk-prediction" element={<RiskPredictionPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/help-support" element={<HelpSupportPage />} />
        
        {/* User Routes - Authentication Optional */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
    </PredictionProvider>
  );
}

export default App; 