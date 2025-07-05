import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import IndustryTypeInput from '../components/IndustryTypeInput';
import { riskAPI } from '../utils/api';
import { usePrediction } from '../context/PredictionContext';

const RiskPredictionPage = () => {
  const { storePredictionData, formatIndianCurrency, formatIndianNumber, predictionData, businessData, hasUserData, clearPredictionData } = usePrediction();
  
  // Check if user is authenticated
  const isAuthenticated = !!(localStorage.getItem('user') && localStorage.getItem('token'));
  
  const [backendConnected, setBackendConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [showForm, setShowForm] = useState(false); // Start with false, will be set based on existing data
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'bulk'
  const [bulkFile, setBulkFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({
    // Financial data
    revenue: '',
    expenses: '',
    cashFlow: '',
    debt: '',
    assets: '',
    
    // Business metrics
    employeeCount: '',
    yearsInBusiness: '',
    industryType: '',
    location: '',
    
    // Market data
    marketGrowth: '',
    competitionLevel: '',
    customerRetention: '',
    
    // Additional factors
    digitalPresence: '',
    innovationScore: '',
  });
  
  const [riskData, setRiskData] = useState(null);

  // Check for existing data and set initial state
  useEffect(() => {
    if (hasUserData && predictionData && businessData) {
      // RECALCULATE with BALANCED formulas - Convert HEALTH scores to RISK scores for consistency
      
      // Financial Health Score (0-100 where 100 = excellent health)
      const financialHealthScore = Math.max(0, Math.min(100, 
        // Calculate financial health based on multiple factors
        (businessData.cashFlow > 0 ? 25 : 0) + // Positive cash flow = 25 points
        (businessData.revenue > businessData.expenses ? 25 : 0) + // Profitable = 25 points
        Math.min(25, Math.max(0, (businessData.cashFlow / (businessData.revenue / 12)) * 25)) + // Cash flow ratio = up to 25 points
        Math.min(25, Math.max(0, ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 * 0.25)) // Profit margin = up to 25 points
      ));
      
      // Debt Management Score (0-100 where 100 = excellent debt management)
      const debtToAssetRatio = businessData.assets > 0 ? (businessData.debt / businessData.assets) : 1;
      const debtManagementScore = Math.max(0, Math.min(100, 
        // Good debt management = low debt-to-asset ratio
        debtToAssetRatio <= 0.3 ? 100 :  // Excellent (debt <= 30% of assets)
        debtToAssetRatio <= 0.5 ? 80 :   // Good (debt <= 50% of assets)
        debtToAssetRatio <= 0.7 ? 60 :   // Fair (debt <= 70% of assets)
        debtToAssetRatio <= 1.0 ? 40 :   // Poor (debt <= 100% of assets)
        20                                // Very poor (debt > assets)
      ));
      
      // Business Maturity Score (0-100 where 100 = very mature business)
      const businessMaturityScore = Math.max(0, Math.min(100, 
        businessData.yearsInBusiness >= 10 ? 100 :  // Very mature (10+ years)
        businessData.yearsInBusiness >= 5 ? 80 :    // Mature (5-9 years)
        businessData.yearsInBusiness >= 3 ? 60 :    // Established (3-4 years)
        businessData.yearsInBusiness >= 1 ? 40 :    // Young (1-2 years)
        20                                           // Very young (< 1 year)
      ));
      
      // Market Position Score (0-100 where 100 = excellent market position)
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
      
      const recalculatedResult = {
        ...predictionData,
        factors: [
          { 
            name: 'Financial Health', 
            impact: 'High', 
            score: Math.max(0, 100 - financialHealthScore) // Convert health to risk: Higher health = Lower risk
          },
          { 
            name: 'Debt Management', 
            impact: 'High', 
            score: Math.max(0, 100 - debtManagementScore) // Convert health to risk
          },
          { 
            name: 'Business Maturity', 
            impact: 'Medium', 
            score: Math.max(0, 100 - businessMaturityScore) // Convert health to risk
          },
          { 
            name: 'Market Position', 
            impact: 'Medium', 
            score: Math.max(0, 100 - marketPositionScore) // Convert health to risk
          },
          { 
            name: 'Innovation Capacity', 
            impact: 'Low', 
            score: Math.max(0, 100 - Math.max(0, Math.min(100, businessData.innovationScore * 10))) // Convert health to risk
          }
        ]
      };
      console.log('🔄 RECALCULATED FACTORS ON PAGE LOAD:', recalculatedResult);
      console.log('💾 Current Business Data:', businessData);
      console.log('📊 Individual Factor Health Scores:');
      console.log('  - Financial Health Score:', financialHealthScore, '-> Risk:', 100 - financialHealthScore);
      console.log('  - Debt Management Score:', debtManagementScore, '-> Risk:', 100 - debtManagementScore, '(Debt/Assets:', debtToAssetRatio, ')');
      console.log('  - Business Maturity Score:', businessMaturityScore, '-> Risk:', 100 - businessMaturityScore);
      console.log('  - Market Position Score:', marketPositionScore, '-> Risk:', 100 - marketPositionScore);
      console.log('🎯 Overall Risk from Backend:', predictionData.riskScore);
      setRiskData(recalculatedResult);
      setShowForm(false); // Show results if we have data
      // Populate form with existing business data for updates
      if (businessData) {
        setFormData({
          revenue: businessData.revenue?.toString() || '',
          expenses: businessData.expenses?.toString() || '',
          cashFlow: businessData.cashFlow?.toString() || '',
          debt: businessData.debt?.toString() || '',
          assets: businessData.assets?.toString() || '',
          employeeCount: businessData.employeeCount?.toString() || '',
          yearsInBusiness: businessData.yearsInBusiness?.toString() || '',
          industryType: businessData.industryType || '',
          location: businessData.location || '',
          marketGrowth: businessData.marketGrowth?.toString() || '',
          competitionLevel: businessData.competitionLevel?.toString() || '',
          customerRetention: businessData.customerRetention?.toString() || '',
          digitalPresence: businessData.digitalPresence?.toString() || '',
          innovationScore: businessData.innovationScore?.toString() || '',
        });
      }
    } else {
      setShowForm(true); // Show form if no data exists
    }
  }, [hasUserData, predictionData, businessData]);

  // Function to handle updating details
  const handleUpdateDetails = () => {
    setShowForm(true);
    setRiskData(null);
  };

  // Function to cancel update and go back to results
  const handleCancelUpdate = () => {
    if (hasUserData && predictionData) {
      setRiskData(predictionData);
      setShowForm(false);
    }
  };

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

  // Test backend connection on component mount
  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    const testBackendConnection = async () => {
      try {
        console.log('🔍 Testing backend connection...');
        const response = await riskAPI.testConnection();
        console.log('✅ Backend connection successful:', response);
        setBackendConnected(true);
        // Only show error notifications, not success notifications
      } catch (error) {
        console.error('❌ Backend connection failed:', error);
        setBackendConnected(false);
        toast.error('Unable to connect to backend server. Please make sure the backend is running.');
      } finally {
        setCheckingConnection(false);
      }
    };

    testBackendConnection();
  }, [isAuthenticated]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadError(null);
    
    if (!file) {
      setBulkFile(null);
      return;
    }

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setUploadError('Please upload a valid CSV or Excel file (.csv, .xls, .xlsx)');
      setBulkFile(null);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      setBulkFile(null);
      return;
    }

    setBulkFile(file);
    console.log('File selected:', file.name, file.type);
  };

  // Handle bulk upload processing
  const handleBulkUpload = async () => {
    if (!bulkFile) {
      toast.error('Please select a file to upload');
      return;
    }

    // CLEAR CACHED DATA TO FORCE RECALCULATION
    localStorage.removeItem('predictionData');
    localStorage.removeItem('businessData');
    localStorage.removeItem('hasUserData');
    console.log('🧹 CLEARED CACHED DATA - FORCING FRESH CALCULATION');

    setPredicting(true);
    
    try {
      // Create FormData for file upload
      const formDataUpload = new FormData();
      formDataUpload.append('file', bulkFile);
      
      // For now, we'll process CSV client-side as demo
      // In production, this would be sent to backend
      const text = await bulkFile.text();
      const rows = text.split('\n').filter(row => row.trim());
      
      if (rows.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row');
      }
      
      // Parse CSV headers
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      const dataRows = rows.slice(1);
      
      // Process first row for demo
      const firstRow = dataRows[0].split(',').map(cell => cell.trim());
      
      // Map CSV data to our format (strict validation - no default values)
      const businessData = {
        revenue: parseFloat(firstRow[headers.indexOf('revenue')] || firstRow[0]) || 0,
        expenses: parseFloat(firstRow[headers.indexOf('expenses')] || firstRow[1]) || 0,
        cashFlow: parseFloat(firstRow[headers.indexOf('cashflow')] || firstRow[2]) || 0,
        debt: parseFloat(firstRow[headers.indexOf('debt')] || firstRow[3]) || 0,
        assets: parseFloat(firstRow[headers.indexOf('assets')] || firstRow[4]) || 0,
        employeeCount: parseInt(firstRow[headers.indexOf('employees')] || firstRow[5]) || 0,
        yearsInBusiness: parseInt(firstRow[headers.indexOf('years')] || firstRow[6]) || 0,
        industryType: firstRow[headers.indexOf('industry')] || '',
        location: firstRow[headers.indexOf('location')] || '',
        marketGrowth: parseFloat(firstRow[headers.indexOf('marketgrowth')] || firstRow[7]) || 0,
        competitionLevel: parseInt(firstRow[headers.indexOf('competition')] || firstRow[8]) || 0,
        customerRetention: parseFloat(firstRow[headers.indexOf('retention')] || firstRow[9]) || 0,
        digitalPresence: parseInt(firstRow[headers.indexOf('digital')] || firstRow[10]) || 0,
        innovationScore: parseInt(firstRow[headers.indexOf('innovation')] || firstRow[11]) || 0,
      };

      // Validate that essential fields are not empty
      if (!businessData.revenue || !businessData.expenses || !businessData.employeeCount || !businessData.yearsInBusiness) {
        throw new Error('CSV file must contain valid values for revenue, expenses, employees, and years in business');
      }
      
      console.log('Processed bulk data:', businessData);
      
      // Call the predict API
      const result = await riskAPI.predictRisk(businessData);
      
      // Process the result same as manual form - Convert HEALTH scores to RISK scores (BALANCED FORMULAS)
      
      // Financial Health Score (0-100 where 100 = excellent health)
      const financialHealthScore = Math.max(0, Math.min(100, 
        // Calculate financial health based on multiple factors
        (businessData.cashFlow > 0 ? 25 : 0) + // Positive cash flow = 25 points
        (businessData.revenue > businessData.expenses ? 25 : 0) + // Profitable = 25 points
        Math.min(25, Math.max(0, (businessData.cashFlow / (businessData.revenue / 12)) * 25)) + // Cash flow ratio = up to 25 points
        Math.min(25, Math.max(0, ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 * 0.25)) // Profit margin = up to 25 points
      ));
      
      // Debt Management Score (0-100 where 100 = excellent debt management)
      const debtToAssetRatio = businessData.assets > 0 ? (businessData.debt / businessData.assets) : 1;
      const debtManagementScore = Math.max(0, Math.min(100, 
        // Good debt management = low debt-to-asset ratio
        debtToAssetRatio <= 0.3 ? 100 :  // Excellent (debt <= 30% of assets)
        debtToAssetRatio <= 0.5 ? 80 :   // Good (debt <= 50% of assets)
        debtToAssetRatio <= 0.7 ? 60 :   // Fair (debt <= 70% of assets)
        debtToAssetRatio <= 1.0 ? 40 :   // Poor (debt <= 100% of assets)
        20                                // Very poor (debt > assets)
      ));
      
      // Business Maturity Score (0-100 where 100 = very mature business)
      const businessMaturityScore = Math.max(0, Math.min(100, 
        businessData.yearsInBusiness >= 10 ? 100 :  // Very mature (10+ years)
        businessData.yearsInBusiness >= 5 ? 80 :    // Mature (5-9 years)
        businessData.yearsInBusiness >= 3 ? 60 :    // Established (3-4 years)
        businessData.yearsInBusiness >= 1 ? 40 :    // Young (1-2 years)
        20                                           // Very young (< 1 year)
      ));
      
      // Market Position Score (0-100 where 100 = excellent market position)
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

      const processedResult = {
        riskScore: result.score,
        riskLevel: result.riskLevel,
        category: result.category,
        lastUpdated: result.lastUpdated,
        factors: [
          { 
            name: 'Financial Health', 
            impact: 'High', 
            score: Math.max(0, 100 - financialHealthScore) // Convert health to risk: Higher health = Lower risk
          },
          { 
            name: 'Debt Management', 
            impact: 'High', 
            score: Math.max(0, 100 - debtManagementScore) // Convert health to risk
          },
          { 
            name: 'Business Maturity', 
            impact: 'Medium', 
            score: Math.max(0, 100 - businessMaturityScore) // Convert health to risk
          },
          { 
            name: 'Market Position', 
            impact: 'Medium', 
            score: Math.max(0, 100 - marketPositionScore) // Convert health to risk
          },
          { 
            name: 'Innovation Capacity', 
            impact: 'Low', 
            score: Math.max(0, 100 - Math.max(0, Math.min(100, businessData.innovationScore * 10))) // Convert health to risk
          }
        ],
        trends: {
          lastMonth: result.score + Math.floor(Math.random() * 10) - 5,
          last3Months: result.score + Math.floor(Math.random() * 15) - 7,
          last6Months: result.score + Math.floor(Math.random() * 20) - 10
        }
      };
      
      // Store in context for other pages to use
      storePredictionData(processedResult, businessData);
      
      setRiskData(processedResult);
      setShowForm(false);
      toast.success(`Bulk upload completed! Processed ${dataRows.length} record(s)`);
      
    } catch (error) {
      console.error('Error processing bulk upload:', error);
      toast.error(error.message || 'Failed to process bulk upload. Please check your file format.');
    } finally {
      setPredicting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredicting(true);
    
    // CLEAR CACHED DATA TO FORCE RECALCULATION
    localStorage.removeItem('predictionData');
    localStorage.removeItem('businessData');
    localStorage.removeItem('hasUserData');
    console.log('🧹 CLEARED CACHED DATA - FORCING FRESH CALCULATION');
    
    try {
      // Validate required fields
      const requiredFields = ['revenue', 'expenses', 'cashFlow', 'employeeCount', 'yearsInBusiness'];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        toast.error('Please fill in all required fields');
        setPredicting(false);
        return;
      }
      
      // Convert string values to numbers where needed
      const businessData = {
        revenue: parseFloat(formData.revenue),
        expenses: parseFloat(formData.expenses),
        cashFlow: parseFloat(formData.cashFlow),
        debt: parseFloat(formData.debt) || 0,
        assets: parseFloat(formData.assets) || 0,
        employeeCount: parseInt(formData.employeeCount),
        yearsInBusiness: parseInt(formData.yearsInBusiness),
        industryType: formData.industryType,
        location: formData.location,
        marketGrowth: parseFloat(formData.marketGrowth) || 0,
        competitionLevel: parseInt(formData.competitionLevel) || 5,
        customerRetention: parseFloat(formData.customerRetention) || 0,
        digitalPresence: parseInt(formData.digitalPresence) || 5,
        innovationScore: parseInt(formData.innovationScore) || 5,
      };
      
      console.log('Submitting business data:', businessData);
      
      // Call the predict API
      const result = await riskAPI.predictRisk(businessData);
      
      console.log('Prediction result:', result);
      
      // Update risk data with the prediction - Convert HEALTH scores to RISK scores (BALANCED FORMULAS)
      
      // Financial Health Score (0-100 where 100 = excellent health)
      const financialHealthScore = Math.max(0, Math.min(100, 
        // Calculate financial health based on multiple factors
        (businessData.cashFlow > 0 ? 25 : 0) + // Positive cash flow = 25 points
        (businessData.revenue > businessData.expenses ? 25 : 0) + // Profitable = 25 points
        Math.min(25, Math.max(0, (businessData.cashFlow / (businessData.revenue / 12)) * 25)) + // Cash flow ratio = up to 25 points
        Math.min(25, Math.max(0, ((businessData.revenue - businessData.expenses) / businessData.revenue) * 100 * 0.25)) // Profit margin = up to 25 points
      ));
      
      // Debt Management Score (0-100 where 100 = excellent debt management)
      const debtToAssetRatio = businessData.assets > 0 ? (businessData.debt / businessData.assets) : 1;
      const debtManagementScore = Math.max(0, Math.min(100, 
        // Good debt management = low debt-to-asset ratio
        debtToAssetRatio <= 0.3 ? 100 :  // Excellent (debt <= 30% of assets)
        debtToAssetRatio <= 0.5 ? 80 :   // Good (debt <= 50% of assets)
        debtToAssetRatio <= 0.7 ? 60 :   // Fair (debt <= 70% of assets)
        debtToAssetRatio <= 1.0 ? 40 :   // Poor (debt <= 100% of assets)
        20                                // Very poor (debt > assets)
      ));
      
      // Business Maturity Score (0-100 where 100 = very mature business)
      const businessMaturityScore = Math.max(0, Math.min(100, 
        businessData.yearsInBusiness >= 10 ? 100 :  // Very mature (10+ years)
        businessData.yearsInBusiness >= 5 ? 80 :    // Mature (5-9 years)
        businessData.yearsInBusiness >= 3 ? 60 :    // Established (3-4 years)
        businessData.yearsInBusiness >= 1 ? 40 :    // Young (1-2 years)
        20                                           // Very young (< 1 year)
      ));
      
      // Market Position Score (0-100 where 100 = excellent market position)
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

      const processedResult = {
        riskScore: result.score,
        riskLevel: result.riskLevel,
        category: result.category,
        lastUpdated: result.lastUpdated,
        factors: [
          { 
            name: 'Financial Health', 
            impact: 'High', 
            score: Math.max(0, 100 - financialHealthScore) // Convert health to risk: Higher health = Lower risk
          },
          { 
            name: 'Debt Management', 
            impact: 'High', 
            score: Math.max(0, 100 - debtManagementScore) // Convert health to risk
          },
          { 
            name: 'Business Maturity', 
            impact: 'Medium', 
            score: Math.max(0, 100 - businessMaturityScore) // Convert health to risk
          },
          { 
            name: 'Market Position', 
            impact: 'Medium', 
            score: Math.max(0, 100 - marketPositionScore) // Convert health to risk
          },
          { 
            name: 'Innovation Capacity', 
            impact: 'Low', 
            score: Math.max(0, 100 - Math.max(0, Math.min(100, businessData.innovationScore * 10))) // Convert health to risk
          }
        ],
        trends: {
          lastMonth: result.score + Math.floor(Math.random() * 10) - 5,
          last3Months: result.score + Math.floor(Math.random() * 15) - 7,
          last6Months: result.score + Math.floor(Math.random() * 20) - 10
        }
      };

      // Store in context for other pages to use
      storePredictionData(processedResult, businessData);
      
      setRiskData(processedResult);
      setShowForm(false);
      toast.success('Risk prediction completed successfully!');
      
    } catch (error) {
      console.error('Error predicting risk:', error);
      
      let errorMessage = 'Failed to predict risk. Please try again.';
      
      if (error.response) {
        // Server responded with an error
        console.log('Server error response:', error.response.data);
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      } else if (error.request) {
        // Network error - request was made but no response received
        console.log('Network error - no response:', error.request);
        errorMessage = 'Network error: Unable to connect to server. Please check if the backend is running.';
      } else {
        // Something else happened
        console.log('Other error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setPredicting(false);
    }
  };

  // Function to determine risk level styling
  const getRiskLevelStyle = (score) => {
    if (score < 40) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Function to determine risk gradient styling
  const getRiskGradient = (score) => {
    if (score < 40) return 'from-green-500 to-emerald-500';
    if (score < 70) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  // Function to determine risk level text
  const getRiskLevelText = (score) => {
    if (score < 40) return 'Low';
    if (score < 70) return 'Medium';
    return 'High';
  };

  // Function to get impact badge style - Fixed to use consistent colors
  const getImpactBadgeStyle = (impact) => {
    if (impact === 'Low') return 'bg-green-100 text-green-800';
    if (impact === 'Medium') return 'bg-orange-100 text-orange-800';
    if (impact === 'High') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800'; // For neutral/zero impact
  };

  // Function to get impact color based on impact level (not percentage)
  const getImpactColor = (impact) => {
    switch(impact) {
      case 'Low': return '#4CAF50';     // Solid green
      case 'Medium': return '#FFA726';  // Solid orange  
      case 'High': return '#F44336';    // Solid red
      default: return '#E0E0E0';        // Gray for neutral/zero
    }
  };

  // Function to get impact sidebar color
  const getImpactSidebarColor = (impact) => {
    switch(impact) {
      case 'Low': return 'from-green-400 to-green-600';
      case 'Medium': return 'from-orange-400 to-orange-600';
      case 'High': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Function to render factor bar - Fixed to use impact-based colors
  const renderFactorBar = (score, impact) => {
    const impactColor = getImpactColor(impact);
    const percentage = Math.min(100, Math.max(0, score));

    return (
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-3 rounded-full"
          style={{ backgroundColor: impactColor }}
          title={`Color denotes impact severity (${impact}); Percentage denotes magnitude (${Math.round(score)}%)`}
        ></motion.div>
      </div>
    );
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (checkingConnection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-700 font-medium">Connecting to backend server...</p>
      </div>
    );
  }

  if (predicting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-700 font-medium">Analyzing business risk...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
            className="text-3xl font-bold gradient-heading"
          >
            Risk Prediction
                    </motion.h1>
          
          {showForm && (
            <motion.div variants={fadeIn} className="mt-6">
              <div className="card overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <h2 className="text-xl font-bold text-white">
                    {hasUserData && predictionData ? 'Update Business Data' : 'Business Data Input'}
                  </h2>
                  <p className="text-sm text-blue-100">
                    {hasUserData && predictionData 
                      ? 'Update your business information to get a new risk assessment'
                      : 'Enter your business information to get an AI-powered risk assessment'
                    }
                  </p>
                </div>
                
                <div className="p-6">
                  {/* Input Method Selection */}
                  <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setInputMethod('manual')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                          inputMethod === 'manual'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Manual Input
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMethod('bulk')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                          inputMethod === 'bulk'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Bulk Upload
                      </button>
                    </div>
                  </div>

                  {inputMethod === 'manual' ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Financial Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Annual Revenue * <span className="text-xs text-gray-500">(in ₹)</span>
                          </label>
                          <input
                            type="number"
                            name="revenue"
                            value={formData.revenue}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 50,00,000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Annual Expenses * <span className="text-xs text-gray-500">(in ₹)</span>
                          </label>
                          <input
                            type="number"
                            name="expenses"
                            value={formData.expenses}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 40,00,000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monthly Cash Flow * <span className="text-xs text-gray-500">(in ₹)</span>
                          </label>
                          <input
                            type="number"
                            name="cashFlow"
                            value={formData.cashFlow}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 8,00,000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Debt <span className="text-xs text-gray-500">(in ₹)</span>
                          </label>
                          <input
                            type="number"
                            name="debt"
                            value={formData.debt}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 1,00,00,000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Assets <span className="text-xs text-gray-500">(in ₹)</span>
                          </label>
                          <input
                            type="number"
                            name="assets"
                            value={formData.assets}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 2,00,00,000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employee Count *
                          </label>
                          <input
                            type="number"
                            name="employeeCount"
                            value={formData.employeeCount}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 25"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Years in Business *
                          </label>
                          <input
                            type="number"
                            name="yearsInBusiness"
                            value={formData.yearsInBusiness}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Industry Type
                          </label>
                          <IndustryTypeInput
                            name="industryType"
                            value={formData.industryType}
                            onChange={handleInputChange}
                            industryOptions={[
                              'manufacturing',
                              'retail',
                              'services',
                              'technology',
                              'healthcare',
                              'finance',
                              'construction',
                              'education',
                              'hospitality',
                              'agriculture',
                              'transportation',
                              'real estate',
                              'consulting',
                              'e-commerce',
                              'food & beverage',
                              'logistics',
                              'marketing',
                              'software',
                              'photography',
                              'other'
                            ]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., New York, NY"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Market Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Market Growth Rate <span className="text-xs text-gray-500">(%)</span>
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            name="marketGrowth"
                            value={formData.marketGrowth}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 5.5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Competition Level <span className="text-xs text-gray-500">(1-10)</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            name="competitionLevel"
                            value={formData.competitionLevel}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 7"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Retention Rate <span className="text-xs text-gray-500">(%)</span>
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            name="customerRetention"
                            value={formData.customerRetention}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 85"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Digital Presence <span className="text-xs text-gray-500">(1-10)</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            name="digitalPresence"
                            value={formData.digitalPresence}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 6"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Innovation Score <span className="text-xs text-gray-500">(1-10)</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            name="innovationScore"
                            value={formData.innovationScore}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 4"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      {/* Show Cancel button only when we have existing data (update mode) */}
                      {hasUserData && predictionData && (
                        <button
                          type="button"
                          onClick={handleCancelUpdate}
                          className="btn btn-secondary flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        disabled={predicting || !backendConnected}
                        className={`btn flex items-center ${!backendConnected ? 'btn-gray cursor-not-allowed' : 'btn-primary'}`}
                      >
                        {predicting ? (
                          <>
                            <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            {hasUserData && predictionData ? 'Update Prediction' : 'Predict Risk'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  ) : (
                    /* Bulk Upload Section */
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Data Upload</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload a CSV or Excel file with your business data. The file should contain columns for: 
                          revenue, expenses, cashflow, debt, assets, employees, years, industry, location, marketgrowth, competition, retention, digital, innovation.
                        </p>
                        <div className="mb-4">
                          <a 
                            href="/sample-business-data.csv" 
                            download="sample-business-data.csv"
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium inline-flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Sample CSV Template
                          </a>
                        </div>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 text-gray-400">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            
                            <div>
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <span className="text-blue-600 hover:text-blue-500 font-medium">
                                  Choose file
                                </span>
                                <span className="text-gray-600"> or drag and drop</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".csv,.xlsx,.xls"
                                  onChange={handleFileUpload}
                                />
                              </label>
                              <p className="text-xs text-gray-500 mt-1">CSV, XLS, XLSX up to 5MB</p>
                            </div>
                          </div>
                        </div>
                        
                        {uploadError && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{uploadError}</p>
                          </div>
                        )}
                        
                        {bulkFile && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm text-green-700 font-medium">{bulkFile.name}</span>
                                <span className="text-xs text-green-600 ml-2">({(bulkFile.size / 1024).toFixed(1)} KB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setBulkFile(null)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={handleBulkUpload}
                            disabled={!bulkFile || predicting || !backendConnected}
                            className={`btn flex items-center ${(!bulkFile || !backendConnected) ? 'btn-gray cursor-not-allowed' : 'btn-primary'}`}
                          >
                            {predicting ? (
                              <>
                                <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                </div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 7h6m0 0v6m0-6l-3 3" />
                                </svg>
                                Upload & Predict
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {riskData && (
            <>
              <motion.div variants={fadeIn} className="mt-6">
                <div className="card overflow-hidden">
                  <div className="p-0">
                    <div className={`px-6 py-5 bg-gradient-to-r ${getRiskGradient(riskData.riskScore)}`}>
                      <h2 className="text-xl font-bold text-white">Business Risk Assessment</h2>
                      <p className="text-sm text-white text-opacity-90">Based on your latest business data</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="relative mb-8 md:mb-0">
                          <div className="w-48 h-48 relative mx-auto">
                            {/* Risk score circle with gradient */}
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                              {/* Background circle */}
                              <circle 
                                className="text-gray-200" 
                                strokeWidth="8" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="42" 
                                cx="50" 
                                cy="50" 
                              />
                              {/* Animated progress circle */}
                              <motion.circle 
                                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                animate={{ 
                                  strokeDashoffset: 2 * Math.PI * 42 * (1 - riskData.riskScore / 100) 
                                }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={riskData.riskScore < 40 ? 'text-green-500' : riskData.riskScore < 70 ? 'text-yellow-500' : 'text-red-500'} 
                                strokeWidth="8" 
                                strokeLinecap="round" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="42" 
                                cx="50" 
                                cy="50" 
                                strokeDasharray={`${2 * Math.PI * 42}`}
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                            {/* Center text */}
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <motion.p 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-4xl font-bold"
                              >
                                {riskData.riskScore}%
                              </motion.p>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                                  riskData.riskScore < 40 
                                    ? 'bg-green-100 text-green-800' 
                                    : riskData.riskScore < 70 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {getRiskLevelText(riskData.riskScore)} Risk
                              </motion.div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:w-1/2">
                          <h3 className="text-md font-bold text-gray-900 mb-3">Risk Analysis</h3>
                          <p className="text-sm text-gray-600">
                            This assessment evaluates your business's survival risk based on multiple factors including financial health, market conditions, and operational efficiency.
                          </p>
                          
                          <div className={`mt-4 p-4 rounded-lg border border-l-4 ${
                            riskData.riskScore < 40 
                              ? 'border-green-400 bg-green-50' 
                              : riskData.riskScore < 70 
                                ? 'border-yellow-400 bg-yellow-50' 
                                : 'border-red-400 bg-red-50'
                          }`}>
                            {riskData.riskScore >= 70 ? (
                              <p className="text-red-800 font-medium">
                                Your business is at high risk. Immediate action is recommended to address critical areas.
                              </p>
                            ) : riskData.riskScore >= 40 ? (
                              <p className="text-yellow-800 font-medium">
                                Your business is at moderate risk. Consider addressing the key factors to improve stability.
                              </p>
                            ) : (
                              <p className="text-green-800 font-medium">
                                Your business is at low risk. Continue monitoring your metrics and making small improvements.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeIn} className="mt-8">
                <div className="card overflow-hidden">
                  <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <h2 className="text-xl font-bold text-white">Key Risk Factors</h2>
                    <p className="text-sm text-blue-100">
                      These factors are contributing to your overall risk score
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6">
                      {riskData.factors.map((factor, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div 
                                className={`w-2 h-8 rounded-full mr-3 bg-gradient-to-b ${getImpactSidebarColor(factor.impact)}`}
                                title={`${factor.impact} Impact Severity`}
                              ></div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{factor.name}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactBadgeStyle(factor.impact)}`}>
                                  {factor.impact} Impact
                                </span>
                              </div>
                            </div>
                            <span 
                              className="text-lg font-bold text-gray-900"
                              title="Percentage indicates magnitude, color indicates impact severity"
                            >
                              {Math.round(factor.score)}%
                            </span>
                          </div>
                          <div className="mt-1">
                            {renderFactorBar(factor.score, factor.impact)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Color Legend */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Color Guide</h4>
                        <p className="text-xs text-gray-500">Color denotes impact severity; % denotes magnitude</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#4CAF50' }}></div>
                          <span className="text-xs font-medium text-gray-700">Low Impact</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#FFA726' }}></div>
                          <span className="text-xs font-medium text-gray-700">Medium Impact</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#F44336' }}></div>
                          <span className="text-xs font-medium text-gray-700">High Impact</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeIn} 
                className="mt-8 flex flex-col sm:flex-row justify-between gap-4"
              >
                <motion.div whileHover={{ scale: 1.03 }}>
                  <button
                    onClick={handleUpdateDetails}
                    className="btn btn-secondary flex items-center w-full sm:w-auto justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Details
                  </button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Link
                    to="/recommendations"
                    className="btn btn-primary flex items-center w-full sm:w-auto justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View Recommendations
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RiskPredictionPage; 