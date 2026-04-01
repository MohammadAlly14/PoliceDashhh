# 🚀 Setup Guide - Police Accountability System

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details:
   - **Name:** `PoliceDash`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Select closest to your location

### 1.2 Initialize Database Schema
1. Once project is created, go to **SQL Editor**
2. Click **New Query**
3. Copy all content from `backend/database-schema.sql`
4. Paste it in the SQL Editor
5. Click **Run** (or Ctrl+Enter)
6. You should see "Success" message

### 1.3 Get Your Credentials
1. Go to **Project Settings** (gear icon)
2. Click **API**
3. Copy these values:
   - **Project URL** - your Supabase URL
   - **anon public** - your API key (under Project API keys)

---

## Step 2: Backend Setup

### 2.1 Create Environment File
```bash
cd backend
cp .env.example .env
```

### 2.2 Edit `.env` File
```
PORT=3001
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_random_secret_key_here_12345
NODE_ENV=development
```

### 2.3 Install Dependencies
```bash
npm install
```

### 2.4 Test Backend
```bash
npm run dev
```
You should see: `🚔 Police Dashboard Backend running on port 3001`

Test the API:
- Open: `http://localhost:3001/api/health`
- You should see: `{"status":"ok","timestamp":"2024-03-30T..."}`

---

## Step 3: Admin Dashboard Setup

### 3.1 Install Dependencies
```bash
cd admin-dashboard
npm install
```

### 3.2 Create Environment File (Optional)
```
REACT_APP_API_URL=http://localhost:3001/api
```

### 3.3 Start Development Server
```bash
npm run dev
```
- Browser should open automatically to `http://localhost:3000`

---

## Step 4: Public Portal Setup

### 4.1 Install Dependencies
```bash
cd public-portal
npm install
```

### 4.2 Create Environment File (Optional)
```
REACT_APP_API_URL=http://localhost:3001/api
```

### 4.3 Start Development Server
```bash
npm run dev
```
- Opens at `http://localhost:3002`

---

## Step 5: Test the Application

### Backend Tests
```bash
# Check health endpoint
curl http://localhost:3001/api/health

# Create a test user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Officer John",
    "email": "john@police.gov",
    "role": "officer",
    "badge_number": "APD-2024-001",
    "department": "Detroit PD"
  }'

# Get all users
curl http://localhost:3001/api/users
```

### Admin Dashboard Tests
1. Navigate to `http://localhost:3000`
2. Check "Incidents" tab - should be empty (that's normal)
3. Check "Complaints" tab
4. Check "Users" tab and try creating a new user

### Public Portal Tests
1. Navigate to `http://localhost:3002`
2. Click "📝 Submit Complaint"
3. Fill out the form and submit
4. You should see success message with Complaint ID
5. Click "🔍 Track Complaint"
6. Enter the Complaint ID to track status

---

## Common Issues & Solutions

### Issue: "Cannot find module 'express'"
```bash
cd backend
npm install
```

### Issue: "Supabase connection failed"
- ✅ Check your SUPABASE_URL and SUPABASE_KEY
- ✅ Make sure project is running (check Supabase dashboard)
- ✅ Verify SQL schema was created

### Issue: "Port already in use"
```bash
# Change port in .env or vite.config.js
# For example, use 3001, 3003, 3004 instead
```

### Issue: "CORS error in debug console"
- This is expected during development
- Make sure backend is running on correct port
- Check API URL in frontend `.env` files

---

## Next Steps

### After testing, you should:

1. **Create API Routes** (Already done! ✅)
2. **Implement Authentication** - Add JWT/Supabase Auth
3. **Add Video Processing** - Stream/upload functionality
4. **Setup Notifications** - Email alerts for admins
5. **Deploy** - Vercel/Heroku for apps, Railway for backend

---

## Deployment Checklist

### Before Going Live:
- [ ] Environment variables configured (no defaults)
- [ ] Database backups enabled in Supabase
- [ ] HTTPS enabled
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Security headers configured
- [ ] Admin users created
- [ ] Monitoring/logging setup
- [ ] Incident response plan

---

## Useful Commands

```bash
# Run everything at once
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Check if port is in use (macOS/Linux)
lsof -i :3001
lsof -i :3000
lsof -i :3002

# Check if port is in use (Windows)
netstat -ano | findstr :3001
```

---

## Project Structure Reference

```
backend/
├── src/
│   ├── routes/
│   │   ├── incidents.js    ← Incident management
│   │   ├── complaints.js   ← Complaint tracking
│   │   ├── users.js        ← User management
│   │   └── auth.js         ← Authentication
│   ├── utils/
│   │   └── supabase.js     ← Supabase client
│   └── index.js            ← Main server file
├── database-schema.sql     ← Database setup
└── package.json

admin-dashboard/
├── src/
│   ├── components/
│   │   ├── IncidentsList.jsx       ← View/manage incidents
│   │   ├── ComplaintsManagement.jsx ← Handle complaints
│   │   └── UsersManagement.jsx     ← Manage users
│   ├── services/
│   │   └── api.js          ← API client
│   ├── App.jsx             ← Main app
│   └── index.css           ← Global styles

public-portal/
├── src/
│   ├── components/
│   │   ├── ComplaintForm.jsx       ← Submit complaint
│   │   └── ComplaintTracking.jsx   ← Track complaint
│   ├── services/
│   │   └── api.js          ← API client
│   ├── App.jsx             ← Main app
│   └── index.css           ← Global styles
```

---

## Support

If you encounter issues:
1. Check the README.md for full documentation
2. Review error messages carefully
3. Check Supabase dashboard status
4. Verify all credentials are correct
5. Check that all three servers are running

**Happy coding! 🚀**
