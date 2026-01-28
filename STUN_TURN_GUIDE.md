# STUN/TURN Server Guide

## What are STUN and TURN?

### STUN (Session Traversal Utilities for NAT)
- Helps discover your public IP address
- Required for WebRTC to establish peer-to-peer connections
- **Free** public servers available
- Works for ~80% of connections

### TURN (Traversal Using Relays around NAT)
- Relays media when direct peer-to-peer fails
- Required for users behind strict firewalls/NATs
- **Not free** (uses bandwidth)
- Needed for ~20% of connections that STUN can't handle

## Current Configuration

✅ **Multiple STUN servers configured**:
- Google STUN (5 servers)
- Mozilla STUN
- Cloudflare STUN

This handles most connections. For production with difficult networks, add TURN servers.

## Free TURN Server Options

### 1. Metered OpenRelay (Recommended for Testing)
```javascript
{
  urls: "turn:openrelay.metered.ca:80",
  username: "openrelayproject",
  credential: "openrelayproject"
}
```
- **Free but limited**
- Good for testing/small apps
- May have bandwidth restrictions

### 2. Twilio Network Traversal Service
```javascript
// Get ephemeral credentials from your backend
{
  urls: "turn:global.turn.twilio.com:3478?transport=udp",
  username: "your-twilio-username",
  credential: "your-twilio-credential"
}
```
- **Free tier available** (10,000 minutes/month)
- Highly reliable
- Production-ready
- Signup: https://www.twilio.com/stun-turn

### 3. Xirsys (Global CDN)
```javascript
{
  urls: "turn:xirsys-server.com",
  username: "your-username",
  credential: "your-credential"
}
```
- **Free tier**: 500 MB/month
- Global server locations
- Good performance
- Signup: https://xirsys.com

### 4. Self-Hosted TURN (Coturn)
```bash
# Install on your VPS (DigitalOcean, AWS, etc.)
sudo apt install coturn
```
- **Full control**
- Requires your own server
- Free (just server costs)
- Best for high-traffic apps

## When to Add TURN Servers

### Scenarios that need TURN:
✅ Users on corporate networks with strict firewalls  
✅ Users behind symmetric NAT (common in mobile carriers)  
✅ Users in different countries with poor routing  
✅ Production apps requiring 99%+ connection success  

### Can skip TURN if:
❌ Only testing/development  
❌ Small user base on home networks  
❌ Limited budget  

## Implementation

### Option 1: Use OpenRelay (Quick Test)

In `Chat.jsx`, uncomment the TURN section:
```javascript
iceServers: [
  // ... existing STUN servers ...
  {
    urls: "turn:openrelay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject"
  }
]
```

### Option 2: Get Twilio TURN (Production)

1. **Sign up**: https://www.twilio.com
2. **Get credentials** from dashboard
3. **Create backend endpoint** to generate ephemeral tokens:

```javascript
// backend/routes/turnRoutes.js
import express from "express";
import twilio from "twilio";

const router = express.Router();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

router.get("/turn-credentials", async (req, res) => {
  try {
    const token = await client.tokens.create();
    res.json({
      iceServers: token.iceServers
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get TURN credentials" });
  }
});

export default router;
```

4. **Frontend fetches credentials**:
```javascript
const getTurnServers = async () => {
  const response = await API.get("/turn-credentials");
  return response.data.iceServers;
};
```

### Option 3: Self-Host with Coturn

1. **Deploy Coturn** on a VPS
2. **Configure** `/etc/turnserver.conf`:
```conf
listening-port=3478
external-ip=YOUR_SERVER_IP
realm=yourdomain.com
user=username:password
```
3. **Use in app**:
```javascript
{
  urls: "turn:your-server.com:3478",
  username: "username",
  credential: "password"
}
```

## Testing Connection Success

Add this to check which server type was used:

```javascript
pc.oniceconnectionstatechange = () => {
  console.log(`ICE connection state: ${pc.iceConnectionState}`);
  
  pc.getStats().then(stats => {
    stats.forEach(report => {
      if (report.type === "candidate-pair" && report.state === "succeeded") {
        console.log("Connection type:", report.candidateType);
        // "host" = direct, "srflx" = STUN, "relay" = TURN
      }
    });
  });
};
```

## Recommendations

### For Development/Testing:
- ✅ Current STUN configuration (already set)
- ✅ Optional: Add OpenRelay TURN for testing

### For Production (Small App):
- ✅ Current STUN + Twilio TURN free tier
- ✅ Costs: $0-10/month

### For Production (Large App):
- ✅ Multiple STUN + Twilio/Xirsys TURN
- ✅ Or self-hosted Coturn on VPS
- ✅ Costs: $50-200/month

## Current Setup Summary

Your app **already has**:
- ✅ 7 reliable STUN servers
- ✅ Optimized ICE configuration
- ✅ Works for ~80% of connections

To reach **99%+ success rate**, add TURN servers using one of the options above.
