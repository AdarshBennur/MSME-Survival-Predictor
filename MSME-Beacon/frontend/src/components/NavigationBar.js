import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BeaconLogo from '../assets/BeaconLogo';

const NavigationBar = () => {
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check actual authentication state
  const isAuthenticated = !!(localStorage.getItem('user') && localStorage.getItem('token'));
  
  const handleLogout = () => {
    // Clear all user data and prediction data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('predictionData');
    localStorage.removeItem('businessData');
    localStorage.removeItem('hasUserData');
    localStorage.removeItem('userSettings');
    localStorage.removeItem('isAuthenticated');
    console.log('🚪 User logged out - all data cleared');
    window.location.href = '/login';
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Logo and main nav items */}
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white font-bold text-xl flex items-center">
                <BeaconLogo />
                MSME Beacon
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`${isActive('/dashboard')} text-white px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/risk-prediction"
                  className={`${isActive('/risk-prediction')} text-white px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Risk Prediction
                </Link>
                <Link
                  to="/recommendations"
                  className={`${isActive('/recommendations')} text-white px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Recommendations
                </Link>
                <Link
                  to="/insights"
                  className={`${isActive('/insights')} text-white px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Insights
                </Link>
                <Link
                  to="/help-support"
                  className={`${isActive('/help-support')} text-white px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Help & Support
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-blue-600 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={toggleProfileMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <svg className="h-8 w-8 rounded-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                
                {/* Profile dropdown */}
                {isProfileMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`${isActive('/dashboard')} text-white block px-3 py-2 rounded-md text-base font-medium`}
            >
              Dashboard
            </Link>
            <Link
              to="/risk-prediction"
              className={`${isActive('/risk-prediction')} text-white block px-3 py-2 rounded-md text-base font-medium`}
            >
              Risk Prediction
            </Link>
            <Link
              to="/recommendations"
              className={`${isActive('/recommendations')} text-white block px-3 py-2 rounded-md text-base font-medium`}
            >
              Recommendations
            </Link>
            <Link
              to="/insights"
              className={`${isActive('/insights')} text-white block px-3 py-2 rounded-md text-base font-medium`}
            >
              Insights
            </Link>
            <Link
              to="/help-support"
              className={`${isActive('/help-support')} text-white block px-3 py-2 rounded-md text-base font-medium`}
            >
              Help & Support
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar; 