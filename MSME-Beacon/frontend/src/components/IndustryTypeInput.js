import React, { useState, useEffect } from 'react';

const IndustryTypeInput = ({ 
  value, 
  onChange, 
  name = "industryType",
  required = false,
  className = "",
  industryOptions = [
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
  ]
}) => {
  // Helper function to check if value matches any dropdown option (case-insensitive)
  const isDropdownOption = (val) => {
    if (!val) return false;
    return industryOptions.some(option => 
      option.toLowerCase().trim() === val.toString().toLowerCase().trim()
    );
  };

  // Helper function to find the matching option with correct case
  const findMatchingOption = (val) => {
    if (!val) return '';
    const match = industryOptions.find(option => 
      option.toLowerCase().trim() === val.toString().toLowerCase().trim()
    );
    return match || val;
  };

  // Determine initial mode based on the value
  const getInitialMode = () => {
    if (!value || value === '') return 'dropdown';
    const trimmedValue = value.toString().trim();
    return isDropdownOption(trimmedValue) ? 'dropdown' : 'manual';
  };

  const [inputMode, setInputMode] = useState(getInitialMode());
  const [manualValue, setManualValue] = useState(
    value && !isDropdownOption(value) ? value.toString() : ''
  );

  // Update component state when value prop changes (e.g., from CSV upload)
  useEffect(() => {
    if (value === undefined || value === null || value === '') {
      setInputMode('dropdown');
      setManualValue('');
      return;
    }

    const trimmedValue = value.toString().trim();
    
    // If value is 'Unknown' or doesn't match dropdown options, show manual input
    if (trimmedValue && !isDropdownOption(trimmedValue)) {
      setInputMode('manual');
      setManualValue(trimmedValue);
    } else if (isDropdownOption(trimmedValue)) {
      setInputMode('dropdown');
      setManualValue('');
    }
  }, [value, industryOptions]);

  // Handle dropdown selection
  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    onChange({
      target: {
        name: name,
        value: selectedValue
      }
    });
  };

  // Handle manual input
  const handleManualChange = (e) => {
    const manualInput = e.target.value;
    onChange({
      target: {
        name: name,
        value: manualInput
      }
    });
  };

  // Switch to manual input mode
  const switchToManual = () => {
    setInputMode('manual');
    setManualValue(value || '');
    // Keep the current value when switching to manual
  };

  // Switch back to dropdown mode
  const switchToDropdown = () => {
    setInputMode('dropdown');
    setManualValue('');
    // Clear the value when switching back to dropdown
    onChange({
      target: {
        name: name,
        value: ''
      }
    });
  };

  const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className={`space-y-2 ${className}`}>
      {inputMode === 'dropdown' ? (
        <>
          {/* Dropdown Mode */}
          <select
            name={name}
            value={findMatchingOption(value) || ''}
            onChange={handleDropdownChange}
            required={required}
            className={baseInputClasses}
          >
            <option value="">Select Industry</option>
            {industryOptions.map((industry, index) => (
              <option key={index} value={industry}>
                {industry.charAt(0).toUpperCase() + industry.slice(1)}
              </option>
            ))}
          </select>
          
          {/* Switch to manual link */}
          <button
            type="button"
            onClick={switchToManual}
            className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
          >
            Can't find it? Enter manually
          </button>
        </>
      ) : (
        <>
          {/* Manual Input Mode */}
          <input
            type="text"
            name={name}
            value={value || ''}
            onChange={handleManualChange}
            placeholder="Enter your industry type"
            required={required}
            className={baseInputClasses}
          />
          
          {/* Switch back to dropdown link */}
          <button
            type="button"
            onClick={switchToDropdown}
            className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1 flex items-center"
          >
            <svg 
              className="w-3 h-3 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Choose from dropdown instead
          </button>
        </>
      )}
    </div>
  );
};

export default IndustryTypeInput; 