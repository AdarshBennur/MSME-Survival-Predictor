const axios = require('axios');

console.log('🧪 Testing MSME Beacon Backend Setup...\n');

const testBackend = async () => {
  try {
    console.log('1️⃣ Testing backend connectivity...');
    const response = await axios.get('http://localhost:5001/api/test', {
      timeout: 5000
    });
    
    console.log('✅ Backend Response:', response.data);
    console.log(`✅ Backend is running on port 5001`);
    
    // Test risk prediction endpoint
    console.log('\n2️⃣ Testing risk prediction endpoint...');
    const testData = {
      revenue: 50000,
      expenses: 40000,
      cashFlow: 800,
      totalDebt: 100000,
      totalAssets: 25000,
      employeeCount: 40,
      yearsInBusiness: 2,
      industryType: 'Manufacturing',
      location: 'new york',
      marketGrowthRate: 3,
      competitionLevel: 3,
      customerRetentionRate: 33,
      digitalPresenceScore: 7,
      innovationScore: 6
    };
    
    const predictionResponse = await axios.post('http://localhost:5001/api/risk/predict-demo', testData, {
      timeout: 10000
    });
    
    console.log('✅ Prediction Test Response:', predictionResponse.data);
    
    console.log('\n🎉 ALL TESTS PASSED! Backend is working perfectly.');
    console.log('🌐 You can now open http://localhost:3000/risk-prediction');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🚨 Backend is not running!');
      console.log('💡 Please run: npm run backend-only');
    } else if (error.response) {
      console.log('🚨 Backend error:', error.response.data);
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure you\'re in the project root directory');
    console.log('2. Run: npm run install-all');
    console.log('3. Run: npm run backend-only');
    console.log('4. Wait for "Ready to receive requests!" message');
    console.log('5. Run this test again: node test_fixed_setup.js');
  }
};

testBackend(); 