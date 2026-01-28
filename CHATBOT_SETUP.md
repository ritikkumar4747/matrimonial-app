# Chatbot Setup & Testing Guide

## Quick Start

### 1. Backend Setup

The chatbot API is already integrated into the backend. Just ensure the backend is running:

```bash
cd backend
npm install  # If not already installed
npm run dev  # Start backend with nodemon
```

Backend will run on: `http://localhost:5000`

### 2. Frontend Setup

The chatbot components are already integrated into the frontend. Just run:

```bash
cd frontend
npm install  # If not already installed
npm run dev  # Start frontend with Vite
```

Frontend will run on: `http://localhost:5173`

### 3. Test the Chatbot

#### Option A: Manual Testing
1. Open `http://localhost:5173` in browser
2. Look for floating chat button (💬) in bottom-right corner
3. Click to open chatbot
4. Type a question like:
   - "hello"
   - "How do I improve my profile?"
   - "What are red flags?"
   - "Tell me about safety"
   - "How to contact support"

#### Option B: API Testing
```bash
# In project root directory
node chatbot-api-test.js
```

This will run comprehensive tests on all chatbot endpoints.

#### Option C: Manual cURL Commands
```bash
# Get initial greeting
curl http://localhost:5000/api/chatbot/greeting

# Send a message
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I improve my profile?"}'
```

## File Structure

### Backend Files Created/Modified
```
backend/
├── controllers/
│   └── chatbotController.js      (NEW) - Chatbot logic and knowledge base
├── routes/
│   └── chatbotRoutes.js          (NEW) - API endpoints
└── server.js                      (MODIFIED) - Added chatbot routes
```

### Frontend Files Created/Modified
```
frontend/src/
├── components/
│   ├── Chatbot.jsx               (NEW) - Main chatbot modal component
│   ├── FloatingChatButton.jsx    (NEW) - Floating chat button
│   └── Footer.jsx                (MODIFIED) - Added Live Chat integration
├── pages/
│   └── Home.jsx                  (MODIFIED) - Added chatbot state
└── App.jsx                        (MODIFIED) - Global chatbot integration
```

## Features Implemented

### ✅ Chatbot Functionality
- 💬 Real-time chat interface
- 🤖 Knowledge base with 12+ topics
- ⏱️ Natural response delays
- 🎨 Beautiful gradient UI
- 📱 Responsive design
- ✨ Smooth animations (Framer Motion)
- 🔄 Auto-scroll to latest messages
- ⏳ Loading indicators with typing animation

### ✅ Access Points
1. **Footer Live Chat Button** - In contact section
2. **Floating Chat Button** - Available on all pages
3. **Automatic Availability** - 24/7 access

### ✅ Topics Covered
- Profile improvement
- First messages
- Communication tips
- Red flags & green flags
- Marriage & relationships
- Handling rejection
- Compatibility
- Dating safety
- Premium features
- Customer support
- And more...

## Chatbot Topics & Keywords

The chatbot recognizes these trigger words:

| Topic | Keywords |
|-------|----------|
| Greetings | hello, hi, hey, start, help |
| Profile | profile, improve, bio, picture |
| First Message | first message, icebreaker, opening line |
| Red Flags | red flag, toxic, dangerous, avoid |
| Green Flags | positive, healthy, trustworthy |
| Communication | talk, discuss, conflict, argue |
| Marriage | marriage, wedding, commitment, shaadi |
| Rejection | rejection, ghosted, breakup, heartbreak |
| Compatibility | compatible, chemistry, match score |
| Safety | safe, scam, fraud, catfish |
| Contact | contact, support, help, problem |
| Premium | premium, paid, subscription, cost |
| Engagement | love, romantic, propose |
| Family | family, parents, in-law, tradition |
| Children | children, kids, parenting, baby |

Type any of these words or phrases to get relevant responses!

## Customizing Chatbot Responses

To add new topics to the chatbot:

### Step 1: Edit Backend Knowledge Base
File: `backend/controllers/chatbotController.js`

```javascript
const knowledgeBase = {
  // ... existing topics
  
  newTopic: {
    triggers: ['keyword1', 'keyword2', 'keyword3'],
    response: `Your detailed response here...
    
Can use multiple lines
And emojis 🎉`
  }
};
```

### Step 2: Restart Backend
```bash
# Backend will auto-reload with nodemon
# Or manually restart: Ctrl+C, then npm run dev
```

### Step 3: Test in Frontend
Open chatbot and type any trigger keyword to test!

## Troubleshooting

### Problem: "Chatbot button not visible"
**Solution:**
- Check if frontend is running on port 5173
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)

### Problem: "No response from chatbot"
**Solution:**
1. Check if backend is running:
   ```bash
   curl http://localhost:5000
   # Should return: "API Running"
   ```
2. Check network tab in DevTools (F12)
3. Verify message is not empty
4. Check backend console for errors

### Problem: "API connection refused"
**Solution:**
1. Start backend: `cd backend && npm run dev`
2. Ensure port 5000 is not in use
3. Check CORS settings in `server.js`

### Problem: "Styling looks wrong"
**Solution:**
1. Rebuild frontend: `npm run build`
2. Clear cache: `npm run dev` starts fresh
3. Check Tailwind CSS is compiled

## Performance Tips

1. **Optimize Knowledge Base:** Keep responses concise but helpful
2. **Lazy Load:** Chatbot only loads when needed
3. **API Caching:** Consider caching frequent responses (future enhancement)
4. **Monitor Performance:** Check network timing in DevTools

## Future Enhancements

- [ ] AI integration (OpenAI/Claude)
- [ ] Chat history in database
- [ ] Multi-language support
- [ ] Human handoff to support team
- [ ] User feedback rating
- [ ] Analytics dashboard
- [ ] Sentiment analysis
- [ ] Export conversations

## Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Floating chat button visible
- [ ] Can open chatbot modal
- [ ] Can type and send messages
- [ ] Bot responds to queries
- [ ] Greeting shows on open
- [ ] Can close chatbot
- [ ] Works on mobile
- [ ] Footer Live Chat button works
- [ ] Responsive design works

## API Documentation

### Endpoints

**GET /api/chatbot/greeting**
- Get initial greeting message
- No authentication required
- Returns: `{ success, response, timestamp }`

**POST /api/chatbot/message**
- Send message to chatbot
- No authentication required
- Body: `{ message: "user input" }`
- Returns: `{ success, response, timestamp }`

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review browser console errors (F12)
3. Check backend server logs
4. Verify both servers are running
5. Try test API command: `node chatbot-api-test.js`

## Success Indicators

✅ You'll know it's working when:
- Floating chat button appears in bottom-right
- Clicking it opens a beautiful chat modal
- Typing a message and hitting send shows a response
- The chatbot remembers conversation context
- Response appears with proper formatting
- All animations are smooth and responsive

## Contact

For chatbot-specific questions:
- Check [CHATBOT_README.md](./CHATBOT_README.md) for detailed docs
- Review chatbot API test: `chatbot-api-test.js`
- Check implementation files directly

---

**Status:** ✅ Ready to Use
**Last Updated:** January 28, 2026
**Version:** 1.0.0
