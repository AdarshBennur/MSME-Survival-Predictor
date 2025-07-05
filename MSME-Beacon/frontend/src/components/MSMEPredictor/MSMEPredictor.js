import React, { useState } from 'react';
import PredictorForm from './PredictorForm';
import BulkUpload from './BulkUpload';
import PredictionResult from './PredictionResult';
import BulkPredictionResults from './BulkPredictionResults';
import LoadingSpinner from './LoadingSpinner';

const MSMEPredictor = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [bulkPredictions, setBulkPredictions] = useState([]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">MSME Survival Predictor</h3>
        <p className="mt-1 text-sm text-gray-500">
          Predict if a business will survive or fail based on key metrics
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('manual')}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'manual'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'bulk'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bulk Upload
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="px-4 py-5 sm:p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {activeTab === 'manual' ? (
              <>
                <PredictorForm 
                  setLoading={setLoading} 
                  setPrediction={setPrediction} 
                />
                <PredictionResult prediction={prediction} />
              </>
            ) : (
              <>
                <BulkUpload 
                  setLoading={setLoading} 
                  setBulkPredictions={setBulkPredictions} 
                />
                <BulkPredictionResults predictions={bulkPredictions} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MSMEPredictor; 