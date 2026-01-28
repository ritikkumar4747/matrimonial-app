# API Testing Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📝 AUTH ENDPOINTS

### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 👤 PROFILE ENDPOINTS

### 3. Get My Profile
```http
GET /profile/me
Authorization: Bearer YOUR_TOKEN
```

### 4. Update Profile
```http
PUT /profile/update
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "gender": "male",
  "dob": "1995-05-15",
  "religion": "Hindu",
  "education": "Bachelor's",
  "profession": "Software Engineer",
  "city": "Mumbai",
  "state": "Maharashtra",
  "about": "Looking for a life partner...",
  "height": "5'10\"",
  "maritalStatus": "never married",
  "diet": "vegetarian",
  "smoking": "no",
  "drinking": "occasionally",
  "income": "5-10 LPA",
  "hobbies": ["reading", "traveling", "music"],
  "partnerPreferences": {
    "ageRange": { "min": 24, "max": 30 },
    "religion": ["Hindu"],
    "education": ["Bachelor's", "Master's"],
    "city": ["Mumbai", "Pune"]
  }
}
```

### 5. Upload Profile Photo
```http
POST /profile/photo
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

FormData:
  photo: [FILE]
```

### 6. Get All Profiles (With Filters)
```http
GET /profile/all?gender=female&religion=Hindu&city=Mumbai&minAge=24&maxAge=30&sortBy=matchScore&page=1&limit=20
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `gender` - male, female
- `religion` - Hindu, Muslim, Christian, Sikh, etc.
- `city` - City name
- `state` - State name
- `education` - High School, Bachelor's, Master's, PhD
- `profession` - Engineer, Doctor, etc.
- `minAge` - Minimum age (number)
- `maxAge` - Maximum age (number)
- `maritalStatus` - never married, divorced, widowed
- `diet` - vegetarian, non-vegetarian, eggetarian
- `sortBy` - matchScore, recent, views
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

### 7. Search Users
```http
GET /profile/search?query=engineer&gender=female
Authorization: Bearer YOUR_TOKEN
```

### 8. Get Recommended Matches
```http
GET /profile/recommended
Authorization: Bearer YOUR_TOKEN
```
Returns top 20 matches based on your partner preferences

### 9. View Specific User Profile
```http
GET /profile/USER_ID
Authorization: Bearer YOUR_TOKEN
```
Auto-tracks that you viewed this profile

### 10. Get Profile Viewers
```http
GET /profile/viewers
Authorization: Bearer YOUR_TOKEN
```
Shows who viewed your profile (last 50)

### 11. Get Profile Statistics
```http
GET /profile/stats
Authorization: Bearer YOUR_TOKEN

Response:
{
  "totalViews": 45,
  "uniqueViewers": 32,
  "profileViews": 45,
  "profileCompleteness": 85
}
```

---

## 💕 INTEREST ENDPOINTS

### 12. Send Interest
```http
POST /interest/send
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "toUserId": "USER_ID"
}
```

### 13. Get Received Interests
```http
GET /interest/received
Authorization: Bearer YOUR_TOKEN
```

### 14. Get Sent Interests
```http
GET /interest/sent
Authorization: Bearer YOUR_TOKEN
```

### 15. Update Interest Status
```http
PUT /interest/INTEREST_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "accepted"
}
```
Status: "accepted" or "rejected"

### 16. Get Mutual Matches
```http
GET /interest/mutual
Authorization: Bearer YOUR_TOKEN
```
Returns users where interest is mutually accepted

---

## 💬 CHAT ENDPOINTS

### 17. Get Messages with User
```http
GET /chat/USER_ID
Authorization: Bearer YOUR_TOKEN
```

### 18. Send Message
```http
POST /chat/send
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "receiver": "USER_ID",
  "text": "Hello! How are you?"
}
```

---

## 🧪 POSTMAN COLLECTION

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Matrimonial API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 🔍 TESTING WORKFLOW

### Step 1: Register & Login
1. Register a new user
2. Login and copy the token
3. Set token in Authorization header for all requests

### Step 2: Setup Profile
1. Update profile with complete details
2. Upload profile photo
3. Check profile stats

### Step 3: Browse Profiles
1. Get all profiles
2. Apply filters
3. Search users
4. Get recommendations

### Step 4: Interact
1. View other user profiles
2. Send interests
3. Check received interests
4. Accept/reject interests

### Step 5: Chat
1. Get mutual matches
2. Send messages
3. Receive messages (Socket.IO)

---

## 🐛 COMMON ERRORS

### 401 Unauthorized
- Token missing or invalid
- Token expired (7 days)
- User not found

### 400 Bad Request
- Missing required fields
- Invalid data format
- Already sent interest

### 404 Not Found
- User not found
- Interest not found

### 500 Server Error
- Database connection issue
- Check MongoDB connection
- Check server logs

---

## 💡 TIPS

1. **Use environment variables** in Postman for `baseUrl` and `token`
2. **Test pagination** - try different page numbers and limits
3. **Test edge cases** - empty filters, invalid IDs, etc.
4. **Test match scores** - compare different user profiles
5. **Monitor console logs** - check server.js console output
6. **Use Postman Collections** - save and organize requests

---

## 🚀 PRODUCTION TESTING

When deployed, update `baseUrl` to:
```
https://your-domain.com/api
```

And update CORS in server.js:
```javascript
cors({
  origin: "https://your-frontend-domain.com",
  credentials: true
})
```
