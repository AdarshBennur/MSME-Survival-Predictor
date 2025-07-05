import React, { useState } from 'react';
import IndustryTypeInput from './IndustryTypeInput';

const IndustryTypeInputTest = () => {
  const [testValue, setTestValue] = useState('');

  const handleChange = (e) => {
    setTestValue(e.target.value);
    console.log('Value changed to:', e.target.value);
  };

  // Test scenarios simulating CSV values
  const testScenarios = [
    { label: 'Empty value', value: '' },
    { label: 'Dropdown match (lowercase)', value: 'retail' },
    { label: 'Dropdown match (capitalized)', value: 'Technology' },
    { label: 'Dropdown match (mixed case)', value: 'HeAlThCaRe' },
    { label: 'Custom value', value: 'Biotech Startup' },
    { label: 'Unknown (default CSV)', value: 'Unknown' },
    { label: 'Spaces around', value: '  finance  ' },
    { label: 'Special industry', value: 'AI/ML Research' },
  ];

  const loadTestValue = (value) => {
    setTestValue(value);
    console.log('Loading test value:', value);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">IndustryTypeInput CSV Test</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Test CSV Values</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {testScenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => loadTestValue(scenario.value)}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors"
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">IndustryTypeInput Component</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Industry Type (Simulating CSV Upload)
          </label>
          <IndustryTypeInput
            name="industryType"
            value={testValue}
            onChange={handleChange}
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
              'other'
            ]}
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-800 mb-2">Current State:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Value: <span className="font-mono bg-white px-2 py-1 rounded">{testValue || '(empty)'}</span></div>
          <div>Type: <span className="font-mono bg-white px-2 py-1 rounded">{typeof testValue}</span></div>
          <div>Length: <span className="font-mono bg-white px-2 py-1 rounded">{testValue.length}</span></div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-md">
        <h4 className="font-medium text-yellow-800 mb-2">Expected Behavior:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Dropdown values (retail, technology, etc.) should show in dropdown mode</li>
          <li>• Case variations should still match dropdown options</li>
          <li>• Custom values (Biotech Startup, Unknown, etc.) should show in manual mode</li>
          <li>• Empty values should show dropdown with "Select Industry"</li>
          <li>• Switching between modes should preserve the current value</li>
        </ul>
      </div>
    </div>
  );
};

export default IndustryTypeInputTest; 