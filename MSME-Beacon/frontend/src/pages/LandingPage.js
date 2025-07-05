import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BeaconLogo from '../assets/BeaconLogo';

const LandingPage = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Check if user is authenticated
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Scroll animation for elements
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Main background gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100"></div>
      
      {/* Navigation - Updated to ensure it stays fixed and content doesn't overlap */}
      <nav className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center"
                >
                  <BeaconLogo />
                  MSME Beacon
                </motion.div>
              </div>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="ml-3 relative"
                >
                  <div>
                    <button
                      type="button"
                      className="bg-blue-600 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white p-1"
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
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Link
                      to="/login"
                      className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                    >
                      Log in
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Link
                      to="/signup"
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Sign up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding to ensure content doesn't overlap with fixed navbar */}
      <div className="pt-16 relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:grid lg:grid-cols-12 lg:gap-8"
            >
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
                <motion.h1 
                  variants={fadeIn}
                  className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl relative z-20"
                >
                  <span className="block text-gray-900 drop-shadow-sm">Predict and Improve</span>
                  <span className="block text-indigo-800 drop-shadow-sm">Your Business Survival</span>
                </motion.h1>
                <motion.div 
                  className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-4 mb-4 mx-auto lg:mx-0"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 96, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
                <motion.p 
                  variants={fadeIn}
                  className="mt-3 text-base text-gray-700 font-medium sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 relative z-20"
                >
                  An AI-powered tool to help micro, small, and medium enterprises assess their business viability 
                  and identify areas for improvement. Get actionable insights for your business today.
                </motion.p>
                <motion.div 
                  variants={fadeIn}
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start relative z-20"
                >
                  <div className="rounded-md shadow">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    >
                      Explore Dashboard
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/risk-prediction"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      Try Prediction
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative lg:col-span-5 mt-12 lg:mt-0"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute w-80 h-80 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                  <div className="absolute w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full ml-20 mt-20 filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="relative z-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-2xl shadow-xl p-6 w-full max-w-md">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-500">Risk Score</div>
                        <div className="text-2xl font-bold text-blue-600">78<span className="text-sm font-normal">/100</span></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Cash Flow</span>
                          <span className="text-sm font-medium text-blue-600">65%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Market Stability</span>
                          <span className="text-sm font-medium text-blue-600">82%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Operational Efficiency</span>
                          <span className="text-sm font-medium text-blue-600">58%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: '58%' }}></div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <div className="text-xs text-gray-500 mb-2">Survival prediction based on current metrics</div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-semibold text-gray-800">Medium-High chance</div>
                          <button className="text-xs font-medium text-white bg-blue-600 rounded-full px-2 py-1 hover:bg-blue-700 transition-colors duration-200">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center scroll-animate opacity-0">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold text-gray-900 sm:text-4xl">
                Everything you need to assess your business
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our platform provides comprehensive tools to help MSMEs understand their risk factors and improve their chances of survival.
              </p>
            </div>

            <div className="mt-16">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16">
                <motion.div 
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative scroll-animate opacity-0 bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg transform -rotate-6">
                    <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="pl-12 pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Risk Prediction</h3>
                    <p className="text-base text-gray-500">
                      AI-powered analysis of your business data to predict survival probability and identify risk factors, providing you with actionable insights to improve your business stability.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative scroll-animate opacity-0 bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg transform -rotate-6">
                    <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="pl-12 pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Actionable Recommendations</h3>
                    <p className="text-base text-gray-500">
                      Personalized recommendations to improve your business operations, finances, and market positioning, with clear steps to implement changes.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative scroll-animate opacity-0 bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform -rotate-6">
                    <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div className="pl-12 pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Business Insights</h3>
                    <p className="text-base text-gray-500">
                      Comprehensive analytics and visualizations to track your business performance and trends over time, helping you make data-driven decisions.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative scroll-animate opacity-0 bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center shadow-lg transform -rotate-6">
                    <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div className="pl-12 pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Support</h3>
                    <p className="text-base text-gray-500">
                      Access to business advisors and a knowledge base of resources to help your business thrive, with personalized guidance whenever you need it.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-90"></div>
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-white rounded-full opacity-20"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white rounded-full opacity-20"></div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8"
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block mb-1">Boost your business survival today.</span>
              <span className="block">Start using our platform for free.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              No credit card required. Get started with our free plan and upgrade anytime.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/signup"
                className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 sm:w-auto transition-all duration-200 shadow-lg"
              >
                Sign up for free
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
              <div className="flex space-x-6 md:order-2">
                <motion.a 
                  whileHover={{ y: -3 }}
                  href="#" 
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </motion.a>
                <motion.a 
                  whileHover={{ y: -3 }}
                  href="#" 
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
                <motion.a 
                  whileHover={{ y: -3 }}
                  href="#" 
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              </div>
              <p className="mt-8 text-base text-gray-500 md:mt-0 md:order-1">
                &copy; 2023 MSME Survival Predictor. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage; 