// Test Script to verify backend functionality
// Run: node test-api.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';

// Helper function
const log = (title, data) => {
  console.log('\n' + '='.repeat(50));
  console.log(title);
  console.log('='.repeat(50));
  console.log(JSON.stringify(data, null, 2));
};

async function testAPI() {
  try {
    // 1. Register User
    console.log('\n🔵 Testing User Registration...');
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    log('✅ Register Response', registerRes.data);

    // 2. Login
    console.log('\n🔵 Testing User Login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerRes.data.email || `test${Date.now()}@example.com`,
      password: 'password123'
    });
    authToken = loginRes.data.token;
    userId = loginRes.data.user.id;
    log('✅ Login Response', loginRes.data);

    // Set auth header for subsequent requests
    const config = {
      headers: { Authorization: `Bearer ${authToken}` }
    };

    // 3. Get My Profile
    console.log('\n🔵 Testing Get My Profile...');
    const myProfileRes = await axios.get(`${BASE_URL}/profile/me`, config);
    log('✅ My Profile', myProfileRes.data);

    // 4. Update Profile
    console.log('\n🔵 Testing Profile Update...');
    const updateRes = await axios.put(
      `${BASE_URL}/profile/update`,
      {
        gender: 'male',
        dob: '1995-05-15',
        religion: 'Hindu',
        education: "Bachelor's",
        profession: 'Software Engineer',
        city: 'Mumbai',
        state: 'Maharashtra',
        height: "5'10\"",
        maritalStatus: 'never married',
        diet: 'vegetarian',
        about: 'Looking for a life partner',
        hobbies: ['reading', 'traveling'],
        partnerPreferences: {
          ageRange: { min: 24, max: 30 },
          religion: ['Hindu'],
          city: ['Mumbai', 'Pune']
        }
      },
      config
    );
    log('✅ Updated Profile', updateRes.data);

    // 5. Get All Profiles
    console.log('\n🔵 Testing Get All Profiles...');
    const allProfilesRes = await axios.get(
      `${BASE_URL}/profile/all?sortBy=matchScore&limit=5`,
      config
    );
    log('✅ All Profiles', {
      totalUsers: allProfilesRes.data.totalUsers,
      currentPage: allProfilesRes.data.currentPage,
      usersReturned: allProfilesRes.data.users?.length || 0
    });

    // 6. Search Users
    console.log('\n🔵 Testing Search Users...');
    const searchRes = await axios.get(
      `${BASE_URL}/profile/search?query=engineer`,
      config
    );
    log('✅ Search Results', {
      resultsFound: searchRes.data.length
    });

    // 7. Get Recommended Matches
    console.log('\n🔵 Testing Recommended Matches...');
    const recommendedRes = await axios.get(
      `${BASE_URL}/profile/recommended`,
      config
    );
    log('✅ Recommended Matches', {
      matchesFound: recommendedRes.data.length
    });

    // 8. Get Profile Stats
    console.log('\n🔵 Testing Profile Stats...');
    const statsRes = await axios.get(`${BASE_URL}/profile/stats`, config);
    log('✅ Profile Statistics', statsRes.data);

    // 9. Get Received Interests
    console.log('\n🔵 Testing Get Received Interests...');
    const receivedRes = await axios.get(`${BASE_URL}/interest/received`, config);
    log('✅ Received Interests', {
      count: receivedRes.data.length
    });

    // 10. Get Sent Interests
    console.log('\n🔵 Testing Get Sent Interests...');
    const sentRes = await axios.get(`${BASE_URL}/interest/sent`, config);
    log('✅ Sent Interests', {
      count: sentRes.data.length
    });

    // 11. Get Mutual Matches
    console.log('\n🔵 Testing Mutual Matches...');
    const mutualRes = await axios.get(`${BASE_URL}/interest/mutual`, config);
    log('✅ Mutual Matches', {
      count: mutualRes.data.length
    });

    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(50));
    console.log('\n✅ Backend is working correctly!');
    console.log('✅ All endpoints are functional');
    console.log('✅ Authentication is working');
    console.log('✅ Match scoring is active');
    console.log('\n💡 Your auth token:', authToken);

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error('Error:', error.response?.data || error.message);
    console.error('\nStack:', error.stack);
  }
}

// Run tests
console.log('🚀 Starting API Tests...');
console.log('Make sure server is running on http://localhost:5000');
testAPI();
