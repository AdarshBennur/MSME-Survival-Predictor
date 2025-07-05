import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { motion } from 'framer-motion';
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
  ResponsiveContainer,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from 'recharts';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const InsightsPage = () => {
  const { predictionData, businessData, hasUserData, formatIndianCurrency, formatIndianNumber } = usePrediction();
  
  // Check if user is authenticated
  const isAuthenticated = !!(localStorage.getItem('user') && localStorage.getItem('token'));
  
  // Debug: Log the state when component mounts/updates
  React.useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    console.log('🔍 INSIGHTS PAGE STATE CHECK:', {
      hasUserData,
      predictionData: predictionData ? 'EXISTS' : 'NULL',
      businessData: businessData ? {
        revenue: businessData.revenue,
        expenses: businessData.expenses,
        employeeCount: businessData.employeeCount,
        yearsInBusiness: businessData.yearsInBusiness,
        assets: businessData.assets,
        debt: businessData.debt,
        cashFlow: businessData.cashFlow
      } : 'NULL'
    });
    
    // 🚨 CHART VISIBILITY DEBUG
    if (hasUserData && businessData) {
      console.log('📊 CHART DEBUGGING - All data available for rendering');
      console.log('🎯 EXPENSE MANAGEMENT Chart should be visible with data:', {
        costControl: Math.max(0, 100 - ((businessData.expenses / businessData.revenue) * 100)),
        expenseRatio: businessData.expenses / businessData.revenue,
        hasRevenue: businessData.revenue > 0,
        hasExpenses: businessData.expenses >= 0
      });
      console.log('⚡ EFFICIENCY INDICATORS Chart should be visible with data:', {
        revenuePerEmployee: businessData.employeeCount > 0 ? (businessData.revenue / businessData.employeeCount) : 0,
        assetUtilization: businessData.assets > 0 ? (businessData.revenue / businessData.assets) : 0,
        hasEmployees: businessData.employeeCount > 0,
        hasAssets: businessData.assets > 0
      });
    } else {
      console.log('❌ CHART DEBUGGING - Missing data, charts should not render');
    }
  }, [hasUserData, predictionData, businessData, isAuthenticated]);

  // Function to save insights data to backend
  const saveInsightsToBackend = async (insightsData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5001/api/insights', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(insightsData)
      });

      if (response.ok) {
        console.log('✅ Insights data saved to backend successfully');
      } else {
        console.error('❌ Failed to save insights data to backend');
      }
    } catch (error) {
      console.error('❌ Error saving insights data:', error);
    }
  };

  // Get insights based on actual user data with direct calculation (avoiding function dependency)
  const insights = React.useMemo(() => {
    if (!predictionData || !businessData || !hasUserData) {
      console.log('❌ No data available for insights:', { 
        predictionData: !!predictionData, 
        businessData: !!businessData, 
        hasUserData 
      });
      return null;
    }
    
    console.log('🔄 RECALCULATING INSIGHTS with business data:', businessData);
    console.log('📊 GENERATING INSIGHTS with data:', { 
      revenue: businessData.revenue, 
      expenses: businessData.expenses,
      employeeCount: businessData.employeeCount,
      yearsInBusiness: businessData.yearsInBusiness
    });

    const calculatedInsights = {
      riskFactors: {
        financial: {
          // Financial Health Score (0-100 where 100 = excellent health) - SAME as Risk Prediction
          score: (() => {
            const financialHealthScore = Math.max(0, Math.min(100, 
              (businessData.cashFlow > 0 ? 25 : 0) + // Positive cash flow = 25 points
              (businessData.revenue > businessData.expenses ? 25 : 0) + // Profitable = 25 points
              Math.min(25, Math.max(0, (businessData.cashFlow / (businessData.revenue / 12)) * 25)) + // Cash flow ratio = up to 25 points
              Math.min(25, Math.max(0, ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 * 0.25)) // Profit margin = up to 25 points
            ));
            return Math.max(0, 100 - financialHealthScore); // Convert health to risk: Higher health = Lower risk
          })(),
          trend: businessData.cashFlow > 0 ? 'positive' : 'negative',
          description: businessData.cashFlow > 0 ? 'Positive cash flow indicates good financial health' : 'Negative cash flow requires immediate attention'
        },
        operational: {
          // Business Maturity Score (0-100 where 100 = very mature business) - SAME as Risk Prediction
          score: (() => {
            const businessMaturityScore = Math.max(0, Math.min(100, 
              businessData.yearsInBusiness >= 10 ? 100 :  // Very mature (10+ years)
              businessData.yearsInBusiness >= 5 ? 80 :    // Mature (5-9 years)
              businessData.yearsInBusiness >= 3 ? 60 :    // Established (3-4 years)
              businessData.yearsInBusiness >= 1 ? 40 :    // Young (1-2 years)
              20                                           // Very young (< 1 year)
            ));
            return Math.max(0, 100 - businessMaturityScore); // Convert health to risk
          })(),
          trend: businessData.yearsInBusiness > 3 ? 'positive' : 'neutral',
          description: businessData.yearsInBusiness > 3 ? 'Established business with good operational stability' : 'Growing business with room for operational improvements'
        },
        market: {
          // Market Position Score (0-100 where 100 = excellent market position) - SAME as Risk Prediction
          score: (() => {
            const marketPositionScore = Math.max(0, Math.min(100, 
              // Market growth (30% weight): 0-10% growth
              Math.min(30, (businessData.marketGrowth || 0) * 3) + 
              // Digital presence (25% weight): 1-10 scale
              Math.min(25, (businessData.digitalPresence || 5) * 2.5) + 
              // Competition level (25% weight): 1-10 scale (inverted - low competition is good)
              Math.min(25, (10 - (businessData.competitionLevel || 5)) * 2.5) + 
              // Customer retention (20% weight): 0-100%
              Math.min(20, (businessData.customerRetention || 50) * 0.2)
            ));
            return Math.max(0, 100 - marketPositionScore); // Convert health to risk
          })(),
          trend: businessData.marketGrowth > 5 ? 'positive' : 'neutral',
          description: businessData.marketGrowth > 5 ? 'Operating in a growth market with good opportunities' : 'Market conditions require strategic positioning'
        }
      },
      trends: {
        riskScore: predictionData.riskScore,
        improvement: predictionData.riskScore < 50 ? 'Risk level is manageable with proper attention' : 'Risk level requires immediate action',
        forecast: predictionData.riskScore < 30 ? 'Low risk expected to continue' : 
                 predictionData.riskScore < 70 ? 'Moderate risk - monitor closely' : 
                 'High risk - implement mitigation strategies immediately'
      },
      keyMetrics: {
        // Calculate metrics using SAME logic as Risk Prediction page to ensure consistency
        profitability: (() => {
          // Financial Health Score (0-100 where 100 = excellent health) - SAME as Risk Prediction
          const financialHealthScore = Math.max(0, Math.min(100, 
            (businessData.cashFlow > 0 ? 25 : 0) + // Positive cash flow = 25 points
            (businessData.revenue > businessData.expenses ? 25 : 0) + // Profitable = 25 points
            Math.min(25, Math.max(0, (businessData.cashFlow / (businessData.revenue / 12)) * 25)) + // Cash flow ratio = up to 25 points
            Math.min(25, Math.max(0, ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 * 0.25)) // Profit margin = up to 25 points
          ));
          
          // Convert health score to profitability percentage (showing the actual profit margin when positive)
          const actualProfitMargin = ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100;
          const profitabilityScore = financialHealthScore; // Use health score as the metric
          
          console.log('💰 Profitability calc (CONSISTENT WITH RISK PAGE):', { 
            revenue: businessData.revenue, 
            expenses: businessData.expenses, 
            actualProfitMargin: actualProfitMargin.toFixed(1),
            financialHealthScore: financialHealthScore.toFixed(1),
            result: profitabilityScore.toFixed(1)
          });
          return parseFloat(profitabilityScore.toFixed(1));
        })(),
        
        efficiency: (() => {
          // Business Maturity Score (0-100 where 100 = very mature business) - SAME as Risk Prediction
          const businessMaturityScore = Math.max(0, Math.min(100, 
            businessData.yearsInBusiness >= 10 ? 100 :  // Very mature (10+ years)
            businessData.yearsInBusiness >= 5 ? 80 :    // Mature (5-9 years)
            businessData.yearsInBusiness >= 3 ? 60 :    // Established (3-4 years)
            businessData.yearsInBusiness >= 1 ? 40 :    // Young (1-2 years)
            20                                           // Very young (< 1 year)
          ));
          
          // Also factor in revenue per employee for efficiency
          const revenuePerEmployee = businessData.revenue / businessData.employeeCount;
          const revenueEfficiencyBonus = Math.min(20, (revenuePerEmployee / 500000) * 20); // Up to 20 bonus points
          
          const efficiencyScore = Math.min(100, businessMaturityScore + revenueEfficiencyBonus);
          
          console.log('⚡ Efficiency calc (CONSISTENT WITH RISK PAGE):', { 
            revenue: businessData.revenue, 
            employees: businessData.employeeCount, 
            years: businessData.yearsInBusiness,
            businessMaturityScore: businessMaturityScore.toFixed(1),
            revenuePerEmployee,
            revenueEfficiencyBonus: revenueEfficiencyBonus.toFixed(1),
            result: efficiencyScore.toFixed(1)
          });
          return parseFloat(efficiencyScore.toFixed(1));
        })(),
        
        // Debt Management Score (0-100 where 100 = excellent debt management) - SAME as Risk Prediction
        stability: (() => {
          const debtToAssetRatio = businessData.assets > 0 ? (businessData.debt / businessData.assets) : 1;
          const debtManagementScore = Math.max(0, Math.min(100, 
            debtToAssetRatio <= 0.3 ? 100 :  // Excellent (debt <= 30% of assets)
            debtToAssetRatio <= 0.5 ? 80 :   // Good (debt <= 50% of assets)
            debtToAssetRatio <= 0.7 ? 60 :   // Fair (debt <= 70% of assets)
            debtToAssetRatio <= 1.0 ? 40 :   // Poor (debt <= 100% of assets)
            20                                // Very poor (debt > assets)
          ));
          
          // Add business maturity bonus for stability
          const maturityBonus = Math.min(20, businessData.yearsInBusiness * 2);
          const stabilityScore = Math.min(100, debtManagementScore + maturityBonus);
          
          console.log('🏢 Stability calc (CONSISTENT WITH RISK PAGE):', { 
            debtToAssetRatio: debtToAssetRatio.toFixed(2),
            years: businessData.yearsInBusiness,
            debtManagementScore: debtManagementScore.toFixed(1),
            maturityBonus: maturityBonus.toFixed(1),
            result: stabilityScore.toFixed(1)
          });
          return parseFloat(stabilityScore.toFixed(1));
        })(),
        
        // Market Position Score (0-100 where 100 = excellent market position) - SAME as Risk Prediction
        growth: (() => {
          const marketPositionScore = Math.max(0, Math.min(100, 
            // Market growth (30% weight): 0-10% growth
            Math.min(30, (businessData.marketGrowth || 0) * 3) + 
            // Digital presence (25% weight): 1-10 scale
            Math.min(25, (businessData.digitalPresence || 5) * 2.5) + 
            // Competition level (25% weight): 1-10 scale (inverted - low competition is good)
            Math.min(25, (10 - (businessData.competitionLevel || 5)) * 2.5) + 
            // Customer retention (20% weight): 0-100%
            Math.min(20, (businessData.customerRetention || 50) * 0.2)
          ));
          
          console.log('📈 Growth calc (CONSISTENT WITH RISK PAGE):', { 
            marketGrowth: businessData.marketGrowth || 0,
            digitalPresence: businessData.digitalPresence || 5,
            competitionLevel: businessData.competitionLevel || 5,
            customerRetention: businessData.customerRetention || 50,
            result: marketPositionScore.toFixed(1)
          });
          return parseFloat(marketPositionScore.toFixed(1));
        })()
      }
    };

    console.log('✅ FINAL INSIGHTS CALCULATED:', calculatedInsights);
    
    // Save insights to backend automatically
    setTimeout(() => {
      saveInsightsToBackend({
        marketTrends: {
          industry: businessData.industry || '',
          marketGrowth: businessData.marketGrowth || 0,
          competitorAnalysis: 'Analysis based on current market conditions',
          marketOpportunities: ['Growth opportunity identified', 'Market expansion potential']
        },
        businessAnalytics: {
          revenueGrowth: calculatedInsights.keyMetrics.profitability,
          profitMargin: ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100,
          customerAcquisitionCost: businessData.marketingSpend || 0,
          customerLifetimeValue: businessData.avgTransactionValue * 12 || 0,
          burnRate: businessData.expenses / 12
        },
        predictions: {
          nextQuarterRevenue: businessData.revenue * 1.1,
          growthProjection: calculatedInsights.keyMetrics.profitability,
          riskFactors: [
            `Financial risk: ${calculatedInsights.riskFactors.financial.score.toFixed(1)}%`,
            `Operational risk: ${calculatedInsights.riskFactors.operational.score.toFixed(1)}%`,
            `Market risk: ${calculatedInsights.riskFactors.market.score.toFixed(1)}%`
          ],
          recommendations: [
            calculatedInsights.trends.improvement,
            calculatedInsights.trends.forecast
          ]
        },
        performanceMetrics: {
          efficiency: calculatedInsights.keyMetrics.efficiency,
          productivity: calculatedInsights.keyMetrics.profitability,
          sustainability: Math.max(0, 100 - predictionData.riskScore),
          innovation: calculatedInsights.keyMetrics.growth || 50
        }
      });
    }, 1000);
    
    return calculatedInsights;
  }, [hasUserData, businessData, predictionData]);



  const getRiskColor = (score) => {
    if (score < 40) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'positive') {
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    } else if (trend === 'negative') {
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
        </svg>
      );
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
            <h1 className="text-3xl font-bold gradient-heading">
              Business Insights
            </h1>
            <p className="mt-2 text-gray-600">
              Comprehensive analysis of your business risk factors and performance metrics
            </p>
              </div>
            </div>
          </motion.div>

          {!hasUserData ? (
            <motion.div variants={fadeIn} className="mt-6">
              <div className="card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
                <p className="text-gray-600 mb-6">
                  Complete a risk assessment to get detailed insights about your business performance and risk factors.
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
          ) : (
            <>
              {/* Risk Overview with Premium Design */}
              <motion.div variants={fadeIn} className="mb-8">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Risk Assessment Overview
                      </h2>
                      <p className="text-gray-600 mt-1">Comprehensive risk analysis across key business areas</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                      predictionData.riskScore < 40 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                        : predictionData.riskScore < 70 
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' 
                        : 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
                    }`}>
                      {predictionData.riskScore}% Overall Risk
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Risk Factors Cards */}
                    <div className="space-y-4">
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Financial Health</h3>
                              <p className="text-xs text-gray-500">{insights.riskFactors.financial.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getRiskColor(insights.riskFactors.financial.score)}`}>
                        {insights.riskFactors.financial.score.toFixed(0)}%
                      </div>
                        {getTrendIcon(insights.riskFactors.financial.trend)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Operational Stability</h3>
                              <p className="text-xs text-gray-500">{insights.riskFactors.operational.description}</p>
                      </div>
                    </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getRiskColor(insights.riskFactors.operational.score)}`}>
                        {insights.riskFactors.operational.score.toFixed(0)}%
                            </div>
                            {getTrendIcon(insights.riskFactors.operational.trend)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Market Position</h3>
                              <p className="text-xs text-gray-500">{insights.riskFactors.market.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getRiskColor(insights.riskFactors.market.score)}`}>
                              {insights.riskFactors.market.score.toFixed(0)}%
                            </div>
                            {getTrendIcon(insights.riskFactors.market.trend)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Premium Risk Distribution Chart */}
                    <div className="bg-gradient-to-br from-white/95 via-slate-50/80 to-blue-50/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/40">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Risk Distribution Analysis
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 font-medium">Premium Risk Assessment Overview</p>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-lg"></div>
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-lg"></div>
                        </div>
                      </div>
                      <div className="h-80 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { 
                                  name: 'Financial Health', 
                                  value: insights.riskFactors.financial.score,
                                  fill: '#F59E0B',
                                  description: 'Financial stability and performance'
                                },
                                { 
                                  name: 'Operational Stability', 
                                  value: insights.riskFactors.operational.score,
                                  fill: '#3B82F6',
                                  description: 'Business operations efficiency'
                                },
                                { 
                                  name: 'Market Position', 
                                  value: insights.riskFactors.market.score,
                                  fill: '#8B5CF6',
                                  description: 'Market competitiveness'
                                }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={120}
                              paddingAngle={4}
                              dataKey="value"
                              stroke="#ffffff"
                              strokeWidth={3}
                            >
                              {[
                                { fill: '#F59E0B' },
                                { fill: '#3B82F6' },
                                { fill: '#8B5CF6' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50">
                                      <p className="font-bold text-slate-800 text-lg">{data.name}</p>
                                      <p className="text-slate-600 text-sm mb-2">{data.description}</p>
                                      <p className="text-2xl font-bold text-slate-900">{data.value}%</p>
                                      <p className="text-xs text-slate-500 mt-1">
                                        Risk Level: {data.value < 40 ? 'Low' : data.value < 70 ? 'Moderate' : 'High'}
                                      </p>
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
                                <div className="flex justify-center space-x-6 mt-6">
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
                        {/* Center decoration - Actually centered with the doughnut chart */}
                        <div 
                          className="absolute pointer-events-none" 
                          style={{ 
                            left: '50%',
                            top: '45%', // Positioned at the visual center of the doughnut (accounting for legend space)
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <div className="w-24 h-24 bg-gradient-to-br from-slate-100/80 to-slate-200/60 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/60 shadow-lg">
                            <div className="text-center">
                              <div className="text-lg font-bold text-slate-800">Risk</div>
                              <div className="text-xs text-slate-600 font-medium">Assessment</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Dynamic Insights Bar Graphs - New Sections */}

              {/* 1. Profitability Analysis Section */}
              <motion.div variants={fadeIn} className="mb-8">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 shadow-xl border border-emerald-100">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-600 bg-clip-text text-transparent">
                      Profitability Analysis
                    </h2>
                    <p className="text-gray-600 mt-1">Color-coded performance indicators and efficiency metrics</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Primary Profitability Chart */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Profitability Metrics
                        </h3>
                          <p className="text-sm text-slate-500 mt-1 font-medium">Performance vs Industry Benchmarks</p>
                        </div>
                        </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: 'Profit Margin',
                                current: ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100,
                                benchmark: 15,
                                fill: ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 < 0 ? '#EF4444' : 
                                      ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 < 10 ? '#F59E0B' : '#10B981'
                              },
                              {
                                name: 'Revenue Efficiency',
                                current: insights.keyMetrics.profitability,
                                benchmark: 75,
                                fill: insights.keyMetrics.profitability < 40 ? '#EF4444' : 
                                      insights.keyMetrics.profitability < 70 ? '#F59E0B' : '#10B981'
                              },
                              {
                                name: 'ROI Score',
                                current: Math.min(100, (businessData.revenue / (businessData.assets || 1)) * 50),
                                benchmark: 60,
                                fill: Math.min(100, (businessData.revenue / (businessData.assets || 1)) * 50) < 30 ? '#EF4444' : 
                                      Math.min(100, (businessData.revenue / (businessData.assets || 1)) * 50) < 60 ? '#F59E0B' : '#10B981'
                              }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <defs>
                              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#047857" stopOpacity={0.7}/>
                              </linearGradient>
                              <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#D97706" stopOpacity={0.7}/>
                              </linearGradient>
                              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#B91C1C" stopOpacity={0.7}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 11, fontWeight: 500, fill: '#64748B' }}
                              domain={[-20, 100]}
                            />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50">
                                      <p className="font-bold text-slate-800 text-lg">{label}</p>
                                      <div className="mt-2 space-y-1">
                                        <p className="text-slate-700">Current: <span className="font-bold">{data.current.toFixed(1)}%</span></p>
                                        <p className="text-slate-700">Benchmark: <span className="font-bold">{data.benchmark}%</span></p>
                                        <p className="text-xs text-slate-500 mt-2">
                                          Status: {data.current < 0 ? 'Needs Attention' : data.current < data.benchmark * 0.7 ? 'Below Average' : 'Good Performance'}
                                        </p>
                        </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="current" radius={[6, 6, 0, 0]} stroke="#ffffff" strokeWidth={2} />
                            <Bar dataKey="benchmark" fill="#CBD5E1" fillOpacity={0.3} radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Secondary Metrics */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
                        Expense Management
                        </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={(() => {
                              // Calculate proper expense management metrics
                              const expenseRatio = businessData?.revenue > 0 ? (businessData.expenses / businessData.revenue) * 100 : 70;
                              const profitMargin = businessData?.revenue > 0 ? ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 : 15;
                              const costEfficiency = Math.max(10, Math.min(100, 100 - expenseRatio)); // How well costs are controlled
                              const cashFlowHealth = businessData?.cashFlow > 0 ? Math.min(100, Math.max(20, (businessData.cashFlow / (businessData.revenue / 12)) * 50)) : 30;
                              
                              console.log('📊 EXPENSE MANAGEMENT AREA CHART DATA:', {
                                expenseRatio: expenseRatio.toFixed(1) + '%',
                                profitMargin: profitMargin.toFixed(1) + '%',
                                costEfficiency: costEfficiency.toFixed(1) + '%',
                                cashFlowHealth: cashFlowHealth.toFixed(1) + '%'
                              });
                              
                              return [
                                {
                                  category: 'Baseline',
                                  'Cost Efficiency': Math.max(15, costEfficiency * 0.7),
                                  'Profit Margin': Math.max(5, profitMargin > 0 ? profitMargin * 0.8 : 5),
                                  'Cash Flow Health': Math.max(10, cashFlowHealth * 0.6)
                                },
                                {
                                  category: 'Current',
                                  'Cost Efficiency': costEfficiency,
                                  'Profit Margin': Math.max(5, profitMargin > 0 ? profitMargin : 5),
                                  'Cash Flow Health': cashFlowHealth
                                },
                                {
                                  category: 'Target',
                                  'Cost Efficiency': Math.min(95, costEfficiency * 1.1),
                                  'Profit Margin': Math.max(8, profitMargin > 0 ? Math.min(35, profitMargin * 1.3) : 12),
                                  'Cash Flow Health': Math.min(90, cashFlowHealth * 1.2)
                                }
                              ];
                            })()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                          >
                            <defs>
                              <linearGradient id="costControlGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="expenseManagementGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.4} />
                            <XAxis 
                              dataKey="category" 
                              axisLine={false} 
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#64748B' }}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#64748B' }}
                              domain={[0, 100]}
                            />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50">
                                      <p className="font-bold text-slate-800 text-lg mb-2">{label}</p>
                                      <div className="space-y-1">
                                        {payload.map((entry, index) => (
                                          <div key={index} className="flex items-center justify-between">
                                            <span className="text-slate-700 text-sm">{entry.dataKey}:</span>
                                            <span 
                                              className="font-bold ml-2" 
                                              style={{ color: entry.color }}
                                            >
                                              {entry.value.toFixed(1)}%
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="Cost Efficiency"
                              stroke="#3B82F6"
                              strokeWidth={2}
                              fill="url(#costControlGradient)"
                            />
                            <Area
                              type="monotone"
                              dataKey="Profit Margin"
                              stroke="#10B981"
                              strokeWidth={2}
                              fill="url(#expenseManagementGradient)"
                            />
                            <Area
                              type="monotone"
                              dataKey="Cash Flow Health"
                              stroke="#F59E0B"
                              strokeWidth={2}
                              fill="url(#efficiencyGradient)"
                            />
                            <Legend 
                              verticalAlign="bottom"
                              height={30}
                              iconType="line"
                              wrapperStyle={{
                                paddingTop: '15px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        </div>
                        </div>
                        </div>
                        </div>
              </motion.div>

              {/* 2. Financial Stability Assessment Section */}
              <motion.div variants={fadeIn} className="mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl border border-blue-100">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-600 bg-clip-text text-transparent">
                      Financial Stability Assessment
                    </h2>
                    <p className="text-gray-600 mt-1">Risk indicators and stability metrics with threshold markers</p>
                      </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Multi-Bar Stability Chart */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Stability Indicators
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 font-medium">Multi-factor stability analysis</p>
                        </div>
                    </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                              data={[
                                { 
                                name: 'Cash Flow',
                                stability: Math.max(0, Math.min(100, (businessData.cashFlow / (businessData.revenue / 12)) * 100 + 50)),
                                debt: insights.keyMetrics.stability,
                                liquidity: Math.min(100, (businessData.assets / businessData.debt) * 25)
                              }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50">
                                      <p className="font-bold text-slate-800 text-lg mb-2">Stability Metrics</p>
                                      {payload.map((entry, index) => (
                                        <div key={index} className="flex justify-between items-center mb-1">
                                          <span className="text-sm" style={{ color: entry.color }}>
                                            {entry.dataKey === 'stability' ? 'Cash Flow Index' : 
                                             entry.dataKey === 'debt' ? 'Debt Management' : 'Liquidity Ratio'}:
                                          </span>
                                          <span className="font-bold">{entry.value.toFixed(1)}%</span>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="stability" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="debt" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="liquidity" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                                    </div>
                                </div>

                    {/* Historical Stability Trend */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
                        6-Month Stability Trend
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={(() => {
                              const data = [
                                { 
                                  month: 'Jan', 
                                  score: Math.max(20, (insights.keyMetrics.stability || 50) - 15),
                                  fill: '#EF4444'
                                },
                                { 
                                  month: 'Feb', 
                                  score: Math.max(25, (insights.keyMetrics.stability || 50) - 10),
                                  fill: '#F59E0B'
                                },
                                { 
                                  month: 'Mar', 
                                  score: Math.max(30, (insights.keyMetrics.stability || 50) - 8),
                                  fill: '#F59E0B'
                                },
                                { 
                                  month: 'Apr', 
                                  score: Math.max(35, (insights.keyMetrics.stability || 50) - 5),
                                  fill: '#10B981'
                                },
                                { 
                                  month: 'May', 
                                  score: Math.max(40, (insights.keyMetrics.stability || 50) - 2),
                                  fill: '#10B981'
                                },
                                { 
                                  month: 'Jun', 
                                  score: insights.keyMetrics.stability || 50,
                                  fill: '#10B981'
                                }
                              ];
                              console.log('📈 6-MONTH STABILITY TREND DATA:', data);
                              return data;
                            })()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <defs>
                              <linearGradient id="redGradientStab" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#B91C1C" stopOpacity={0.7}/>
                              </linearGradient>
                              <linearGradient id="yellowGradientStab" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#D97706" stopOpacity={0.7}/>
                              </linearGradient>
                              <linearGradient id="greenGradientStab" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#047857" stopOpacity={0.7}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50">
                                      <p className="font-bold text-slate-800 text-lg">{label}</p>
                                      <p className="text-slate-700">Stability Score: <span className="font-bold">{data.score.toFixed(1)}%</span></p>
                                      <p className="text-xs text-slate-500 mt-2">
                                        Trend: {data.score < 40 ? 'Needs Improvement' : data.score < 70 ? 'Moderate' : 'Strong'}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar 
                              dataKey="score" 
                              radius={[6, 6, 0, 0]}
                              stroke="#ffffff"
                              strokeWidth={2}
                            >
                              {[
                                { fill: 'url(#redGradientStab)' },
                                { fill: 'url(#yellowGradientStab)' },
                                { fill: 'url(#yellowGradientStab)' },
                                { fill: 'url(#greenGradientStab)' },
                                { fill: 'url(#greenGradientStab)' },
                                { fill: 'url(#greenGradientStab)' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 3. Growth Potential Indicators Section */}
              <motion.div variants={fadeIn} className="mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border border-purple-100">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">
                      Growth Potential Indicators
                    </h2>
                    <p className="text-gray-600 mt-1">Composite growth analysis and future projections</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Composite Growth Score */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Growth Components
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 font-medium">Individual growth factors</p>
                        </div>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: 'Market Growth',
                                value: (businessData.marketGrowth || 3) * 10,
                                benchmark: 50,
                                fill: '#8B5CF6'
                              },
                              {
                                name: 'Innovation Index',
                                value: (businessData.digitalPresence || 5) * 10,
                                benchmark: 70,
                                fill: '#EC4899'
                              },
                              {
                                name: 'Digital Adoption',
                                value: insights.keyMetrics.growth,
                                benchmark: 60,
                                fill: '#10B981'
                              }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false}
                              tickLine={false}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }}
                            />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50">
                                      <p className="font-bold text-slate-800 text-lg">{label}</p>
                                      <div className="mt-2 space-y-1">
                                        <p className="text-slate-700">Current: <span className="font-bold">{data.value.toFixed(1)}%</span></p>
                                        <p className="text-slate-700">Benchmark: <span className="font-bold">{data.benchmark}%</span></p>
                                        <p className="text-xs text-slate-500 mt-2">
                                          Status: {data.value >= data.benchmark ? 'Above Target' : 'Below Target'}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} stroke="#ffffff" strokeWidth={2}>
                              {[
                                { fill: '#8B5CF6' },
                                { fill: '#EC4899' },
                                { fill: '#10B981' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                            <Bar dataKey="benchmark" fill="#CBD5E1" fillOpacity={0.3} radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                                    </div>
                    </div>

                    {/* Future Projection */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
                        Growth Projection
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { period: 'Q1', projection: insights.keyMetrics.growth },
                              { period: 'Q2', projection: Math.min(100, insights.keyMetrics.growth + 5) },
                              { period: 'Q3', projection: Math.min(100, insights.keyMetrics.growth + 8) },
                              { period: 'Q4', projection: Math.min(100, insights.keyMetrics.growth + 12) }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                            <XAxis dataKey="period" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="projection" fill="#A855F7" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 4. Operational Efficiency Metrics Section */}
              <motion.div variants={fadeIn} className="mb-8">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 shadow-xl border border-amber-100">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-600 bg-clip-text text-transparent">
                      Operational Efficiency Metrics
                    </h2>
                    <p className="text-gray-600 mt-1">Performance benchmarking and productivity analysis</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Efficiency Dashboard */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Efficiency Indicators
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 font-medium">Key performance metrics</p>
                        </div>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart 
                            cx="50%" 
                            cy="50%" 
                            innerRadius="20%" 
                            outerRadius="80%" 
                            data={(() => {
                              // 🔥 FIXED: Realistic efficiency metrics with proper business benchmarks
                              
                              // Revenue per Employee: ₹30L+ = Excellent (100%), ₹15L = Good (50%), ₹5L = Poor (17%)
                              const revenuePerEmployee = businessData?.employeeCount > 0 ? 
                                Math.min(100, Math.max(0, (businessData.revenue / businessData.employeeCount) / 300000 * 100)) : 15;
                              
                              // Asset Turnover: More realistic calculation 
                              // 2.0+ = Excellent (100%), 1.5 = Good (75%), 1.0 = Average (50%), 0.5 = Poor (25%)
                              const assetTurnoverRatio = businessData?.assets > 0 ? 
                                Math.min(100, Math.max(0, (businessData.revenue / businessData.assets) / 2.0 * 100)) : 15;
                              
                              // Operational Efficiency: 25%+ profit = Excellent (100%), 15% = Good (60%), 5% = Poor (20%)
                              const profitMargin = businessData?.revenue > 0 ? 
                                ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 : 0;
                              const operationalEfficiency = Math.min(100, Math.max(0, 
                                profitMargin >= 25 ? 100 :
                                profitMargin >= 15 ? 60 + ((profitMargin - 15) * 4) :
                                profitMargin >= 5 ? 20 + ((profitMargin - 5) * 4) :
                                profitMargin >= 0 ? profitMargin * 4 :
                                0 // Negative margin = 0%
                              ));
                              
                              console.log('⚡ DEBUGGING ASSET TURNOVER CALCULATION:', {
                                revenue: businessData?.revenue,
                                assets: businessData?.assets,
                                assetTurnoverRawRatio: businessData?.assets > 0 ? (businessData.revenue / businessData.assets) : 'N/A',
                                calculatedPercentage: assetTurnoverRatio,
                                revenuePerEmployee: `₹${(businessData?.revenue / businessData?.employeeCount / 100000).toFixed(1)}L per employee → ${revenuePerEmployee.toFixed(1)}%`,
                                assetTurnoverRatio: `${businessData?.assets > 0 ? (businessData?.revenue / businessData?.assets).toFixed(2) : 'N/A'}x turnover → ${assetTurnoverRatio.toFixed(1)}%`,
                                operationalEfficiency: `${profitMargin.toFixed(1)}% profit margin → ${operationalEfficiency.toFixed(1)}%`,
                                businessData: {
                                  revenue: businessData?.revenue,
                                  expenses: businessData?.expenses,
                                  employees: businessData?.employeeCount,
                                  assets: businessData?.assets
                                }
                              });
                              
                              return [
                                {
                                  name: 'Operational Efficiency',
                                  value: operationalEfficiency,
                                  fill: '#3B82F6'
                                },
                                {
                                  name: 'Asset Turnover', 
                                  value: assetTurnoverRatio,
                                  fill: '#10B981'
                                },
                                {
                                  name: 'Revenue per Employee',
                                  value: revenuePerEmployee,
                                  fill: '#F59E0B'
                                }
                              ];
                            })()}
                            startAngle={90} 
                            endAngle={450}
                          >
                            <RadialBar 
                              dataKey="value" 
                              cornerRadius={10} 
                              fill="#8884d8"
                            />
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50">
                                      <p className="font-bold text-slate-800 text-lg">{data.name}</p>
                                      <div className="mt-2 space-y-1">
                                        <p className="text-slate-700">
                                          Performance: <span className="font-bold" style={{color: data.fill}}>
                                            {data.value.toFixed(1)}%
                                          </span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2">
                                          {data.name === 'Revenue per Employee' ? 
                                            (data.value >= 80 ? 'Exceptional (₹24L+ per employee)' : 
                                             data.value >= 50 ? 'Good (₹15L+ per employee)' : 
                                             data.value >= 17 ? 'Below Average (₹5L+ per employee)' : 'Poor Productivity') :
                                           data.name === 'Asset Turnover' ? 
                                            (data.value >= 75 ? 'Excellent Asset Utilization (1.5x+ ratio)' : 
                                             data.value >= 50 ? 'Good Asset Use (1.0x+ ratio)' : 
                                             data.value >= 25 ? 'Moderate Efficiency (0.5x+ ratio)' : 'Poor Asset Utilization') :
                                            (data.value >= 80 ? 'Highly Profitable (20%+ margin)' : 
                                             data.value >= 60 ? 'Good Profitability (15%+ margin)' : 
                                             data.value >= 20 ? 'Low Profitability (5%+ margin)' : 'Needs Improvement')}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend 
                              iconSize={12}
                              layout="horizontal"
                              verticalAlign="bottom"
                              align="center"
                              wrapperStyle={{
                                paddingTop: '20px',
                                fontSize: '12px'
                              }}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Productivity Trends */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
                        Productivity Improvement
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { month: 'Jan', efficiency: Math.max(30, insights.keyMetrics.efficiency - 20), improvement: 0 },
                              { month: 'Feb', efficiency: Math.max(35, insights.keyMetrics.efficiency - 15), improvement: 5 },
                              { month: 'Mar', efficiency: Math.max(40, insights.keyMetrics.efficiency - 10), improvement: 8 },
                              { month: 'Apr', efficiency: Math.max(45, insights.keyMetrics.efficiency - 8), improvement: 12 },
                              { month: 'May', efficiency: Math.max(50, insights.keyMetrics.efficiency - 5), improvement: 15 },
                              { month: 'Jun', efficiency: insights.keyMetrics.efficiency, improvement: 20 }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="efficiency" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Risk Forecast */}
              <motion.div variants={fadeIn} className="mb-8">
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Risk Forecast & Recommendations</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Current Assessment</h3>
                    <p className="text-gray-700">{insights.trends.improvement}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Future Outlook</h3>
                    <p className="text-gray-700">{insights.trends.forecast}</p>
                  </div>
                </div>
              </motion.div>

              {/* Action Items */}
              <motion.div variants={fadeIn} className="mb-8">
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Get Recommendations</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        View personalized recommendations based on your risk assessment.
                      </p>
                      <Link 
                        to="/recommendations" 
                        className="btn btn-primary inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        View Recommendations
                      </Link>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Update Assessment</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Run a new risk assessment to keep your insights current.
                      </p>
                      <Link 
                        to="/risk-prediction" 
                        className="btn btn-secondary inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        New Assessment
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InsightsPage; 