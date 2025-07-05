import React, { createContext, useContext, useState } from 'react';

const PredictionContext = createContext();

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};

// Indian currency formatter
export const formatIndianCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numAmount)) return '₹0';
  
  // Format with Indian numbering system
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(numAmount);
};

// Indian number formatter (without currency symbol)
export const formatIndianNumber = (number) => {
  if (!number && number !== 0) return '0';
  
  const numAmount = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(numAmount)) return '0';
  
  return new Intl.NumberFormat('en-IN').format(numAmount);
};

export const PredictionProvider = ({ children }) => {
  const [predictionData, setPredictionData] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [hasUserData, setHasUserData] = useState(false);

  // Store prediction result and business data
  const storePredictionData = (prediction, business) => {
    console.log('💾 STORING PREDICTION DATA:', {
      predictionRiskScore: prediction.riskScore,
      businessRevenue: business.revenue,
      businessExpenses: business.expenses,
      employeeCount: business.employeeCount
    });
    
    setPredictionData(prediction);
    setBusinessData(business);
    setHasUserData(true);
    
    // Store in localStorage for persistence
    localStorage.setItem('predictionData', JSON.stringify(prediction));
    localStorage.setItem('businessData', JSON.stringify(business));
    localStorage.setItem('hasUserData', 'true');
  };

  // Clear all data
  const clearPredictionData = () => {
    setPredictionData(null);
    setBusinessData(null);
    setHasUserData(false);
    
    // Clear localStorage
    localStorage.removeItem('predictionData');
    localStorage.removeItem('businessData');
    localStorage.removeItem('hasUserData');
  };

  // Load data from localStorage on init (only if user is logged in)
  React.useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (!storedUser || !storedToken) {
      console.log('❌ NO AUTHENTICATED USER - CLEARING PREDICTION DATA');
      clearPredictionData();
      return;
    }

    const savedPrediction = localStorage.getItem('predictionData');
    const savedBusiness = localStorage.getItem('businessData');
    const savedHasData = localStorage.getItem('hasUserData');
    
    console.log('📱 LOADING FROM LOCALSTORAGE FOR AUTHENTICATED USER:', {
      savedPrediction: savedPrediction ? 'EXISTS' : 'NULL',
      savedBusiness: savedBusiness ? 'EXISTS' : 'NULL',
      savedHasData,
      userEmail: JSON.parse(storedUser).email
    });
    
    if (savedPrediction && savedBusiness && savedHasData === 'true') {
      const parsedPrediction = JSON.parse(savedPrediction);
      const parsedBusiness = JSON.parse(savedBusiness);
      console.log('✅ SUCCESSFULLY LOADED DATA FOR USER:', JSON.parse(storedUser).email, {
        predictionRiskScore: parsedPrediction.riskScore,
        businessRevenue: parsedBusiness.revenue,
        businessExpenses: parsedBusiness.expenses
      });
      setPredictionData(parsedPrediction);
      setBusinessData(parsedBusiness);
      setHasUserData(true);
    } else {
      console.log('❌ NO VALID PREDICTION DATA IN LOCALSTORAGE');
    }
  }, []);

  // Generate recommendations based on prediction data
  const getRecommendations = () => {
    if (!predictionData || !businessData) return [];

    const recommendations = [];
    const riskScore = predictionData.riskScore;

    // Financial recommendations
    if (businessData.cashFlow < 0) {
      recommendations.push({
        category: 'Financial',
        title: 'Improve Cash Flow Management',
        description: 'Your business is experiencing negative cash flow. Consider implementing better cash flow forecasting and expense management.',
        priority: 'High',
        impact: 'High',
        timeframe: '1-3 months',
        action: 'Implement cash flow forecasting tools and review all non-essential expenses'
      });
    }

    if (businessData.debt / businessData.assets > 0.7) {
      recommendations.push({
        category: 'Financial',
        title: 'Reduce Debt-to-Asset Ratio',
        description: 'Your debt-to-asset ratio is high, which increases financial risk.',
        priority: 'High',
        impact: 'High',
        timeframe: '6-12 months',
        action: 'Create a debt reduction plan and consider asset optimization'
      });
    }

    // Business recommendations
    if (businessData.yearsInBusiness < 3) {
      recommendations.push({
        category: 'Business Development',
        title: 'Strengthen Business Foundation',
        description: 'As a relatively new business, focus on building stable processes and customer relationships.',
        priority: 'Medium',
        impact: 'Medium',
        timeframe: '3-6 months',
        action: 'Develop standard operating procedures and customer retention strategies'
      });
    }

    if (businessData.digitalPresence < 7) {
      recommendations.push({
        category: 'Digital Transformation',
        title: 'Enhance Digital Presence',
        description: 'Improving your digital presence can help reach more customers and increase revenue.',
        priority: 'Medium',
        impact: 'Medium',
        timeframe: '3-6 months',
        action: 'Invest in website optimization, social media presence, and online marketing'
      });
    }

    // Market recommendations
    if (businessData.competitionLevel > 7) {
      recommendations.push({
        category: 'Market Strategy',
        title: 'Differentiate from Competition',
        description: 'High competition requires strong differentiation strategies.',
        priority: 'Medium',
        impact: 'High',
        timeframe: '3-6 months',
        action: 'Develop unique value propositions and focus on customer service excellence'
      });
    }

    if (businessData.customerRetention < 70) {
      recommendations.push({
        category: 'Customer Retention',
        title: 'Improve Customer Retention',
        description: 'Low customer retention rate is affecting business stability.',
        priority: 'High',
        impact: 'High',
        timeframe: '1-3 months',
        action: 'Implement customer feedback systems and loyalty programs'
      });
    }

    return recommendations;
  };

  // Generate insights based on prediction data
  const getInsights = () => {
    if (!predictionData || !businessData) {
      console.log('❌ No data available for insights:', { predictionData: !!predictionData, businessData: !!businessData });
      return null;
    }
    
    console.log('📊 GENERATING INSIGHTS with data:', { 
      revenue: businessData.revenue, 
      expenses: businessData.expenses,
      employeeCount: businessData.employeeCount,
      yearsInBusiness: businessData.yearsInBusiness
    });

    const insights = {
      riskFactors: {
        financial: {
          score: Math.max(0, 100 - Math.max(0, Math.min(100, 
            // Calculate financial health based on multiple factors, then convert to risk (BALANCED FORMULA)
            (businessData.cashFlow > 0 ? 25 : 0) + // Positive cash flow = 25 points
            (businessData.revenue > businessData.expenses ? 25 : 0) + // Profitable = 25 points
            Math.min(25, Math.max(0, (businessData.cashFlow / (businessData.revenue / 12)) * 25)) + // Cash flow ratio = up to 25 points
            Math.min(25, Math.max(0, ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 * 0.25)) // Profit margin = up to 25 points
          ))), // Convert health to risk: Higher health = Lower risk
          trend: businessData.cashFlow > 0 ? 'positive' : 'negative',
          description: businessData.cashFlow > 0 ? 'Positive cash flow indicates good financial health' : 'Negative cash flow requires immediate attention'
        },
        operational: {
          score: Math.max(0, Math.min(100, 100 - businessData.yearsInBusiness * 10)),
          trend: businessData.yearsInBusiness > 3 ? 'positive' : 'neutral',
          description: businessData.yearsInBusiness > 3 ? 'Established business with good operational stability' : 'Growing business with room for operational improvements'
        },
        market: {
          score: businessData.marketGrowth * 10 + (10 - businessData.competitionLevel) * 5,
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
        profitability: (() => {
          const profit = parseFloat(((businessData.revenue - businessData.expenses) / businessData.revenue * 100).toFixed(1));
          console.log('💰 Profitability calc:', { revenue: businessData.revenue, expenses: businessData.expenses, result: profit });
          return profit;
        })(),
        efficiency: (() => {
          // Calculate efficiency as percentage compared to ₹5L benchmark per employee
          const revenuePerEmployee = businessData.revenue / businessData.employeeCount;
          const benchmark = 500000; // ₹5L per employee
          const efficiencyPercent = Math.min(100, (revenuePerEmployee / benchmark) * 100);
          console.log('⚡ Efficiency calc:', { 
            revenue: businessData.revenue, 
            employees: businessData.employeeCount, 
            revenuePerEmployee,
            benchmark,
            result: efficiencyPercent.toFixed(1) 
          });
          return parseFloat(efficiencyPercent.toFixed(1));
        })(),
        // Enhanced stability calculation - returns numerical score
        stability: (() => {
          const debtToAssetRatio = businessData.assets > 0 ? (businessData.debt / businessData.assets) : 1;
          const isProfit = businessData.revenue > businessData.expenses;
          const positiveCashFlow = businessData.cashFlow > 0;
          const mature = businessData.yearsInBusiness >= 3;
          
          // Calculate stability score (0-100)
          let stabilityScore = 0;
          
          // Years in business (up to 30 points)
          stabilityScore += Math.min(30, businessData.yearsInBusiness * 5);
          
          // Debt management (up to 25 points)
          stabilityScore += Math.max(0, 25 - (debtToAssetRatio * 25));
          
          // Profitability (25 points)
          if (isProfit) stabilityScore += 25;
          
          // Cash flow (20 points)
          if (positiveCashFlow) stabilityScore += 20;
          
          console.log('🏢 Stability calc:', { 
            debtToAssetRatio, isProfit, positiveCashFlow, mature, 
            years: businessData.yearsInBusiness,
            stabilityScore: stabilityScore.toFixed(1)
          });
          return parseFloat(stabilityScore.toFixed(1));
        })(),
        // Enhanced growth calculation - returns numerical score
        growth: (() => {
          const revenuePerEmployee = businessData.revenue / businessData.employeeCount;
          const profitMargin = ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100;
          const marketFactor = businessData.marketGrowth || 0;
          
          // Calculate growth score (0-100)
          let growthScore = 0;
          
          // Profit margin points (up to 40 points)
          if (profitMargin > 20) growthScore += 40;
          else if (profitMargin > 15) growthScore += 30;
          else if (profitMargin > 10) growthScore += 20;
          else if (profitMargin > 5) growthScore += 15;
          else if (profitMargin > 0) growthScore += 10;
          
          // Revenue efficiency points (up to 30 points)
          if (revenuePerEmployee > 1000000) growthScore += 30;
          else if (revenuePerEmployee > 750000) growthScore += 25;
          else if (revenuePerEmployee > 500000) growthScore += 20;
          else if (revenuePerEmployee > 300000) growthScore += 15;
          else if (revenuePerEmployee > 200000) growthScore += 10;
          else growthScore += 5;
          
          // Market growth points (up to 30 points)
          growthScore += Math.min(30, marketFactor * 3);
          
          console.log('📈 Growth calc:', { 
            revenuePerEmployee, profitMargin, marketFactor,
            growthScore: growthScore.toFixed(1)
          });
          return parseFloat(growthScore.toFixed(1));
        })()
      }
    };

    return insights;
  };

  const value = {
    predictionData,
    businessData,
    hasUserData,
    storePredictionData,
    clearPredictionData,
    getRecommendations,
    getInsights,
    formatIndianCurrency,
    formatIndianNumber
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
}; 