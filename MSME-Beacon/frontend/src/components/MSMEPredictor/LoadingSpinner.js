import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      <p className="mt-4 text-sm text-gray-600">Processing data...</p>
    </div>
  );
};

export default LoadingSpinner; 