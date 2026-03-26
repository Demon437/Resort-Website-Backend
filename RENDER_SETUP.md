# Render Deployment Setup Guide

## Required Environment Variables on Render

Go to your Render service dashboard → Environment → add these variables:

### 1. **MongoDB**
```
MONGO_URI=your_mongodb_connection_string
```

### 2. **Email Configuration (IMPORTANT)**

**Option A: Gmail (with App Password - RECOMMENDED)**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_16_digit_app_password
ADMIN_EMAIL=admin@yourresort.com
ADMIN_PHONE=+91-XXXXXXXXXX
```

**Getting Gmail App Password:**
1. Go to Google Account → Security
2. Enable "2-Step Verification" (if not already enabled)
3. Go to Security → App passwords
4. Select app: Mail, Select device: Windows Computer
5. Google will generate a 16-character password
6. Copy this password to `EMAIL_PASS` (remove spaces)

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

### ❌ **Error: "Connection timeout" (ETIMEDOUT)**

**Signs:**
- Backend shows: `Connection timeout` error
- SMTP connection timing out

**Solutions (in order):**

1. **Verify Gmail App Password** (not regular password)
   - Regular passwords don't work with third-party apps
   - Must use 16-character App Password

2. **Check 2-Step Verification is enabled**
   - App passwords only work when 2FA is ON

3. **Try different SMTP settings:**
   ```
   Port: 587 (TLS - recommended)
   or
   Port: 465 (SSL)
   ```

4. **Test locally first:**
   ```bash
   npm install nodemailer
   node test-email.js
   ```

### ❌ **Error: "Authentication failed"**

**Fix:**
- Ensure EMAIL_USER and EMAIL_PASS are correct
- Use Gmail's 16-character App Password, not your Google password
- Check for extra spaces in environment variables

### ❌ **404 Error on Frontend**

**Check:**
```
CLIENT_URL=https://your-frontend-url.vercel.app
```
Make sure this is your actual Vercel/deployed frontend URL

---

## Testing the Setup

1. **Test email locally first:**
```bash
cd Backend
npm install dotenv nodemailer mongoose express cors
```

2. **Create test file** (`test-email.js`):
```javascript
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('✅ Email ready!!');
  }
});
```

3. **Run test:**
```bash
node test-email.js
```

---

## Updated Environment Variables Checklist

- [ ] MONGO_URI (MongoDB connection string)
- [ ] EMAIL_USER (Gmail address)
- [ ] EMAIL_PASS (Gmail App Password - 16 characters)
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
