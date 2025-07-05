import React, { useState } from 'react';
import IndustryTypeInput from './IndustryTypeInput';

const IndustryTypeInputExample = () => {
  const [basicIndustry, setBasicIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [requiredIndustry, setRequiredIndustry] = useState('');

  const handleBasicChange = (e) => {
    setBasicIndustry(e.target.value);
  };

  const handleCustomChange = (e) => {
    setCustomIndustry(e.target.value);
  };

  const handleRequiredChange = (e) => {
    setRequiredIndustry(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', {
      basicIndustry,
      customIndustry,
      requiredIndustry
    });
    alert(`Selected industries:\n- Basic: ${basicIndustry}\n- Custom: ${customIndustry}\n- Required: ${requiredIndustry}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">IndustryTypeInput Examples</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Example */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Usage</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Industry Type
            </label>
            <IndustryTypeInput
              name="basicIndustry"
              value={basicIndustry}
              onChange={handleBasicChange}
            />
          </div>
        </div>

        {/* Custom Options Example */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Custom Industry Options</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Sector
            </label>
            <IndustryTypeInput
              name="customIndustry"
              value={customIndustry}
              onChange={handleCustomChange}
              industryOptions={[
                'fintech',
                'biotech',
                'edtech',
                'cleantech',
                'gaming',
                'blockchain',
                'ai/ml',
                'robotics',
                'space tech',
                'cybersecurity'
              ]}
            />
          </div>
        </div>

        {/* Required Field Example */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Required Field</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primary Industry * 
              <span className="text-xs text-gray-500">(Required)</span>
            </label>
            <IndustryTypeInput
              name="requiredIndustry"
              value={requiredIndustry}
              onChange={handleRequiredChange}
              required={true}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Form
          </button>
        </div>

        {/* Current Values Display */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">Current Values:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Basic Industry: <span className="font-mono">{basicIndustry || 'empty'}</span></div>
            <div>Custom Industry: <span className="font-mono">{customIndustry || 'empty'}</span></div>
            <div>Required Industry: <span className="font-mono">{requiredIndustry || 'empty'}</span></div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default IndustryTypeInputExample; 