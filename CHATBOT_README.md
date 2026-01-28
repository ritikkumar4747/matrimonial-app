# MatrioMoney Chatbot Integration Guide

## Overview
A comprehensive AI-powered chatbot has been integrated into MatrioMoney to help users with queries about marriage, love life, dating tips, and relationships. The chatbot is available 24/7 through:
1. **Footer** - Click "Live Chat" button in the contact section
2. **Floating Button** - Accessible from every page via the bottom-right chat button
3. **Global Access** - Works across all pages (home, dashboard, profiles, etc.)

## Features

### Chatbot Capabilities
The chatbot provides helpful information and advice on:

- **💑 Finding the Right Partner** - Tips on what to look for
- **🎯 Profile Improvement** - How to create an attractive profile
- **💬 Communication Tips** - How to start conversations and communicate effectively
- **🚩 Red Flags** - Warning signs to watch out for
- **✅ Green Flags** - Positive signs in relationships
- **💍 Marriage & Commitment** - Preparation for marriage, family planning
- **💔 Dealing with Rejection** - How to cope with heartbreak
- **🤝 Healthy Relationships** - Building strong, lasting connections
- **🔒 Safety Tips** - Dating safety and scam prevention
- **📱 Platform Features** - How to use MatrioMoney features
- **💎 Premium Membership** - Details about premium benefits
- **📞 Support Contact** - Ways to reach customer support

### User Interface
- **Beautiful Modal Design** - Modern, gradient-based chat window
- **Real-time Messages** - Instant responses from the chatbot
- **Smooth Animations** - Framer Motion animations for smooth interactions
- **Typing Indicators** - Shows when bot is "typing"
- **Message Timestamps** - Track conversation time
- **Responsive Design** - Works on mobile, tablet, and desktop

## Backend Implementation

### Chatbot Controller
**File:** `backend/controllers/chatbotController.js`

#### Key Functions:
1. **getChatbotResponse()**
   - Processes user messages
   - Matches queries against knowledge base
   - Returns appropriate responses
   - Simulates natural response delay (200-600ms)

2. **getInitialGreeting()**
   - Provides welcome message when chatbot opens
   - Sets conversational tone

#### Knowledge Base Structure
The chatbot uses a comprehensive knowledge base with categories:
```javascript
{
  greetings: { triggers: [...], response: "..." },
  profile: { triggers: [...], response: "..." },
  firstMessage: { triggers: [...], response: "..." },
  redFlags: { triggers: [...], response: "..." },
  greenFlags: { triggers: [...], response: "..." },
  // ... more categories
}
```

### API Endpoints

#### 1. Get Initial Greeting
```
GET /api/chatbot/greeting
```
**Response:**
```json
{
  "success": true,
  "response": "Welcome message...",
  "timestamp": "2026-01-28T..."
}
```

#### 2. Send Message to Chatbot
```
POST /api/chatbot/message
Content-Type: application/json

{
  "message": "How do I improve my profile?"
}
```
**Response:**
```json
{
  "success": true,
  "response": "Here are tips to improve your profile...",
  "timestamp": "2026-01-28T..."
}
```

## Frontend Implementation

### Components

#### 1. Chatbot Component
**File:** `frontend/src/components/Chatbot.jsx`

Features:
- Modal dialog with gradient header
- Message history display
- Auto-scroll to latest messages
- Loading states with typing indicators
- Input field with send button
- Help text with example queries
- Responsive design

#### 2. FloatingChatButton Component
**File:** `frontend/src/components/FloatingChatButton.jsx`

Features:
- Fixed position button in bottom-right corner
- Animated pulse indicator (shows availability)
- Hover effects with scale animation
- Smooth entry/exit animations
- Available on all pages

#### 3. Updated Footer
**File:** `frontend/src/components/Footer.jsx`

Changes:
- Added `onOpenChatbot` prop
- "Live Chat" button now opens chatbot modal
- Enhanced contact section with clickable buttons

### Pages & Routing

#### Home Page
**File:** `frontend/src/pages/Home.jsx`

Added:
- Chatbot state management
- Pass `onOpenChatbot` prop to Footer
- Chatbot modal integration

#### App.jsx
**File:** `frontend/src/App.jsx`

Changes:
- Global chatbot state management
- FloatingChatButton component available everywhere
- Chatbot modal accessible from all routes

## How to Use

### For Users
1. **Access Chatbot:**
   - Click "Live Chat" in footer's contact section, OR
   - Click the floating chat button (💬) in bottom-right corner

2. **Ask Questions:**
   - Type your question in the input field
   - Press Enter or click send button
   - Get instant response from the chatbot

3. **Example Queries:**
   - "How do I improve my profile?"
   - "What are red flags in relationships?"
   - "How do I send a good first message?"
   - "What is live chat?"
   - "Contact support"
   - Type "hello" for full options

### For Developers

#### Adding New Topics
To add new chatbot responses, edit `backend/controllers/chatbotController.js`:

```javascript
const knowledgeBase = {
  // ... existing categories
  newTopic: {
    triggers: ['keyword1', 'keyword2', 'keyword3'],
    response: `Your response here...`
  }
};
```

#### Testing
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:5173`
4. Click floating chat button or "Live Chat" in footer

## Integration Points

### Backend
- Added `chatbotRoutes.js` to handle chatbot endpoints
- Registered routes in `server.js`
- Chatbot controller implements knowledge base logic

### Frontend
- Created `Chatbot.jsx` for modal interface
- Created `FloatingChatButton.jsx` for global access
- Updated `Footer.jsx` for Live Chat functionality
- Updated `App.jsx` for global chatbot state
- Updated `Home.jsx` for local chatbot instance

## Technical Stack

### Backend
- **Framework:** Express.js
- **Language:** JavaScript (ES6+)
- **Routing:** Express Router

### Frontend
- **Framework:** React 18
- **Animation:** Framer Motion
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

## Performance Considerations

1. **Response Time:** Knowledge base lookups are O(n) where n is number of categories
2. **Memory:** Chatbot stores conversation history in component state
3. **Network:** API calls are simple POST/GET with minimal payload
4. **Animations:** Framer Motion optimizes performance with GPU acceleration

## Future Enhancements

1. **Database Integration:** Store chat history in MongoDB
2. **AI Integration:** Connect to OpenAI/Claude API for dynamic responses
3. **Analytics:** Track common questions and user satisfaction
4. **Multi-language:** Support multiple languages
5. **Context Awareness:** Remember user context across sessions
6. **Smart Routing:** Auto-connect to human support when needed
7. **Chat Export:** Allow users to download conversation
8. **Sentiment Analysis:** Detect user mood and adjust responses

## Troubleshooting

### Chatbot Not Opening
- Check browser console for errors
- Ensure backend is running on port 5000
- Verify CORS settings in `server.js`

### No Response from Chatbot
- Backend might be down - check `/api` health
- Check network tab in browser dev tools
- Ensure message is not empty

### Styling Issues
- Clear browser cache
- Rebuild frontend: `npm run build`
- Check Tailwind CSS configuration

## API Testing

Use these curl commands to test the chatbot API:

```bash
# Get greeting
curl http://localhost:5000/api/chatbot/greeting

# Send message
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I improve my profile?"}'
```

## Support

For issues or questions about the chatbot:
1. Contact: support@matriomoney.com
2. Phone: +1 (800) MATRIO-1
3. Live Chat: Available 24/7 (accessible through the chatbot itself!)

---

**Last Updated:** January 28, 2026
**Version:** 1.0.0
