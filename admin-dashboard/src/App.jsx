import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import IncidentsList from './components/IncidentsList';
import ComplaintsManagement from './components/ComplaintsManagement';
import UsersManagement from './components/UsersManagement';
import Statistics from './components/Statistics';
import Reports from './components/Reports';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('john@police.gov');
  const [loginPassword, setLoginPassword] = useState('password');
  const [loginError, setLoginError] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Check for existing auth
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (authToken && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        throw new Error('Invalid server response: ' + (text || 'empty body'));
      }

      if (!response.ok) {
        const message = (data && data.error) || `Login failed (${response.status})`;
        setLoginError(message);
        return;
      }

      if (!data || !data.token) {
        setLoginError('Invalid login response from server');
        return;
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      setLoginError('Connection error: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div style={{ color: 'black', fontSize: '20px', padding: '20px' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ color: '#003d5c' }}>🚔 Mauritius Police Service</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>Accountability & Transparency Platform</p>
        </div>
        <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#003d5c', marginBottom: '20px' }}>Officer Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                required
              />
            </div>
            {loginError && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{loginError}</div>}
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#003d5c', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Login</button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '13px', color: '#666', textAlign: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '4px', borderLeft: '3px solid #f39200' }}>
            <strong>Demo Credentials:</strong> <br />john@police.gov / password
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5' }}>
      <header style={{ background: 'linear-gradient(135deg, #003d5c 0%, #003d5c 100%)', color: 'white', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>🚔 Mauritius Police Service • Accountability Platform</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span>{user.name} ({user.role === 'admin' ? 'Senior Officer' : 'Police Constable'})</span>
            <button onClick={handleLogout} style={{ background: '#f39200', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Logout</button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <nav style={{ background: 'white', borderRight: '1px solid #ddd', padding: '20px', width: '250px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li style={{ margin: '10px 0' }}>
              <button onClick={() => setCurrentPage('dashboard')} style={{ display: 'block', width: '100%', padding: '12px 16px', background: currentPage === 'dashboard' ? '#f0f0f0' : 'transparent', color: currentPage === 'dashboard' ? '#003d5c' : '#333', textDecoration: 'none', borderRadius: '4px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: currentPage === 'dashboard' ? '600' : '400' }}>📊 Dashboard</button>
            </li>
            <li style={{ margin: '10px 0' }}>
              <button onClick={() => setCurrentPage('incidents')} style={{ display: 'block', width: '100%', padding: '12px 16px', background: currentPage === 'incidents' ? '#f0f0f0' : 'transparent', color: currentPage === 'incidents' ? '#003d5c' : '#333', textDecoration: 'none', borderRadius: '4px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: currentPage === 'incidents' ? '600' : '400' }}>📹 Incidents</button>
            </li>
            <li style={{ margin: '10px 0' }}>
              <button onClick={() => setCurrentPage('complaints')} style={{ display: 'block', width: '100%', padding: '12px 16px', background: currentPage === 'complaints' ? '#f0f0f0' : 'transparent', color: currentPage === 'complaints' ? '#003d5c' : '#333', textDecoration: 'none', borderRadius: '4px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: currentPage === 'complaints' ? '600' : '400' }}>📋 Complaints</button>
            </li>
            <li style={{ margin: '10px 0' }}>
              <button onClick={() => setCurrentPage('users')} style={{ display: 'block', width: '100%', padding: '12px 16px', background: currentPage === 'users' ? '#f0f0f0' : 'transparent', color: currentPage === 'users' ? '#003d5c' : '#333', textDecoration: 'none', borderRadius: '4px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: currentPage === 'users' ? '600' : '400' }}>👮 Users</button>
            </li>
            <li style={{ margin: '10px 0' }}>
              <button onClick={() => setCurrentPage('statistics')} style={{ display: 'block', width: '100%', padding: '12px 16px', background: currentPage === 'statistics' ? '#f0f0f0' : 'transparent', color: currentPage === 'statistics' ? '#003d5c' : '#333', textDecoration: 'none', borderRadius: '4px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: currentPage === 'statistics' ? '600' : '400' }}>📈 Statistics</button>
            </li>
            <li style={{ margin: '10px 0' }}>
              <button onClick={() => setCurrentPage('reports')} style={{ display: 'block', width: '100%', padding: '12px 16px', background: currentPage === 'reports' ? '#f0f0f0' : 'transparent', color: currentPage === 'reports' ? '#003d5c' : '#333', textDecoration: 'none', borderRadius: '4px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: currentPage === 'reports' ? '600' : '400' }}>📄 Reports</button>
            </li>
          </ul>
        </nav>

        <main style={{ flex: 1, padding: '30px', marginLeft: '20px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'incidents' && <IncidentsList />}
          {currentPage === 'complaints' && <ComplaintsManagement />}
          {currentPage === 'users' && <UsersManagement />}
          {currentPage === 'statistics' && <Statistics />}
          {currentPage === 'reports' && <Reports />}
        </main>
      </div>

      <footer style={{ background: '#003d5c', color: 'white', textAlign: 'center', padding: '20px', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>© 2026 Mauritius Police Service • Accountability & Transparency Platform</p>
      </footer>
    </div>
  );
}

export default App;
