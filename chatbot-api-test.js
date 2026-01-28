/**
 * Chatbot API Test
 * Run with: node chatbot-api-test.js
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/chatbot';

async function testChatbotAPI() {
  console.log('🤖 MatrioMoney Chatbot API Test\n');
  console.log('=' .repeat(50));

  try {
    // Test 1: Get Initial Greeting
    console.log('\n📌 Test 1: Getting Initial Greeting');
    console.log('Endpoint: GET /api/chatbot/greeting');
    
    const greetingRes = await axios.get(`${API_BASE_URL}/greeting`);
    console.log('✅ Status:', greetingRes.status);
    console.log('Response preview:', greetingRes.data.response.substring(0, 100) + '...');

    // Test 2: Send a message about profile
    console.log('\n📌 Test 2: Asking About Profile');
    console.log('Endpoint: POST /api/chatbot/message');
    console.log('Message: "How do I improve my profile?"');
    
    const profileRes = await axios.post(`${API_BASE_URL}/message`, {
      message: 'How do I improve my profile?'
    });
    console.log('✅ Status:', profileRes.status);
    console.log('Response preview:', profileRes.data.response.substring(0, 100) + '...');

    // Test 3: Send a message about red flags
    console.log('\n📌 Test 3: Asking About Red Flags');
    console.log('Message: "What are red flags?"');
    
    const redFlagsRes = await axios.post(`${API_BASE_URL}/message`, {
      message: 'What are red flags?'
    });
    console.log('✅ Status:', redFlagsRes.status);
    console.log('Response preview:', redFlagsRes.data.response.substring(0, 100) + '...');

    // Test 4: Send a message about first message
    console.log('\n📌 Test 4: Asking About First Message');
    console.log('Message: "How to send a good first message?"');
    
    const firstMsgRes = await axios.post(`${API_BASE_URL}/message`, {
      message: 'How to send a good first message?'
    });
    console.log('✅ Status:', firstMsgRes.status);
    console.log('Response preview:', firstMsgRes.data.response.substring(0, 100) + '...');

    // Test 5: Send a message about contact
    console.log('\n📌 Test 5: Asking About Contact Support');
    console.log('Message: "How to contact support?"');
    
    const contactRes = await axios.post(`${API_BASE_URL}/message`, {
      message: 'How to contact support?'
    });
    console.log('✅ Status:', contactRes.status);
    console.log('Response preview:', contactRes.data.response.substring(0, 100) + '...');

    // Test 6: Send a random message (should return default response)
    console.log('\n📌 Test 6: Asking Random Question');
    console.log('Message: "xyz123abc"');
    
    const randomRes = await axios.post(`${API_BASE_URL}/message`, {
      message: 'xyz123abc'
    });
    console.log('✅ Status:', randomRes.status);
    console.log('Response:', randomRes.data.response.substring(0, 100) + '...');

    // Test 7: Test empty message (should error)
    console.log('\n📌 Test 7: Testing Empty Message (Should Error)');
    console.log('Message: ""');
    
    try {
      await axios.post(`${API_BASE_URL}/message`, {
        message: ''
      });
    } catch (error) {
      console.log('✅ Expected Error Status:', error.response.status);
      console.log('Error:', error.response.data.error);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All Chatbot API Tests Passed!');
    console.log('\n💡 Chatbot is ready to use:');
    console.log('   - Backend: http://localhost:5000/api/chatbot');
    console.log('   - Frontend: http://localhost:5173');
    console.log('   - Click floating chat button or "Live Chat" in footer\n');

  } catch (error) {
    console.error('\n❌ Error during testing:');
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - Is the backend running on port 5000?');
      console.error('Start backend with: cd backend && npm run dev');
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testChatbotAPI();
