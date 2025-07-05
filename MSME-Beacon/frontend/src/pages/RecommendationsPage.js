import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { usePrediction } from '../context/PredictionContext';

const RecommendationsPage = () => {
  const { predictionData, businessData, hasUserData, getRecommendations } = usePrediction();
  const [activeFilter, setActiveFilter] = useState('All');

  // Check if user is authenticated
  const isAuthenticated = !!(localStorage.getItem('user') && localStorage.getItem('token'));
  
  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  // Get recommendations based on actual user data
  const userRecommendations = hasUserData ? getRecommendations() : [];
  
  // Filter recommendations
  const filteredRecommendations = activeFilter === 'All' 
    ? userRecommendations 
    : userRecommendations.filter(rec => rec.priority === activeFilter);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Function to get priority badge color - Updated for consistency
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getPriorityGradient = (priority) => {
    switch (priority) {
      case 'High':
        return 'from-red-500 to-pink-500';
      case 'Medium':
        return 'from-orange-500 to-amber-500';
      case 'Low':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Function to render expandable recommendation card with premium design
  const RecommendationCard = ({ recommendation, index }) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.1 }}
        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
      >
        {/* Premium gradient border */}
        <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${getPriorityGradient(recommendation.priority)} opacity-80`}></div>
        
        {/* Subtle background pattern */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
          <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        
        <div className="relative px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* Enhanced header with priority and category */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-md ${getPriorityColor(recommendation.priority)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 bg-gradient-to-r ${getPriorityGradient(recommendation.priority)}`}></div>
                    {recommendation.priority} Priority
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                    {recommendation.category}
                  </span>
                </div>
              </div>
              
              {/* Enhanced title and description */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-200">
                  {recommendation.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{recommendation.description}</p>
              </div>
              
              {/* Enhanced expandable section */}
              <motion.div
                initial={false}
                animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-inner">
                                      <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm">Recommended Actions</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">{recommendation.action}</p>
                  
                                      {/* Enhanced impact and timeframe display */}
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
                        <span className="text-gray-600 font-medium">Impact:</span>
                        <span className={`font-medium px-1.5 py-0.5 rounded text-xs ${
                          recommendation.impact === 'High' 
                            ? 'bg-red-100 text-red-700' 
                            : recommendation.impact === 'Medium' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {recommendation.impact}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                        <span className="text-gray-600 font-medium">Timeframe:</span>
                        <span className="font-medium text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded text-xs">
                          {recommendation.timeframe}
                        </span>
                      </div>
                    </div>
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced expand/collapse button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setExpanded(!expanded)}
              className={`ml-6 p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
                expanded 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <motion.svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        <div className="px-4 py-6 sm:px-0">
          <motion.h1 
            variants={fadeIn}
            className="text-3xl font-bold gradient-heading mb-6"
          >
            Recommendations
          </motion.h1>
          
          {!hasUserData ? (
            <motion.div variants={fadeIn} className="mt-6">
              <div className="card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
                <p className="text-gray-600 mb-6">
                  Complete a risk assessment to get personalized recommendations for your business.
                </p>
                <Link 
                  to="/risk-prediction" 
                  className="btn btn-primary inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Start Risk Assessment
                </Link>
              </div>
            </motion.div>
          ) : userRecommendations.length === 0 ? (
            <motion.div variants={fadeIn} className="mt-6">
              <div className="card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-green-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Great Job!</h3>
                <p className="text-gray-600 mb-6">
                  Your business metrics look good. No specific recommendations at this time. Keep monitoring your risk factors regularly.
                </p>
                <Link 
                  to="/risk-prediction" 
                  className="btn btn-primary inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Update Assessment
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div variants={fadeIn} className="mt-6">
                <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-6 lg:mb-0">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Personalized Recommendations
                          </h2>
                          <p className="text-sm text-gray-600 mt-1">
                            Based on your risk assessment • Risk Score: 
                            <span className={`font-medium ml-1 px-2 py-0.5 rounded-md text-xs ${
                              predictionData.riskScore < 40 
                                ? 'bg-green-100 text-green-700' 
                                : predictionData.riskScore < 70 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {predictionData.riskScore}%
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:ml-6">
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium text-gray-700 mr-3">Filter by Priority:</span>
                      </div>
                      <div className="flex space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 p-1.5 rounded-xl shadow-inner">
                        {['All', 'High', 'Medium', 'Low'].map((priority) => (
                          <motion.button
                            key={priority}
                            onClick={() => setActiveFilter(priority)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                              activeFilter === priority
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                            }`}
                          >
                            {priority}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                className="mt-6 space-y-6"
              >
                {filteredRecommendations.map((recommendation, index) => (
                  <RecommendationCard 
                    key={index} 
                    recommendation={recommendation} 
                    index={index} 
                  />
                ))}
              </motion.div>

              {filteredRecommendations.length === 0 && activeFilter !== 'All' && (
                <motion.div variants={fadeIn} className="mt-6">
                  <div className="card p-6 text-center">
                    <p className="text-gray-600">
                      No {activeFilter.toLowerCase()} priority recommendations found.
                    </p>
                  </div>
                </motion.div>
              )}

              <motion.div variants={fadeIn} className="mt-12">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl text-white relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Need Additional Support?</h3>
                      <p className="text-indigo-100 max-w-2xl mx-auto">
                        Our expert team is here to help you implement these recommendations and accelerate your business growth
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-xl">Professional Consultation</h4>
                        </div>
                        <p className="text-indigo-100 mb-4 leading-relaxed">
                          Connect with our business experts for personalized guidance and strategic planning tailored to your industry.
                        </p>
                        <Link 
                          to="/help-support" 
                          className="inline-flex items-center bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                        >
                          Contact Support
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-xl">Detailed Analytics</h4>
                        </div>
                        <p className="text-indigo-100 mb-4 leading-relaxed">
                          Explore comprehensive insights with visual charts and detailed analysis of your business metrics and trends.
                        </p>
                        <Link 
                          to="/insights" 
                          className="inline-flex items-center bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                        >
                          View Insights
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RecommendationsPage; 