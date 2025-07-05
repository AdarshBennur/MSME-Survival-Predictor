import React from 'react';

const BulkPredictionResults = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return null;
  }

  // Filter out error entries for statistics
  const validPredictions = predictions.filter(p => !p.error);
  const errorEntries = predictions.filter(p => p.error);
  
  if (validPredictions.length === 0) {
    return (
      <div className="mt-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Processing Failed</h3>
          <p className="text-red-600">No valid predictions could be generated from the uploaded file.</p>
          {errorEntries.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                {errorEntries.map((entry, index) => (
                  <li key={index}>Row {entry.rowNumber}: {entry.error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const total = validPredictions.length;
  const lowRisk = validPredictions.filter(p => {
    const riskLevel = p.prediction?.riskLevel || p.prediction?.category || '';
    return riskLevel.toLowerCase().includes('low');
  }).length;
  const mediumRisk = validPredictions.filter(p => {
    const riskLevel = p.prediction?.riskLevel || p.prediction?.category || '';
    return riskLevel.toLowerCase().includes('medium') || riskLevel.toLowerCase().includes('moderate');
  }).length;
  const highRisk = validPredictions.filter(p => {
    const riskLevel = p.prediction?.riskLevel || p.prediction?.category || '';
    return riskLevel.toLowerCase().includes('high');
  }).length;
  const healthRate = total > 0 ? (lowRisk / total) * 100 : 0;

  const getRiskColor = (riskLevel) => {
    const level = (riskLevel || '').toLowerCase();
    if (level.includes('low')) return 'green';
    if (level.includes('medium') || level.includes('moderate')) return 'yellow';
    if (level.includes('high')) return 'red';
    return 'gray';
  };

  return (
    <div className="mt-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-indigo-50">
          <h3 className="text-lg leading-6 font-medium text-indigo-900">
            Bulk Prediction Results
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-indigo-600">
            Showing predictions for {total} businesses
            {errorEntries.length > 0 && ` (${errorEntries.length} rows had errors)`}
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="bg-green-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-green-900">Low Risk</h4>
                  <p className="mt-1 text-2xl font-semibold text-green-700">{lowRisk}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-yellow-900">Medium Risk</h4>
                  <p className="mt-1 text-2xl font-semibold text-yellow-700">{mediumRisk}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-red-900">High Risk</h4>
                  <p className="mt-1 text-2xl font-semibold text-red-700">{highRisk}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-blue-900">Health Rate</h4>
                <p className="mt-1 text-2xl font-semibold text-blue-700">{healthRate.toFixed(1)}%</p>
              </div>
              <div className="ml-auto">
                <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600" 
                    style={{ width: `${healthRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {errorEntries.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-4 bg-red-50">
            <h4 className="text-sm font-medium text-red-800 mb-2">Processing Errors ({errorEntries.length})</h4>
            <div className="text-xs text-red-600 max-h-32 overflow-y-auto">
              {errorEntries.map((entry, index) => (
                <div key={index} className="mb-1">
                  Row {entry.rowNumber}: {entry.error}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Row
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.map((entry, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.rowNumber}
                  </td>
                  
                  {entry.error ? (
                    <>
                      <td colSpan="4" className="px-6 py-4 text-sm text-red-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {entry.error}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${getRiskColor(entry.prediction?.riskLevel || entry.prediction?.category) === 'green' ? 'bg-green-100 text-green-800' : 
                            getRiskColor(entry.prediction?.riskLevel || entry.prediction?.category) === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                            getRiskColor(entry.prediction?.riskLevel || entry.prediction?.category) === 'red' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {entry.prediction?.riskLevel || entry.prediction?.category || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.prediction?.score || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          <div>Revenue: ${entry.businessData?.revenue?.toLocaleString() || 'N/A'}</div>
                          <div>Employees: {entry.businessData?.employeeCount || 'N/A'}</div>
                          <div>Industry: {entry.businessData?.industryType || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            getRiskColor(entry.prediction?.riskLevel || entry.prediction?.category) === 'green' ? 'bg-green-500' : 
                            getRiskColor(entry.prediction?.riskLevel || entry.prediction?.category) === 'yellow' ? 'bg-yellow-500' : 
                            getRiskColor(entry.prediction?.riskLevel || entry.prediction?.category) === 'red' ? 'bg-red-500' : 
                            'bg-gray-500'
                          }`} />
                          <span className="text-xs text-gray-600">
                            {new Date(entry.prediction?.lastUpdated || Date.now()).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkPredictionResults; 