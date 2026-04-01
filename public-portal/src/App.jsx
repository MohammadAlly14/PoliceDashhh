import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ComplaintForm from './components/ComplaintForm';
import ComplaintTracking from './components/ComplaintTracking';
import './App.css';

function App() {
    React.useEffect(() => {
      console.log('App component mounted');
    }, []);

  return (
    <Router onError={(error) => console.error('Router error:', error)}>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo-area">
              <p className="eyebrow">Mauritius Police Service</p>
              <h1>Public Complaints & Accountability Portal</h1>
              <p>Report misconduct and submit evidence securely. Monitor your case progression.</p>
            </div>
            <div className="header-chip">24/7 Public Intake</div>
          </div>
        </header>

        <nav className="navbar">
          <ul>
            <li>
              <Link to="/" className="nav-link">
                Submit Complaint
              </Link>
            </li>
            <li>
              <Link to="/track" className="nav-link">
                Track Complaint
              </Link>
            </li>
            <li>
              <a href="#about" className="nav-link">
                About
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
            <h2>How This Portal Works</h2>
            <div className="about-grid">
              <div className="about-card">
                <h3>Report Against Any Party</h3>
                <p>Submit complaints against police officers, civilians, organizations, or any identified individual.</p>
              </div>
              <div className="about-card">
                <h3>Attach Documentary Evidence</h3>
                <p>Upload photos, videos, and supporting documents to strengthen your complaint.</p>
              </div>
              <div className="about-card">
                <h3>Case Tracking</h3>
                <p>Receive a complaint reference number and check your case status at each review stage.</p>
              </div>
              <div className="about-card">
                <h3>Confidential Intake</h3>
                <p>Only authorized investigators can access your identifying information and evidence.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>© 2026 Mauritius Police Service • Public Complaints Office</p>
          <p>
            <small>
              For immediate emergencies, call 999. This portal is for non-emergency complaints and evidence submission.
            </small>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
