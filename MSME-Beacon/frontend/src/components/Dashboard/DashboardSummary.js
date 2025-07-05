import React, { useState, useEffect } from 'react';

const DashboardSummary = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock dashboard data for demonstration
        const mockData = {
          prediction_count: 127,
          risk_distribution: {
            "Low Risk": 45,
            "Medium Risk": 58,
            "High Risk": 24
          },
          average_risk_score: 52,
          recent_predictions: [
            {
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              prediction: "Medium Risk",
              risk_score: 65,
              status: "Caution"
            },
            {
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              prediction: "Low Risk",
              risk_score: 28,
              status: "Safe"
            },
            {
              timestamp: new Date(Date.now() - 10800000).toISOString(),
              prediction: "High Risk",
              risk_score: 82,
              status: "Warning"
            },
            {
              timestamp: new Date(Date.now() - 14400000).toISOString(),
              prediction: "Medium Risk",
              risk_score: 48,
              status: "Caution"
            },
            {
              timestamp: new Date(Date.now() - 18000000).toISOString(),
              prediction: "Low Risk",
              risk_score: 31,
              status: "Safe"
            }
          ]
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setDashboardData(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { prediction_count, risk_distribution, average_risk_score, recent_predictions } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 bg-opacity-75">
              <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm font-medium">Total Predictions</h2>
              <p className="text-3xl font-bold text-gray-900">{prediction_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 bg-opacity-75">
              <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm font-medium">Low Risk</h2>
              <p className="text-3xl font-bold text-green-600">{risk_distribution["Low Risk"] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 bg-opacity-75">
              <svg className="h-8 w-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm font-medium">Medium Risk</h2>
              <p className="text-3xl font-bold text-yellow-600">{risk_distribution["Medium Risk"] || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 bg-opacity-75">
              <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-500 text-sm font-medium">High Risk</h2>
              <p className="text-3xl font-bold text-red-600">{risk_distribution["High Risk"] || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Score Gauge */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Average Risk Score</h2>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-40 h-40" viewBox="0 0 120 120">
              <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
              <circle
                className={`${average_risk_score < 30 ? 'text-green-500' : average_risk_score < 70 ? 'text-yellow-500' : 'text-red-500'}`}
                strokeWidth="10"
                strokeDasharray={`${average_risk_score * 3.14} ${314 - average_risk_score * 3.14}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="50"
                cx="60"
                cy="60"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{average_risk_score}</span>
              <span className="text-sm text-gray-500">Risk Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Predictions */}
      {recent_predictions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Predictions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prediction
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recent_predictions.map((prediction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(prediction.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${prediction.prediction === 'Low Risk' ? 'bg-green-100 text-green-800' : 
                          prediction.prediction === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {prediction.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prediction.risk_score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prediction.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSummary; 