# 🚔 Police Accountability System

A comprehensive platform for **police accountability** and **public transparency**. This system includes an admin dashboard for law enforcement management and a public portal for citizens to submit complaints and track investigations.

## 📋 Features

### Admin Dashboard (Police Use)
- 📹 **View & Manage Footage** - Track recorded incidents
- 🔍 **Search Incidents** - Filter by date, officer ID, or location
- 📋 **Complaint Management** - Review and respond to citizen complaints
- 👮 **User Management** - Manage officers and admin accounts
- 🚩 **Flag Incidents** - Mark suspicious or important incidents for review

### Public Portal (Citizen Use)
- 📝 **Submit Complaints** - Report police incidents with evidence
- 🔍 **Track Status** - Monitor complaint investigation progress
- 📊 **View Findings** - See investigation results and outcomes
- 🔒 **Privacy Protected** - Secure and confidential submissions

---

## 🏗️ Project Structure

```
PoliceDash/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth & validation
│   │   └── utils/           # Helper functions
│   ├── database-schema.sql  # Supabase SQL schema
│   └── package.json
│
├── admin-dashboard/         # React admin UI (Port 3000)
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   └── App.jsx
│   └── package.json
│
└── public-portal/           # React public UI (Port 3002)
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API client
    │   └── App.jsx
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 16.x
- **npm** or **yarn**
- **Supabase** account (free tier)

### 1. Setup Supabase Database

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL editor and run the contents of `backend/database-schema.sql`
4. Copy your Supabase URL and API key from Project Settings

### 2. Install Dependencies

```bash
# Install root workspace dependencies
npm install

# This will install dependencies for all three packages
```

### 3. Configure Environment Variables

#### Backend (`.env`)
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-jwt-secret-here
NODE_ENV=development
```

#### Admin Dashboard (`.env`)
Create `admin-dashboard/.env`:
```
REACT_APP_API_URL=http://localhost:3001/api
```

#### Public Portal (`.env`)
Create `public-portal/.env`:
```
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Start Development Servers

**Start everything at once:**
```bash
npm run dev
```

**Or start individually:**

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Admin Dashboard (Terminal 2):**
```bash
cd admin-dashboard
npm run dev
# Opens at http://localhost:3000
```

**Public Portal (Terminal 3):**
```bash
cd public-portal
npm run dev
# Opens at http://localhost:3002
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login              - Login user
POST   /api/auth/logout             - Logout user
```

### Incidents (Admin Only)
```
GET    /api/incidents               - List all incidents (with filters)
GET    /api/incidents/:id           - Get incident details
POST   /api/incidents               - Create new incident
PATCH  /api/incidents/:id/flag      - Flag incident for review
```

### Complaints (Public)
```
GET    /api/complaints              - List public complaints
GET    /api/complaints/:id          - Get complaint details
POST   /api/complaints              - Submit new complaint
GET    /api/complaints/:id/status   - Get complaint status
PATCH  /api/complaints/:id/status   - Update complaint status (admin)
```

### Users (Admin Only)
```
GET    /api/users                   - List all users
GET    /api/users/:id               - Get user details
POST   /api/users                   - Create new user
PATCH  /api/users/:id               - Update user
DELETE /api/users/:id               - Delete user
```

---

## 🗄️ Database Schema

### Tables

#### `users`
- Officer and admin accounts
- Fields: id, name, email, role, badge_number, department, timestamps

#### `incidents`
- Recorded footage and incidents
- Fields: id, officer_id, location, description, footage_url, is_flagged, timestamps

#### `complaints`
- Citizen complaints about incidents
- Fields: id, citizen_name, citizen_email, description, incident_date, officer_id, location, evidence_urls, status, findings, timestamps

---

## 🔐 Security Considerations

1. **Authentication**: Implement proper JWT authentication
2. **Row Level Security**: Supabase RLS policies are configured but need to be enabled
3. **CORS**: Configure allowed origins in backend
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Data Validation**: Validate all user inputs on backend
6. **HTTPS**: Use HTTPS in production
7. **Environment Variables**: Never commit `.env` files

---

## 🛣️ Roadmap

### Phase 1 (Current - MVP)
- ✅ Basic incident management
- ✅ Complaint submission
- ✅ Status tracking
- ✅ User management

### Phase 2 (Next)
- Video playback and streaming
- Advanced complaint filtering
- Analytics dashboard
- Email notifications
- File uploads for evidence

### Phase 3 (Future)
- Multi-language support
- Mobile app
- Public statistics & reports
- Advanced analytics
- Integration with other agencies

---

## 📦 Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Admin Dashboard
```bash
cd admin-dashboard
npm run build
# Dist files in admin-dashboard/dist/
```

### Public Portal
```bash
cd public-portal
npm run build
# Dist files in public-portal/dist/
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check Supabase URL and key in `.env`
- Verify project is active in Supabase dashboard

### "CORS error"
- Backend CORS is configured for `http://localhost:*`
- Update CORS in `backend/src/index.js` for different domains

### "Module not found"
```bash
# Reinstall all dependencies
rm -rf node_modules
npm install
```

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Submit a pull request

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Contact: accountability@detroitpd.org

---

## ⚖️ Important Note

This is a **non-emergency reporting system**. For actual emergencies, always call **911**.

This platform is designed to promote **transparency**, **accountability**, and **community trust** in law enforcement.

**Made with ❤️ for community accountability**
