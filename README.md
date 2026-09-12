# 💍 Matrimonial — Modern Matchmaking Platform
> **Tagline:** *Rabb Ne Bana Di Jodi — A Match Made in Heaven*

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101.svg?logo=socket.io&logoColor=white)](https://socket.io/)
[![WebRTC](https://img.shields.io/badge/WebRTC-P2P%20Calling-333333.svg?logo=webrtc&logoColor=white)](https://webrtc.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20CDN-3448C5.svg?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black.svg?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7.svg?logo=render&logoColor=white)](https://render.com/)

A modern, full-stack matrimonial and matchmaking platform built for authentic connections and lifelong companionship. Designed with a **React 18 / Vite / Tailwind CSS** frontend and an **Express / Node.js / MongoDB / Socket.io / WebRTC** backend.

---

## 🌐 Live Deployments

| Component | Platform | Live URL |
| :--- | :--- | :--- |
| **Frontend Application** | Vercel (Edge SPA) | [https://matrimonialapp.vercel.app](https://matrimonialapp.vercel.app) |
| **Backend API & WebSockets** | Render (Web Service) | [https://matrimonial-app-pu7b.onrender.com](https://matrimonial-app-pu7b.onrender.com) |
| **Source Code** | GitHub | [https://github.com/ritikkumar4747/matrimonial-app](https://github.com/ritikkumar4747/matrimonial-app) |

---

## 🏛️ System Architecture

The application is structured into four decoupled layers for high availability, security, and low-latency communication:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Browser)                        │
│   • React 18 SPA (Vite)    • Tailwind CSS & Framer Motion Animations    │
│   • WebRTC Media Engine    • Socket.io Client (Real-Time Messaging)     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / WSS
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      APPLICATION & SIGNALING LAYER                      │
│                 Node.js + Express REST API (Hosted on Render)           │
│                                                                         │
│   [Auth Controller]   [Profile Engine]   [Interest Matcher]  [Chat API] │
│   [Story Service]     [Badges / Streak]  [Cloudinary Upload] [WebRTC]   │
│   ───────────────────────────────────────────────────────────────────   │
│   • JWT Auth Guard Middleware           • CORS Policy Engine            │
│   • Socket.io WebSocket Hub (Signaling: offer, answer, ice candidate)   │
└──────────────┬─────────────────────────┬────────────────────────┬───────┘
               │                         │                        │
               ▼                         ▼                        ▼
┌───────────────────────────┐ ┌───────────────────────┐ ┌─────────────────┐
│       DATABASE LAYER      │ │      MEDIA LAYER      │ │   P2P CALLING   │
│       MongoDB Atlas       │ │     Cloudinary CDN    │ │  Google STUN    │
│  • Users & Profiles       │ │  • Profile Photos     │ │  (NAT Traversal │
│  • Interests & Matches    │ │  • Mutual Galleries   │ │   Peer-to-Peer  │
│  • Messages & History     │ │  • 24h Ephemeral      │ │   Media Stream) │
│  • 24h TTL Stories        │ │    Media Delivery     │ │                 │
└───────────────────────────┘ └───────────────────────┘ └─────────────────┘
```

---

## 🔄 Matchmaking & Calling Flow

Here is how the end-to-end user lifecycle works in simple steps:

```
  [ 1. REGISTER / LOGIN ]
            │
            ▼
  [ 2. COMPLETE PROFILE ] ──▶ Set religion, caste, city, age, lifestyle & preferences
            │
            ▼
  [ 3. DISCOVER MATCHES ] ──▶ Multi-filter search & deterministic compatibility score (0-100%)
            │
            ▼
  [ 4. EXPRESS INTEREST ] ──▶ User A clicks "Send Interest" (Status: Pending)
            │
            ▼
  [ 5. MUTUAL ACCEPTANCE] ──▶ User B accepts interest ──▶ Unlocks "Mutual Matches" feed
            │
            ├─────────────────────────────────────────┐
            ▼                                         ▼
  [ 6. REAL-TIME CHAT ]                     [ 7. WebRTC P2P CALL ]
  Instant bidirectional messaging           Private HD video/voice call
  via Socket.io with zero polling           using direct peer-to-peer stream
```

---

## 📞 WebRTC Audio & Video Calling Architecture

WebRTC creates a **direct, peer-to-peer encrypted connection** between two mutually matched users. Socket.io serves as the signaling bridge to exchange connection metadata:

```
User A (Caller)                   Signaling Server (Socket.io)                 User B (Callee)
      │                                       │                                       │
      │─── 1. call:offer (SDP Offer) ────────>│─── 2. Relay call:offer ──────────────>│
      │                                       │                                       │ (Incoming Ring)
      │<── 4. Relay call:answer ──────────────│<── 3. call:answer (SDP Answer) ───────│ (Accepts Call)
      │                                       │                                       │
      │─── 5. call:ice (ICE Candidates) ─────>│─── 6. Relay call:ice ────────────────>│
      │<── 8. Relay call:ice ─────────────────│<── 7. call:ice (ICE Candidates) ──────│
      │                                       │                                       │
      ▼═══════════════════════════════════════════════════════════════════════════════▼
                 DIRECT ENCRYPTED PEER-TO-PEER MEDIA STREAM (Audio & Video)
                      Google STUN: stun:stun.l.google.com:19302
```

1. **Offer / Answer Exchange**: Caller creates an SDP offer; callee accepts and sends an SDP answer via WebSocket.
2. **ICE Candidates & NAT Traversal**: Both peers query Google's public STUN server (`stun:stun.l.google.com:19302`) to discover their public IP and port, routing directly through firewalls and NATs.
3. **Encrypted Media Stream**: Once connected, audio and video streams flow directly peer-to-peer with zero server bandwidth overhead.

---

## ✨ Key Features

### 🔐 1. Authentication & Security
- **JWT Stateless Authentication**: 7-day signed tokens stored in client storage with Axios authorization interceptors.
- **Password Security**: Salted hashing with `bcryptjs` (10 rounds).
- **Auto-Login**: Registration instantly generates a JWT session and navigates directly to the dashboard.
- **Route Guarding**: Protected routes verify tokens and guard private dashboard views.

### 🎯 2. Intelligent Matchmaking
- **Deterministic Compatibility Scoring**: Evaluates age, religion, caste, education, location, and lifestyle alignment.
- **Multi-Attribute Filters**: Filter by gender, location, religion, caste, age range, and profession.
- **Connection Workflow**: Three-state connection state machine (`Pending` $\rightarrow$ `Accepted` / `Rejected`).
- **Mutual Matches Hub**: Dedicated inbox showing only reciprocated connections.

### 💬 3. Communication & Media
- **Real-Time Messaging**: Socket.io instant messaging with zero-polling screen refreshes and persistent MongoDB message storage.
- **WebRTC Calling**: Peer-to-peer HD video and crystal audio calling with incoming/outgoing ringtones.
- **Ephemeral 24-Hour Stories**: Stories automatically evicted after 24 hours using MongoDB's native **TTL index** (`expires: 86400`).
- **Cloudinary Photo Gallery**: Responsive cloud storage and CDN delivery for profile pictures and mutual galleries.

### 🏆 4. Gamification & Community
- **Profile Strength Meter**: Real-time progress bar guiding users to complete their bio, photos, and preferences.
- **Achievement Badges**: Automated badges for verified members, first match, popular profiles, and active streaks.
- **Success Stories**: Inspiring real-world community testimonials.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router 6, Axios |
| **UI & Styling** | Tailwind CSS 3, Framer Motion, `@tsparticles/react` |
| **Backend** | Node.js (v20 LTS), Express.js (ES Modules) |
| **Real-Time & P2P** | Socket.io (v4), WebRTC (`RTCPeerConnection`), Google STUN |
| **Database** | MongoDB Atlas, Mongoose 8 (with TTL Indexes) |
| **Media & Storage** | Cloudinary CDN, Multer, Multer-Storage-Cloudinary |
| **Security** | JSON Web Tokens (JWT), `bcryptjs`, CORS Policy Engine |
| **Deployments** | Vercel (Frontend SPA), Render (Backend Web Service) |

---

## 📁 Repository Structure

```
matrimonial/
├── backend/
│   ├── config/             # Database connection with auto-retry (db.js)
│   ├── controllers/        # Business logic (auth, profile, chat, interest, gallery)
│   ├── middleware/         # JWT auth guard (authMiddleware.js), Cloudinary upload
│   ├── models/             # Mongoose schemas (User, Message, Interest, Story, etc.)
│   ├── routes/             # REST endpoints (auth, profile, chat, stories, badges)
│   ├── utils/              # Match score calculation & daily streak logic
│   ├── server.js           # Express app, Socket.io signaling & WebRTC gateway
│   ├── .env.example        # Backend environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (Navbar, Footer, Badges, CallModal)
│   │   ├── context/        # Global AuthContext & state providers
│   │   ├── pages/          # Views (Home, Dashboard, Matches, MutualMatches, Chat)
│   │   ├── services/       # Axios API client with Bearer token interceptor
│   │   ├── Socket.js       # Central Socket.io singleton instance
│   │   ├── App.jsx         # Client-side routing configuration
│   │   └── main.jsx        # React application root entry point
│   ├── .env.example        # Frontend environment template
│   ├── vite.config.js      # Vite build configuration
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or v20 LTS)
- MongoDB database (local or free MongoDB Atlas cluster)
- Cloudinary account (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/ritikkumar4747/matrimonial-app.git
cd matrimonial-app
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI, JWT_SECRET, and Cloudinary keys in .env
npm run dev
```
*Backend runs on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Set VITE_BACKEND_URL=http://localhost:5000 in .env
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register account (returns JWT token & user object) | Public |
| `POST` | `/api/auth/login` | Log in and receive JWT token | Public |
| `POST` | `/api/auth/forgot-password` | Generate 6-digit recovery code | Public |
| `POST` | `/api/auth/reset-password` | Reset password using recovery code | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user payload | 🔒 Bearer |

### 👤 Profiles (`/api/profile`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/profile/me` | Retrieve profile of authenticated user | 🔒 Bearer |
| `PUT` | `/api/profile/update` | Update profile information & preferences | 🔒 Bearer |
| `GET` | `/api/profile/all` | Search and list profiles with match scores | 🔒 Bearer |
| `GET` | `/api/profile/recommended`| Fetch top calculated recommendations | 🔒 Bearer |
| `GET` | `/api/profile/:userId` | View public profile of a user | 🔒 Bearer |
| `POST` | `/api/profile/photo` | Upload profile photo to Cloudinary | 🔒 Bearer |

### 💖 Interests & Matching (`/api/interest`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/interest/send` | Send interest request (`toUserId`) | 🔒 Bearer |
| `GET` | `/api/interest/received`| Fetch incoming pending interest requests | 🔒 Bearer |
| `GET` | `/api/interest/sent` | Fetch sent interest requests | 🔒 Bearer |
| `PUT` | `/api/interest/:id` | Accept or reject an interest request | 🔒 Bearer |
| `GET` | `/api/interest/mutual` | Retrieve all mutual matches | 🔒 Bearer |

### 💬 Chat & Messages (`/api/chat`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/chat/:userId` | Get chat history between mutual matches | 🔒 Bearer |
| `POST` | `/api/chat/send` | Send and persist chat message | 🔒 Bearer |

### 📸 Ephemeral Stories (`/api/stories`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/stories` | Fetch active 24-hour stories | 🔒 Bearer |
| `POST` | `/api/stories` | Upload a 24-hour story (auto-purged by TTL) | 🔒 Bearer |
| `POST` | `/api/stories/:id/view` | Mark story as viewed | 🔒 Bearer |

---

## 🛡️ Security & Engineering Best Practices

- **Zero Polling Real-Time Communication**: Chat relies strictly on WebSocket events, avoiding interval polling and screen flickering.
- **Stateless Authorization**: JWT verification middleware guards all sensitive routes without holding session state in memory.
- **Input Sanitization**: Password hashing with unique bcrypt salts and strict JSON payload validation.
- **Graceful Degradation**: WebRTC calling gracefully falls back to audio when video hardware is unavailable.
- **CORS Protection**: Origin-whitelisted cross-origin request handling supporting local and production domains.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
