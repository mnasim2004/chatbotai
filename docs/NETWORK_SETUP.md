# Local Network Setup Guide

This guide explains how to run ChatbotAI on your PC and make it accessible to other devices on the same local network.

## Step 1: Find Your Local IP Address

### Windows
```bash
ipconfig
```
Look for **IPv4 Address** under your active network adapter (usually `192.168.x.x` or `10.x.x.x`)

### macOS/Linux
```bash
ifconfig
# or
ip addr show
```
Look for `inet` address (usually `192.168.x.x` or `10.x.x.x`)

**Example:** Your IP might be `192.168.1.100`

## Step 2: Configure Backend

1. **Update `backend/.env`:**
```env
PORT=5000
HOST=0.0.0.0
MONGODB_URI=mongodb://localhost:27017/chatbotai
JWT_SECRET=your-strong-secret

# Optional services
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
GROQ_API_KEY=xxx
```

2. **Start Backend:**
```bash
cd backend
npm run dev
```

The server will now listen on all network interfaces and be accessible at:
- `http://localhost:5000` (on your PC)
- `http://192.168.1.100:5000` (replace with your IP, from other devices on network)

## Step 3: Configure Frontend

1. **Update `frontend/.env`:**
```env
VITE_API_URL=http://192.168.1.100:5000/api
```
*(Replace `192.168.1.100` with your actual local IP)*

2. **Start Frontend:**
```bash
cd frontend
npm run dev
```

Vite will show the dev server URL (usually `http://localhost:5173`)

## Step 4: Access from Other Devices

### On Your PC:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### On Other Devices (Phone, Tablet, Another PC on Same Network):
1. Make sure they're connected to the **same Wi-Fi network**
2. Open browser and go to: `http://192.168.1.100:5173`
   *(Replace `192.168.1.100` with your PC's IP)*

## Troubleshooting

### Firewall Issues (Windows)
If other devices can't connect, allow Node.js through Windows Firewall:

1. Open **Windows Defender Firewall**
2. Click **Allow an app or feature through Windows Firewall**
3. Find **Node.js** and check both **Private** and **Public**
4. If Node.js isn't listed, click **Allow another app** → Browse → Select `node.exe` from your Node.js installation

### Firewall Issues (macOS/Linux)
```bash
# macOS: Allow port 5000 and 5173
sudo pfctl -f /etc/pf.conf

# Linux: Allow ports with ufw
sudo ufw allow 5000
sudo ufw allow 5173
```

### Connection Refused
- Verify your PC and other devices are on the **same network**
- Check that your IP address hasn't changed (DHCP may assign new IP)
- Ensure backend is running and shows the "🚀 Server running" message
- Try pinging your PC's IP from another device to verify network connectivity

### API Not Working on Other Devices
- Ensure `VITE_API_URL` in `frontend/.env` uses your **local IP**, not `localhost`
- After changing `.env`, **restart the Vite dev server**
- Check browser console on other devices for CORS errors (shouldn't happen with our CORS config)

## Production Alternative

For production deployment, consider:
- Using a proper domain name
- Setting up reverse proxy (nginx, Apache)
- Using HTTPS with SSL certificate
- Deploying to cloud hosting (Vercel, Netlify, Railway, etc.)

## Quick Test

1. On your PC: Open `http://localhost:5173` → Should work
2. On your phone (same Wi-Fi): Open `http://[YOUR_IP]:5173` → Should work
3. If both work, you're all set! 🎉

