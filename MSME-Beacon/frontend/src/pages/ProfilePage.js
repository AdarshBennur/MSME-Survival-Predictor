import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import IndustryTypeInput from '../components/IndustryTypeInput';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(() => {
    // Start with false if we have user data in localStorage
    const storedUser = localStorage.getItem('user');
    return !storedUser;
  });
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    businessName: '',
    businessType: '',
    businessLocation: '',
    businessSize: '',
    registrationDate: '',
    lastLogin: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    businessName: '',
    businessType: '',
    businessLocation: '',
    businessSize: '',
    registrationDate: '',
    lastLogin: ''
  });
  
  // Fetch actual user data from backend
  useEffect(() => {
    let mounted = true;
    
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          if (mounted) {
            navigate('/login');
          }
          return;
        }

        // First load from localStorage immediately to prevent flickering
        const storedUser = localStorage.getItem('user');
        if (storedUser && mounted) {
          const userData = JSON.parse(storedUser);
          const profileData = {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            role: userData.role || 'Business Owner',
            businessName: userData.businessName || '',
            businessType: userData.businessType || '',
            businessLocation: userData.location || userData.businessLocation || '',
            businessSize: userData.businessSize || '',
            registrationDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '',
            lastLogin: 'Today'
          };
          setUser(profileData);
          setFormData(profileData);
          setLoading(false); // Stop loading immediately when we have localStorage data
        }

        // Then try to fetch from backend with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        try {
          const response = await fetch('http://localhost:5001/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (mounted && response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              const profileData = {
                name: data.data.personalInfo?.fullName || '',
                email: data.data.personalInfo?.email || '',
                phone: data.data.personalInfo?.phone || '',
                role: data.data.personalInfo?.role || 'Business Owner',
                businessName: data.data.businessInfo?.businessName || '',
                businessType: data.data.businessInfo?.businessType || '',
                businessLocation: data.data.businessInfo?.businessLocation || '',
                businessSize: data.data.businessInfo?.businessSize || '',
                registrationDate: data.data.createdAt ? new Date(data.data.createdAt).toLocaleDateString() : '',
                lastLogin: 'Today'
              };
              setUser(profileData);
              setFormData(profileData);
              
              // Update localStorage with latest data
              localStorage.setItem('user', JSON.stringify(profileData));
            }
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.log('Backend not available, using localStorage data');
          // If we already have localStorage data, don't show error
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in profile setup:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
    
    return () => {
      mounted = false;
    };
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Updating user profile...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again');
        navigate('/login');
        return;
      }

      const profileUpdateData = {
        personalInfo: {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role
        },
        businessInfo: {
          businessName: formData.businessName,
          businessType: formData.businessType,
          businessLocation: formData.businessLocation,
          businessSize: formData.businessSize
        }
      };

      const response = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileUpdateData)
      });

      const data = await response.json();

      if (data.success) {
        // Update local storage with new user data
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...storedUser, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update the user state with form data
        setUser({...formData});
        setEditMode(false);
        
        // Show success notification
        alert('Profile updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  
  const handleCancel = () => {
    setFormData({...user});
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      

      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                    <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Premium Header */}
              <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Personal Information
                    </h2>
                    <p className="text-slate-200 mt-1">Manage your personal and contact details</p>
                  </div>
                  {!editMode && (
                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              
              {editMode ? (
                <div className="p-8">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      {/* Email */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Enter your email address"
                        />
                      </div>
                      
                      {/* Phone */}
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      
                      {/* Role */}
                      <div className="space-y-2">
                        <label htmlFor="role" className="block text-sm font-semibold text-gray-700">Role</label>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option>Business Owner</option>
                          <option>Manager</option>
                          <option>Administrator</option>
                          <option>Financial Advisor</option>
                        </select>
                      </div>
                      
                      {/* Business Name */}
                      <div className="space-y-2">
                        <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700">Business Name</label>
                        <input
                          type="text"
                          name="businessName"
                          id="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Enter your business name"
                        />
                      </div>
                      
                      {/* Business Type */}
                      <div className="space-y-2">
                        <label htmlFor="businessType" className="block text-sm font-semibold text-gray-700">Business Type</label>
                        <IndustryTypeInput
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleChange}
                          className="[&>select]:w-full [&>select]:px-4 [&>select]:py-3 [&>select]:bg-gray-50 [&>select]:border [&>select]:border-gray-200 [&>select]:rounded-xl [&>select]:focus:ring-2 [&>select]:focus:ring-blue-500 [&>select]:focus:border-transparent [&>select]:text-gray-900 [&>input]:w-full [&>input]:px-4 [&>input]:py-3 [&>input]:bg-gray-50 [&>input]:border [&>input]:border-gray-200 [&>input]:rounded-xl [&>input]:focus:ring-2 [&>input]:focus:ring-blue-500 [&>input]:focus:border-transparent [&>input]:text-gray-900"
                          industryOptions={[
                            'retail',
                            'manufacturing',
                            'services',
                            'technology',
                            'food & beverage',
                            'construction',
                            'consulting',
                            'healthcare',
                            'finance',
                            'education',
                            'hospitality',
                            'agriculture',
                            'transportation',
                            'real estate',
                            'e-commerce',
                            'logistics',
                            'marketing',
                            'software',
                            'other'
                          ]}
                        />
                      </div>
                      
                      {/* Business Location */}
                      <div className="space-y-2">
                        <label htmlFor="businessLocation" className="block text-sm font-semibold text-gray-700">Business Location</label>
                        <input
                          type="text"
                          name="businessLocation"
                          id="businessLocation"
                          value={formData.businessLocation}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Enter your business location"
                        />
                      </div>
                      
                      {/* Business Size */}
                      <div className="space-y-2">
                        <label htmlFor="businessSize" className="block text-sm font-semibold text-gray-700">Business Size</label>
                        <select
                          id="businessSize"
                          name="businessSize"
                          value={formData.businessSize}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option>Micro (1-9 employees)</option>
                          <option>Small (10-49 employees)</option>
                          <option>Medium (50-249 employees)</option>
                          <option>Large (250+ employees)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border border-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Info Items */}
                    {[
                      { label: 'Full Name', value: user.name, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                      { label: 'Email Address', value: user.email, icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                      { label: 'Phone Number', value: user.phone, icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                      { label: 'Role', value: user.role, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                      { label: 'Business Name', value: user.businessName, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                      { label: 'Business Type', value: user.businessType, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                      { label: 'Business Location', value: user.businessLocation, icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
                      { label: 'Business Size', value: user.businessSize, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                    ].map((item, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{item.value || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Account Stats */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700">Registration Date</p>
                          <p className="text-xl font-bold text-green-900">{user.registrationDate || 'Not available'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-700">Last Login</p>
                          <p className="text-xl font-bold text-purple-900">{user.lastLogin}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Account Actions Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  Security & Account Actions
                </h2>
                <p className="text-slate-200 mt-1">Manage your account security and settings</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Change Password */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300 group">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-blue-900 mb-2">Change Password</h3>
                      <p className="text-sm text-blue-700 mb-4">Update your account password for better security</p>
                      <button
                        type="button"
                        onClick={() => alert('Change password dialog would open here')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                  
                  {/* Two-Factor Authentication */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300 group">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-green-900 mb-2">Two-Factor Auth</h3>
                      <p className="text-sm text-green-700 mb-4">Add an extra layer of security to your account</p>
                      <button
                        type="button"
                        onClick={() => alert('Two-factor authentication setup would start here')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                  
                  {/* Delete Account */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-2xl border border-red-100 hover:shadow-lg transition-all duration-300 group md:col-span-2 lg:col-span-1">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-700 mb-4">Permanently remove your account and all data</p>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                            alert('Account deletion process would start here');
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 