import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ComplaintForm from './components/ComplaintForm';
import ComplaintTracking from './components/ComplaintTracking';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo-area">
              <h1>🚔 Police Accountability Platform</h1>
              <p>Transparency & Community Trust</p>
            </div>
          </div>
        </header>

        <nav className="navbar">
          <ul>
            <li>
              <Link to="/" className="nav-link">
                📝 Submit Complaint
              </Link>
            </li>
            <li>
              <Link to="/track" className="nav-link">
                🔍 Track Complaint
              </Link>
            </li>
            <li>
              <a href="#about" className="nav-link">
                ℹ️ About
              </a>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<ComplaintForm />} />
            <Route path="/track" element={<ComplaintTracking />} />
          </Routes>
        </main>

        <section id="about" className="about-section">
          <div className="about-content">
            <h2>About This Platform</h2>
            <div className="about-grid">
              <div className="about-card">
                <h3>🤝 Community Voice</h3>
                <p>Report incidents and help us build a more accountable police department. Your feedback matters.</p>
              </div>
              <div className="about-card">
                <h3>📊 Transparency</h3>
                <p>Track complaint status in real-time. See how incidents are being investigated and resolved.</p>
              </div>
              <div className="about-card">
                <h3>🔒 Privacy Protected</h3>
                <p>Your personal information is confidential. We follow strict data protection guidelines.</p>
              </div>
              <div className="about-card">
                <h3>⚖️ Fair Review</h3>
                <p>All complaints are thoroughly reviewed by qualified investigators with full transparency.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>© 2024 Detroit Police Department • Public Accountability &amp; Transparency Initiative</p>
          <p>
            <small>
              For emergency situations, always call 911. This platform is for non-emergency complaints and feedback.
            </small>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
