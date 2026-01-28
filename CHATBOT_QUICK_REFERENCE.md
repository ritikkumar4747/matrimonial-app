# 🤖 MatrioMoney Chatbot - Quick Reference

## 🚀 Quick Start (5 minutes)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Test
Open http://localhost:5173 → Click 💬 button → Chat!

---

## 📍 Access Points

1. **Floating Button** 💬 (Bottom-right, all pages)
2. **Footer** (Contact section → "Live Chat")
3. **Everywhere** (Global availability)

---

## 💬 Popular Chatbot Queries

### Profile Help
- "How do I improve my profile?"
- "What's a good bio?"
- "Profile tips"

### Communication
- "How do I send a first message?"
- "How to talk to someone?"
- "Communication tips"

### Relationships
- "What are red flags?"
- "What are green flags?"
- "How to know they're right?"

### Safety
- "How to stay safe?"
- "Scam prevention"
- "Safety tips"

### Support
- "How to contact support?"
- "contact"

### General
- "hello" (shows all options)
- "help"
- "What can you help with?"

---

## 📁 Key Files

### Backend
```
backend/
├── controllers/chatbotController.js  ← Knowledge base
├── routes/chatbotRoutes.js          ← API endpoints
└── server.js                         ← Added routes
```

### Frontend
```
frontend/src/
├── components/
│   ├── Chatbot.jsx                  ← Chat modal
│   ├── FloatingChatButton.jsx        ← Float button
│   └── Footer.jsx                   ← Updated
├── pages/Home.jsx                    ← Updated
└── App.jsx                           ← Global setup
```

---

## 🔧 API Endpoints

### Get Greeting
```bash
curl http://localhost:5000/api/chatbot/greeting
```

### Send Message
```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

---

## 📊 Knowledge Base Topics

| Topic | Keywords |
|-------|----------|
| Profile | profile, improve, bio, picture |
| Message | first, icebreaker, opening |
| RedFlags | red, warning, toxic |
| GreenFlags | positive, good, healthy |
| Talk | communication, discuss, argue |
| Marriage | marriage, wedding, commitment |
| Rejection | reject, breakup, heartbreak |
| Match | compatible, chemistry, score |
| Safe | safe, scam, fraud, catfish |
| Help | contact, support, help |
| Premium | premium, cost, subscription |
| Love | love, romantic, propose |
| Family | family, parents, in-law |
| Kids | children, kids, parenting |

---

## ✨ Features

✅ 12+ knowledge categories  
✅ 50+ trigger keywords  
✅ Real-time responses  
✅ Smooth animations  
✅ Mobile responsive  
✅ 24/7 availability  
✅ Natural delays (200-600ms)  
✅ Typing indicators  
✅ Message timestamps  
✅ Error handling  

---

## 🧪 Testing

### Test All Endpoints
```bash
node chatbot-api-test.js
```

### Manual Test
1. Open http://localhost:5173
2. Click 💬 in bottom-right
3. Type: "hello"
4. See response options

---

## 🐛 Troubleshooting

### Chatbot not showing?
- Is backend running? (port 5000)
- Is frontend running? (port 5173)
- Clear cache (Ctrl+Shift+Delete)

### No response?
- Check backend console
- Verify message not empty
- Try: `curl http://localhost:5000` (should say "API Running")

### Styling wrong?
- Rebuild: `npm run build`
- Clear cache
- Restart dev server

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| CHATBOT_README.md | Complete guide |
| CHATBOT_SETUP.md | Setup & testing |
| IMPLEMENTATION_SUMMARY.md | This file |
| chatbot-api-test.js | API tests |

---

## 🎨 Customization

### Add New Topic
Edit: `backend/controllers/chatbotController.js`

```javascript
newTopic: {
  triggers: ['word1', 'word2'],
  response: `Your response...`
}
```

Restart backend → Done!

---

## 🚀 Deployment

### Before Deploy
- Update CORS origin in `server.js`
- Build frontend: `npm run build`
- Test thoroughly
- Set environment variables

### Environment Variables
```
BACKEND_PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

## 📞 Support Channels in Chatbot

- **Email:** support@matriomoney.com
- **Phone:** +1 (800) MATRIO-1
- **Chat:** Available 24/7
- **Address:** San Francisco, CA

---

## 🎯 Next Steps

1. ✅ Test chatbot thoroughly
2. ⬜ Gather user feedback
3. ⬜ Add more topics if needed
4. ⬜ Consider AI integration
5. ⬜ Set up analytics
6. ⬜ Plan human support integration

---

## 💡 Pro Tips

- Type "hello" to see all options
- Bot understands partial matches
- Check footer for contact info
- Floating button always available
- Works on mobile too!

---

## 📊 Architecture at a Glance

```
User Input
    ↓
React Component (Chatbot.jsx)
    ↓
Axios API Call → /api/chatbot/message
    ↓
Express Backend (chatbotController.js)
    ↓
Knowledge Base Search
    ↓
Find Match → Response
    ↓
Return JSON → Frontend
    ↓
Display in Chat Modal
    ↓
User sees response
```

---

## 🔐 Security Notes

✅ No authentication required (public API)  
✅ Basic input validation (non-empty)  
✅ Error handling in place  
✅ CORS enabled for frontend  
✅ No sensitive data stored  

---

## 📈 Metrics

- **Response Time:** 200-600ms
- **Knowledge Base:** 12+ categories
- **Trigger Words:** 50+
- **Components:** 3 new
- **Lines of Code:** 800+

---

## 🎓 Learn More

- See `CHATBOT_README.md` for full API docs
- See `CHATBOT_SETUP.md` for detailed setup
- Check inline code comments
- Review test file: `chatbot-api-test.js`

---

## ✅ Verification Checklist

Before going live:
- [ ] Backend starts without errors
- [ ] Frontend loads
- [ ] Floating button visible
- [ ] Can click and open chatbot
- [ ] Can type and send message
- [ ] Bot responds appropriately
- [ ] Mobile responsive
- [ ] Animations smooth
- [ ] Works with Firefox/Chrome/Safari

---

**Version:** 1.0.0  
**Status:** ✅ Ready to Use  
**Date:** January 28, 2026  

Good luck! 🎉
