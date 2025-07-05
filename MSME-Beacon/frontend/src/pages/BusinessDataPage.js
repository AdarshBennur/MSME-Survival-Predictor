import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { motion } from 'framer-motion';

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

const BusinessDataPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthlySales: '',
    stockValue: '',
    customerCount: '',
    expenses: '',
    profit: '',
    employeeCount: '',
    avgTransactionValue: '',
    returnRate: '',
    marketingSpend: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'bulk'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFileUpload(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Form validation - ensure numeric values
      const numberFields = ['monthlySales', 'stockValue', 'customerCount', 'expenses', 
                            'profit', 'employeeCount', 'avgTransactionValue', 'returnRate', 'marketingSpend'];
      
      for (const field of numberFields) {
        if (formData[field] && isNaN(parseFloat(formData[field]))) {
          throw new Error(`${field} must be a number`);
        }
      }

      // Save business data to backend
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in again');
        navigate('/login');
        return;
      }

      const dashboardData = {
        businessMetrics: {
          revenue: parseFloat(formData.monthlySales) || 0,
          expenses: parseFloat(formData.expenses) || 0,
          profit: parseFloat(formData.profit) || 0,
          cashFlow: (parseFloat(formData.monthlySales) || 0) - (parseFloat(formData.expenses) || 0),
          assets: parseFloat(formData.stockValue) || 0,
          debt: 0, // Can be added to form later
          employeeCount: parseFloat(formData.employeeCount) || 1,
          yearsInBusiness: 1 // Can be added to form later
        },
        kpis: {
          monthlySales: parseFloat(formData.monthlySales) || 0,
          customerCount: parseFloat(formData.customerCount) || 0,
          avgTransactionValue: parseFloat(formData.avgTransactionValue) || 0,
          returnRate: parseFloat(formData.returnRate) || 0,
          marketingSpend: parseFloat(formData.marketingSpend) || 0,
          stockValue: parseFloat(formData.stockValue) || 0
        },
        financialData: {
          currentAssets: parseFloat(formData.stockValue) || 0,
          currentLiabilities: 0,
          totalEquity: 0,
          workingCapital: (parseFloat(formData.stockValue) || 0) - 0
        }
      };

      const response = await fetch('http://localhost:5001/api/dashboard', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dashboardData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Business data updated successfully!');
        // Wait a bit then redirect to risk prediction
        setTimeout(() => {
          navigate('/risk-prediction');
        }, 1500);
      } else {
        throw new Error(data.message || 'Failed to save business data');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error('Error submitting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!fileUpload) {
      setMessage('Please select a file to upload');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // In a real app, this would upload the file to your backend
      console.log('Uploading file:', fileUpload.name);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage('File uploaded successfully! Processing data...');
      // Simulate processing delay
      setTimeout(() => {
        navigate('/risk-prediction');
      }, 2000);
    } catch (error) {
      setMessage(`Error uploading file: ${error.message}`);
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold gradient-heading">Business Data Input</h1>
            <p className="mt-2 text-gray-600">
              Provide your business metrics to get a comprehensive risk assessment and personalized recommendations.
            </p>
          </motion.div>
          
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.includes('Error') ? (
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Tab Navigation */}
          <motion.div variants={fadeIn} className="mb-6">
            <div className="flex border-b border-gray-200">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className={`py-3 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'manual'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('manual')}
              >
                Manual Input
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className={`py-3 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'bulk'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('bulk')}
              >
                Bulk Upload
              </motion.button>
            </div>
          </motion.div>

          {/* Manual Input Form */}
          {activeTab === 'manual' && (
            <motion.div
              variants={fadeIn}
              className="card mb-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Manual Data Entry</h2>
              <p className="text-gray-600 mb-6">
                Enter your business metrics below to get an accurate risk assessment.
              </p>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="monthlySales" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Sales ($)
                  </label>
                  <input
                    type="text"
                    name="monthlySales"
                    id="monthlySales"
                    placeholder="e.g. 50000"
                    className="input"
                    value={formData.monthlySales}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="stockValue" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Value ($)
                  </label>
                  <input
                    type="text"
                    name="stockValue"
                    id="stockValue"
                    placeholder="e.g. 75000"
                    className="input"
                    value={formData.stockValue}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="customerCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Customers
                  </label>
                  <input
                    type="text"
                    name="customerCount"
                    id="customerCount"
                    placeholder="e.g. 200"
                    className="input"
                    value={formData.customerCount}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="expenses" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Expenses ($)
                  </label>
                  <input
                    type="text"
                    name="expenses"
                    id="expenses"
                    placeholder="e.g. 35000"
                    className="input"
                    value={formData.expenses}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="profit" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Profit ($)
                  </label>
                  <input
                    type="text"
                    name="profit"
                    id="profit"
                    placeholder="e.g. 15000"
                    className="input"
                    value={formData.profit}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Employees
                  </label>
                  <input
                    type="text"
                    name="employeeCount"
                    id="employeeCount"
                    placeholder="e.g. 10"
                    className="input"
                    value={formData.employeeCount}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="avgTransactionValue" className="block text-sm font-medium text-gray-700 mb-1">
                    Average Transaction Value ($)
                  </label>
                  <input
                    type="text"
                    name="avgTransactionValue"
                    id="avgTransactionValue"
                    placeholder="e.g. 125"
                    className="input"
                    value={formData.avgTransactionValue}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="returnRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Return Rate (%)
                  </label>
                  <input
                    type="text"
                    name="returnRate"
                    id="returnRate"
                    placeholder="e.g. 2.5"
                    className="input"
                    value={formData.returnRate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="marketingSpend" className="block text-sm font-medium text-gray-700 mb-1">
                    Marketing Spend ($)
                  </label>
                  <input
                    type="text"
                    name="marketingSpend"
                    id="marketingSpend"
                    placeholder="e.g. 5000"
                    className="input"
                    value={formData.marketingSpend}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Submit Data'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* Bulk Upload Form */}
          {activeTab === 'bulk' && (
            <motion.div
              variants={fadeIn}
              className="card mb-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Bulk Upload</h2>
              <p className="text-gray-600 mb-6">
                Upload a CSV or Excel file with your business data for faster processing.
              </p>
              
              <form onSubmit={handleFileSubmit}>
                <div className="mb-6">
                  <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                    File Upload
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Choose a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            accept=".csv,.xlsx,.xls" 
                            className="sr-only" 
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV, Excel (.xlsx, .xls) up to 10MB
                      </p>
                    </div>
                  </div>
                  {fileUpload && (
                    <p className="mt-2 text-sm text-blue-600">
                      Selected file: {fileUpload.name} ({(fileUpload.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !fileUpload}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      'Upload File'
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="ml-4 btn btn-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('In a real app, this would download a template file');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Template
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* Help Section */}
          <motion.div variants={fadeIn} className="card bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Why is this information needed?</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>These business metrics help our AI model analyze your business's financial health and risk factors. The more accurate and complete your data is, the more precise our risk assessment and recommendations will be.</p>
                  <p className="mt-2">All your data is securely encrypted and never shared with third parties. Read our <a href="#" className="text-blue-600 hover:text-blue-800">privacy policy</a> for more details.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessDataPage; 