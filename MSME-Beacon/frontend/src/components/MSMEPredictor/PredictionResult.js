import React from 'react';

const PredictionResult = ({ prediction }) => {
  if (!prediction) {
    return null;
  }

  if (prediction.error) {
    return (
      <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{prediction.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { prediction: riskCategory, status, confidence, risk_score, key_factors } = prediction;
  const isLowRisk = riskCategory === "Low Risk";
  const isHighRisk = riskCategory === "High Risk";
  const isMediumRisk = riskCategory === "Medium Risk";
  
  // Set colors based on risk level
  const getBgColor = () => {
    if (isLowRisk) return 'bg-green-50';
    if (isMediumRisk) return 'bg-yellow-50';
    return 'bg-red-50';
  };
  
  const getIconBgColor = () => {
    if (isLowRisk) return 'bg-green-200';
    if (isMediumRisk) return 'bg-yellow-200';
    return 'bg-red-200';
  };
  
  const getIconColor = () => {
    if (isLowRisk) return 'text-green-600';
    if (isMediumRisk) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getTextColor = () => {
    if (isLowRisk) return 'text-green-800';
    if (isMediumRisk) return 'text-yellow-800';
    return 'text-red-800';
  };
  
  const getBarColor = () => {
    if (isLowRisk) return 'bg-green-600';
    if (isMediumRisk) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="mt-6">
      <div className={`rounded-md shadow overflow-hidden`}>
        <div className={`p-4 ${getBgColor()}`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-full p-1 ${getIconBgColor()}`}>
              {isLowRisk ? (
                <svg className={`h-6 w-6 ${getIconColor()}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : isHighRisk ? (
                <svg className={`h-6 w-6 ${getIconColor()}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className={`h-6 w-6 ${getIconColor()}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-lg font-medium ${getTextColor()}`}>
                {riskCategory}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Risk Score</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex items-center">
                  <span className="mr-2">{risk_score}</span>
                  <div className="relative w-full max-w-xl h-2 bg-gray-200 rounded">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded ${getBarColor()}`} 
                      style={{ width: `${risk_score}%` }}
                    ></div>
                  </div>
                </div>
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Confidence</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex items-center">
                  <span className="mr-2">{(confidence * 100).toFixed(1)}%</span>
                  <div className="relative w-full max-w-xl h-2 bg-gray-200 rounded">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded ${getBarColor()}`} 
                      style={{ width: `${confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 font-medium">
                {status}
              </dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Key Risk Factors</dt>
              <dd className="mt-1 text-sm">
                {key_factors && key_factors.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {key_factors.map((factor, index) => (
                      <li key={index} className="text-gray-700">
                        {factor.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No specific risk factors identified</p>
                )}
              </dd>
            </div>
          </dl>
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className={`rounded-md ${getBgColor()} p-4`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg 
                    className={`h-5 w-5 ${getIconColor()}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className={`text-sm ${getTextColor()}`}>
                    {isLowRisk
                      ? 'Your business shows strong indicators of survival and growth potential.'
                      : isHighRisk
                      ? 'Your business is at high risk. Immediate action is recommended.'
                      : 'Your business requires attention in some areas to improve stability.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult; 