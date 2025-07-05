import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { usePrediction } from '../context/PredictionContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const HomePage = () => {
  const { predictionData, businessData, hasUserData, formatIndianCurrency, formatIndianNumber } = usePrediction();
  
  // Check if user is authenticated
  const isAuthenticated = !!(localStorage.getItem('user') && localStorage.getItem('token'));

  // Enhanced animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const slideInLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const slideInRight = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Enhanced risk level styling
  const getRiskLevelStyle = (score) => {
    if (score < 40) return {
      bg: 'from-emerald-500 to-green-600',
      text: 'text-white',
      shadow: 'shadow-emerald-500/25'
    };
    if (score < 70) return {
      bg: 'from-amber-500 to-orange-600',
      text: 'text-white',
      shadow: 'shadow-amber-500/25'
    };
    return {
      bg: 'from-red-500 to-rose-600',
      text: 'text-white',
      shadow: 'shadow-red-500/25'
    };
  };

  const getRiskLevelText = (score) => {
    if (score < 40) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  const getRiskDescription = (score) => {
    if (score < 40) return "Your business demonstrates excellent stability with minimal risk factors. Continue maintaining these strong fundamentals.";
    if (score < 70) return "Your business shows moderate risk levels that require strategic attention to ensure continued growth and stability.";
    return "Your business faces significant risks that need immediate strategic intervention to prevent potential issues.";
  };

  const getRiskGradient = (score) => {
    if (score < 40) return 'from-green-500 to-emerald-500';
    if (score < 70) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-heading mb-4">
              Executive Dashboard
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Comprehensive business intelligence and risk assessment platform for modern enterprises
            </p>
          </motion.div>

          {!isAuthenticated ? (
            <motion.div variants={fadeInScale} className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Sign in to your account to access your personalized risk assessment dashboard and business insights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/login" 
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : !hasUserData ? (
            <motion.div variants={fadeInScale} className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Welcome to Your Business Intelligence Hub</h3>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Transform your business with AI-powered risk assessment and strategic insights. Get started by conducting your first comprehensive business analysis.
                  </p>
                  <Link 
                    to="/risk-prediction" 
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Begin Risk Assessment
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={staggerContainer} className="space-y-8">
              {/* Executive Summary Card */}
              <motion.div variants={fadeInUp} className="bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                <div>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 via-indigo-400/5 to-transparent rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/10 via-pink-400/5 to-transparent rounded-full blur-2xl"></div>
                  
                  {/* Header with Risk-based Background */}
                  <div className={`px-8 py-6 bg-gradient-to-r ${getRiskGradient(predictionData.riskScore)} rounded-t-3xl mb-8`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {businessData?.industryType ? 
                            businessData.industryType.charAt(0).toUpperCase() + businessData.industryType.slice(1).toLowerCase() 
                            : 'Business'} Executive Overview
                        </h2>
                        <p className="text-sm text-white text-opacity-90 mt-1">Comprehensive performance analytics and strategic insights</p>
                      </div>
                      <div className="hidden lg:flex items-center space-x-3">
                        <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
                        <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
                        <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 px-8">

                    {/* Risk Assessment Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      <motion.div variants={slideInLeft} className="flex items-center space-x-8">
                        {/* Enhanced Circular Progress */}
                        <div className="relative">
                          <div className="w-40 h-40">
                            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                              {/* Background Circle */}
                              <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke="#E2E8F0"
                                strokeWidth="9"
                                fill="transparent"
                                className="drop-shadow-sm"
                              />
                              {/* Progress Circle */}
                              <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke={`url(#riskGradient-${predictionData.riskScore < 40 ? 'low' : predictionData.riskScore < 70 ? 'medium' : 'high'})`}
                                strokeWidth="9"
                                fill="transparent"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 50}`}
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - predictionData.riskScore / 100)}`}
                                className="transition-all duration-1000 ease-out drop-shadow-sm"
                              />
                              {/* Gradient Definitions */}
                              <defs>
                                <linearGradient id="riskGradient-low" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#10B981" />
                                  <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                                <linearGradient id="riskGradient-medium" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#F59E0B" />
                                  <stop offset="100%" stopColor="#D97706" />
                                </linearGradient>
                                <linearGradient id="riskGradient-high" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#EF4444" />
                                  <stop offset="100%" stopColor="#DC2626" />
                                </linearGradient>
                              </defs>
                            </svg>
                            {/* Center Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-4xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                {predictionData.riskScore}%
                              </span>
                              <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Risk</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="mb-4">
                            <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r ${getRiskLevelStyle(predictionData.riskScore).bg} ${getRiskLevelStyle(predictionData.riskScore).text} shadow-xl ${getRiskLevelStyle(predictionData.riskScore).shadow}`}>
                              <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
                              {getRiskLevelText(predictionData.riskScore)}
                            </div>
                          </div>
                          <p className="text-slate-700 text-lg leading-relaxed">
                            {getRiskDescription(predictionData.riskScore)}
                          </p>
                        </div>
                      </motion.div>

                      {/* Quick Stats */}
                      <motion.div variants={slideInRight} className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-emerald-900 mb-1">
                            {((businessData.revenue - businessData.expenses) / businessData.revenue * 100).toFixed(1)}%
                          </p>
                          <p className="text-emerald-700 font-medium">Profit Margin</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-blue-900 mb-1">{formatIndianNumber(businessData.employeeCount)}</p>
                          <p className="text-blue-700 font-medium">Employees</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-purple-900 mb-1">{formatIndianCurrency(businessData.revenue)}</p>
                          <p className="text-purple-700 font-medium">Revenue</p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-amber-900 mb-1">{businessData.yearsInBusiness}</p>
                          <p className="text-amber-700 font-medium">Years</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Financial Dashboard */}
              <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Financial Metrics */}
                <div className="bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Financial Performance
                      </h3>
                                              <p className="text-gray-600 mt-1">Key financial indicators and metrics</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-emerald-900">Annual Revenue</p>
                          <p className="text-sm text-emerald-700">Total business income</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-emerald-900">{formatIndianCurrency(businessData.revenue)}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-red-900">Annual Expenses</p>
                          <p className="text-sm text-red-700">Operating costs</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-red-900">{formatIndianCurrency(businessData.expenses)}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">Monthly Cash Flow</p>
                          <p className="text-sm text-blue-700">Liquidity status</p>
                        </div>
                      </div>
                      <p className={`text-xl font-bold ${businessData.cashFlow > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatIndianCurrency(businessData.cashFlow)}
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-purple-900">Net Worth</p>
                            <p className="text-sm text-purple-700">Assets minus liabilities</p>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-purple-900">
                          {formatIndianCurrency(Math.max(0, (businessData.assets || 0) - (businessData.debt || 0)))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Intelligence */}
                <div className="bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Business Intelligence
                      </h3>
                                              <p className="text-gray-600 mt-1">Strategic insights and metrics</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
                        {formatIndianCurrency(businessData.revenue / businessData.employeeCount)}
                      </div>
                      <div className="text-sm font-medium text-slate-600">Revenue/Employee</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-2">
                        {businessData.marketGrowth || 0}%
                      </div>
                      <div className="text-sm font-medium text-slate-600">Market Growth</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-amber-900">Business Maturity</span>
                        <span className="text-lg font-bold text-amber-900">
                          {businessData.yearsInBusiness > 5 ? 'Established' : businessData.yearsInBusiness > 2 ? 'Growing' : 'Startup'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-teal-900">Digital Presence</span>
                        <span className="text-lg font-bold text-teal-900">{businessData.digitalPresence || 0}/10</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-pink-900">Customer Retention</span>
                        <span className="text-lg font-bold text-pink-900">{businessData.customerRetention || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Financial Analysis with Charts */}
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-gray-100">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Financial Analysis
                    </h2>
                    <p className="text-gray-600 mt-1">Comprehensive overview of your financial position and cash flow</p>
                  </div>
                  
                  {/* Rearranged Financial Analysis - 2x2 Grid Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Row 1: Revenue & Profitability */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          Revenue & Profitability
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 font-medium">Annual Revenue</span>
                            <span className="font-bold text-green-600">{formatIndianCurrency(businessData.revenue)}</span>
                        </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 font-medium">Annual Expenses</span>
                            <span className="font-bold text-red-500">{formatIndianCurrency(businessData.expenses)}</span>
                        </div>
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                            <span className="text-gray-700 font-semibold">Net Profit</span>
                            <span className={`font-bold text-lg ${businessData.revenue - businessData.expenses > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatIndianCurrency(businessData.revenue - businessData.expenses)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Row 1: Assets & Liabilities */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          Assets & Liabilities
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 font-medium">Monthly Cash Flow</span>
                            <span className={`font-bold ${businessData.cashFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatIndianCurrency(businessData.cashFlow)}
                          </span>
                        </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 font-medium">Total Assets</span>
                            <span className="font-bold text-blue-600">{formatIndianCurrency(businessData.assets)}</span>
                        </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 font-medium">Total Debt</span>
                            <span className="font-bold text-red-500">{formatIndianCurrency(businessData.debt)}</span>
                        </div>
                        </div>
                      </div>

                    {/* Row 2: Revenue vs Expenses Chart */}
                    <div className="bg-gradient-to-br from-white/95 via-green-50/40 to-emerald-50/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Revenue vs Expenses
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 font-medium">Financial Performance Breakdown</p>
                        </div>
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-lg"></div>
                    </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { 
                                  name: 'Revenue', 
                                  value: businessData.revenue,
                                  description: 'Total business revenue'
                                },
                                { 
                                  name: 'Expenses', 
                                  value: businessData.expenses,
                                  description: 'Total business expenses'
                                },
                                { 
                                  name: 'Net Profit', 
                                  value: Math.max(0, businessData.revenue - businessData.expenses),
                                  description: 'Profit after expenses'
                                }
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              paddingAngle={3}
                              dataKey="value"
                              stroke="#ffffff"
                              strokeWidth={3}
                            >
                              <Cell key="revenue" fill="#10B981" />
                              <Cell key="expenses" fill="#EF4444" />
                              <Cell key="profit" fill="#3B82F6" />
                            </Pie>
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  const total = businessData.revenue + businessData.expenses + Math.max(0, businessData.revenue - businessData.expenses);
                                  const percentage = ((data.value / total) * 100).toFixed(1);
                                  return (
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50">
                                      <p className="font-bold text-slate-800 text-lg">{data.name}</p>
                                      <p className="text-slate-600 text-sm mb-2">{data.description}</p>
                                      <p className="text-2xl font-bold text-slate-900">{formatIndianCurrency(data.value)}</p>
                                      <p className="text-xs text-slate-500 mt-1">Percentage: {percentage}%</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend 
                              verticalAlign="bottom" 
                              height={36}
                              content={({ payload }) => (
                                <div className="flex justify-center space-x-6 mt-4">
                                  {payload.map((entry, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <div 
                                        className="w-4 h-4 rounded-full shadow-lg"
                                        style={{ backgroundColor: entry.color }}
                                      ></div>
                                      <span className="text-sm font-semibold text-slate-700">{entry.value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Row 2: Assets vs Debt Chart */}
                    <div className="bg-gradient-to-br from-white/95 via-blue-50/40 to-indigo-50/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Assets vs Debt
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 font-medium">Financial Position Analysis</p>
                        </div>
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg"></div>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: 'Assets',
                                value: businessData.assets,
                                fill: '#3B82F6',
                                description: 'Total business assets'
                              },
                              {
                                name: 'Debt',
                                value: businessData.debt,
                                fill: '#EF4444',
                                description: 'Total outstanding debt'
                              },
                              {
                                name: 'Net Worth',
                                value: Math.max(0, businessData.assets - businessData.debt),
                                fill: '#10B981',
                                description: 'Assets minus debt'
                              }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <defs>
                              <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.7}/>
                              </linearGradient>
                              <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#B91C1C" stopOpacity={0.7}/>
                              </linearGradient>
                              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#047857" stopOpacity={0.7}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ 
                                fontSize: 12, 
                                fontWeight: 600, 
                                fill: '#475569' 
                              }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              tick={{ 
                                fontSize: 11, 
                                fontWeight: 500, 
                                fill: '#64748B' 
                              }}
                              tickFormatter={(value) => formatIndianCurrency(value)}
                            />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50">
                                      <p className="font-bold text-slate-800 text-lg">{label}</p>
                                      <p className="text-slate-600 text-sm mb-2">{data.description}</p>
                                      <p className="text-2xl font-bold text-slate-900">{formatIndianCurrency(data.value)}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar 
                              dataKey="value" 
                              fill={(entry) => {
                                if (entry.name === 'Assets') return 'url(#assetsGradient)';
                                if (entry.name === 'Debt') return 'url(#debtGradient)';
                                return 'url(#netWorthGradient)';
                              }}
                              radius={[8, 8, 0, 0]}
                              stroke="#ffffff"
                              strokeWidth={2}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Cards */}
              <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div 
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Update Assessment</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Refresh your risk analysis with the latest business data and market conditions.
                    </p>
                    <Link
                      to="/risk-prediction"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      New Assessment
                    </Link>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-green-600 rounded-r-full"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Strategic Recommendations</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Access AI-powered recommendations tailored to your business profile and risk factors.
                    </p>
                    <Link
                      to="/recommendations"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      View Recommendations
                    </Link>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:col-span-2 lg:col-span-1"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-violet-600 rounded-r-full"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Business Insights</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Explore comprehensive analytics and performance insights for strategic decision-making.
                    </p>
                    <Link
                      to="/insights"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Insights
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;