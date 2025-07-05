import React, { useState, useRef } from 'react';

const BulkUpload = ({ setLoading, setBulkPredictions }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Check if file is CSV
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setFile(null);
      return;
    }
    
    setError(null);
    setFile(selectedFile);
  };

  const processCsvData = async (text) => {
    const rows = text.split('\n').filter(row => row.trim());
    
    if (rows.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row');
    }
    
    // Parse CSV headers (case insensitive)
    const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
    const dataRows = rows.slice(1);
    
    const results = [];
    
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i].split(',').map(cell => cell.trim());
      
      if (row.length < headers.length) {
        console.warn(`Row ${i + 2} has fewer columns than headers, skipping`);
        continue;
      }
      
      try {
        // Map CSV data to our format with proper validation
        const businessData = {
          revenue: parseFloat(row[headers.indexOf('revenue')] || row[0]) || 0,
          expenses: parseFloat(row[headers.indexOf('expenses')] || row[1]) || 0,
          cashFlow: parseFloat(row[headers.indexOf('cashflow')] || row[2]) || 0,
          debt: parseFloat(row[headers.indexOf('debt')] || row[3]) || 0,
          assets: parseFloat(row[headers.indexOf('assets')] || row[4]) || 0,
          employeeCount: parseInt(row[headers.indexOf('employees')] || row[5]) || 0,
          yearsInBusiness: parseInt(row[headers.indexOf('years')] || row[6]) || 0,
          industryType: row[headers.indexOf('industry')] || 'Unknown',
          location: row[headers.indexOf('location')] || 'Unknown',
          marketGrowth: parseFloat(row[headers.indexOf('marketgrowth')] || row[7]) || 0,
          competitionLevel: parseInt(row[headers.indexOf('competition')] || row[8]) || 5,
          customerRetention: parseFloat(row[headers.indexOf('retention')] || row[9]) || 0,
          digitalPresence: parseInt(row[headers.indexOf('digital')] || row[10]) || 5,
          innovationScore: parseInt(row[headers.indexOf('innovation')] || row[11]) || 5,
        };

        // Validate essential fields
        if (!businessData.revenue || !businessData.expenses || !businessData.employeeCount || !businessData.yearsInBusiness) {
          console.warn(`Row ${i + 2} missing essential data, skipping`);
          continue;
        }
        
        // Call prediction API for each row
        const response = await fetch('http://localhost:5001/api/risk/predict-demo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(businessData)
        });
        
        if (!response.ok) {
          throw new Error(`API request failed for row ${i + 2}: ${response.statusText}`);
        }
        
        const prediction = await response.json();
        
        results.push({
          rowNumber: i + 2,
          businessData,
          prediction: {
            score: prediction.score,
            riskLevel: prediction.riskLevel || prediction.category,
            category: prediction.category || prediction.riskLevel,
            lastUpdated: prediction.lastUpdated
          }
        });
        
      } catch (rowError) {
        console.error(`Error processing row ${i + 2}:`, rowError);
        results.push({
          rowNumber: i + 2,
          error: `Failed to process: ${rowError.message}`
        });
      }
    }
    
    return results;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Read file content
      const text = await file.text();
      const results = await processCsvData(text);
      
      setBulkPredictions(results);
      
      const successCount = results.filter(r => !r.error).length;
      const errorCount = results.filter(r => r.error).length;
      
      if (errorCount > 0) {
        setError(`Processed ${successCount} records successfully, ${errorCount} records failed`);
      }
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(`Failed to process file: ${error.message}`);
      setBulkPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFile(null);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
        <div className="text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48" 
            aria-hidden="true"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>

          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Upload a <span className="font-medium text-indigo-600">CSV file</span> containing multiple company records
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Required columns: revenue, expenses, cashflow, debt, assets, employees, years, industry, location, marketgrowth, competition, retention, digital, innovation
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
              Select File
            </label>
          </div>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between p-2 bg-indigo-50 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-indigo-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-indigo-700 truncate">{file.name}</span>
            </div>
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-800"
              onClick={resetFileInput}
            >
              Remove
            </button>
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!file}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            file ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          Upload and Predict
        </button>
      </div>
    </form>
  );
};

export default BulkUpload; 