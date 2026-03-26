# Render Deployment Setup Guide

## Required Environment Variables on Render

Go to your Render service dashboard → Environment → add these variables:

### 1. **MongoDB**
```
MONGO_URI=your_mongodb_connection_string
```

### 2. **Email Configuration (Resend - RECOMMENDED)**
```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ADMIN_EMAIL=admin@yourresort.com
ADMIN_PHONE=+91-XXXXXXXXXX
```

**Getting Resend API Key:**
1. Go to https://resend.com (free tier: 100 emails/day)
2. Sign up with your email
3. Go to API Keys → Create New API Key
4. Copy the key to `RESEND_API_KEY`

### 3. **Frontend URL**
```
CLIENT_URL=https://your-frontend-url.vercel.app,http://localhost:3000
```

### 4. **Port**
```
PORT=5000
```

---

## Common Issues & Fixes

### ❌ **Email Not Sending**

**Fix:** Use Resend (already set up in code)
1. Sign up at https://resend.com
2. Get API Key
3. Add to Render: `RESEND_API_KEY=re_...`
4. Redeploy

✅ Resend is **free**, **reliable**, and **works perfectly with Render**

### ❌ **404 Error on Frontend**

**Check:**
```
CLIENT_URL=https://your-frontend-url.vercel.app
```
Make sure this is your actual Vercel/deployed frontend URL

---

## Testing the Setup

1. **Install dependencies first:**
```bash
cd Backend
npm install
```

2. **Test email locally** - Create `.env` file with:
```
MONGO_URI=your_mongodb_connection_string
RESEND_API_KEY=re_your_api_key
ADMIN_EMAIL=admin@yourresort.com
ADMIN_PHONE=+91-9876543210
CLIENT_URL=http://localhost:3000
PORT=5000
```

3. **Start server:**
```bash
npm run dev
```

4. **Test with cURL or Postman:**
```bash
curl -X POST http://localhost:5000/api/submit-enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "roomType": "Deluxe",
    "guests": 2,
    "checkIn": "2024-04-01",
    "checkOut": "2024-04-05",
    "message": "Test booking"
  }'
```

✅ If email arrives → Setup is working!

---

## Updated Environment Variables Checklist

- [ ] MONGO_URI (MongoDB connection string)
- [ ] RESEND_API_KEY (from resend.com)
- [ ] ADMIN_EMAIL (Where to send bookings)
- [ ] ADMIN_PHONE (Contact number)
- [ ] CLIENT_URL (Your frontend URL)
- [ ] PORT (5000 or higher)

---

## Render Deployment Steps

1. **Push code to GitHub**
2. **Connect GitHub to Render**
3. **Add Environment Variables** (from Render dashboard)
4. **Deploy**
5. **Check logs** if errors occur

View live logs: Render Dashboard → Your Service → Logs
