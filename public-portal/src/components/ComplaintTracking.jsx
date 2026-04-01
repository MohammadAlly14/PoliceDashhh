import React, { useEffect, useState } from 'react';
import { complaintsApi } from '../services/api';
import './ComplaintTracking.css';

export default function ComplaintTracking() {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);

  const fetchComplaintStatus = async (id, { silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const response = await complaintsApi.getComplaintStatus(id);
      setComplaint(response.data);
      setLastCheckedAt(new Date());
      return response.data;
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setComplaint(null);

    if (!complaintId.trim()) {
      setError('Please enter a Complaint ID');
      return;
    }

    try {
      await fetchComplaintStatus(complaintId);
    } catch (err) {
      setError('Complaint not found. Please check your Complaint ID.');
    } finally {
      setIsAutoRefreshing(false);
    }
  };

  useEffect(() => {
    if (!complaint?.id) {
      return undefined;
    }

    setIsAutoRefreshing(true);

    const intervalId = window.setInterval(async () => {
      try {
        await fetchComplaintStatus(complaint.id, { silent: true });
      } catch (err) {
        setIsAutoRefreshing(false);
      }
    }, 15000);

    return () => {
      setIsAutoRefreshing(false);
      window.clearInterval(intervalId);
    };
  }, [complaint?.id]);

  const getStatusStep = (status) => {
    const steps = {
      submitted: 1,
      under_review: 2,
      resolved: 3,
      closed: 4,
    };
    return steps[status] || 0;
  };

  const currentStep = complaint ? getStatusStep(complaint.status) : 0;

  return (
    <div className="complaint-tracking-container">
      <h2>🔍 Track Your Complaint</h2>
      <p className="tracking-description">
        Enter your Complaint ID to check the status of your complaint and view any findings.
      </p>

      <form onSubmit={handleSearch} className="tracking-form">
        <div className="search-group">
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Enter your Complaint ID"
            className="search-input"
          />
          <button type="submit" disabled={loading} className="btn-search">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {complaint && (
        <div className="complaint-status">
          <h3>Complaint Status</h3>
          <div className="tracking-meta">
            <span className={`tracking-pill ${isAutoRefreshing ? 'live' : ''}`}>
              {isAutoRefreshing ? 'Auto-refreshing every 15 seconds' : 'Auto-refresh paused'}
            </span>
            {lastCheckedAt && <span className="tracking-last-checked">Last checked: {lastCheckedAt.toLocaleTimeString()}</span>}
          </div>

          <div className="status-timeline">
            <div className={`timeline-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="timeline-dot">1</div>
              <div className="timeline-label">Submitted</div>
            </div>
            <div className={`timeline-connector ${currentStep >= 2 ? 'active' : ''}`} />
            <div className={`timeline-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="timeline-dot">2</div>
              <div className="timeline-label">Under Review</div>
            </div>
            <div className={`timeline-connector ${currentStep >= 3 ? 'active' : ''}`} />
            <div className={`timeline-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="timeline-dot">3</div>
              <div className="timeline-label">Resolved</div>
            </div>
            <div className={`timeline-connector ${currentStep >= 4 ? 'active' : ''}`} />
            <div className={`timeline-step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="timeline-dot">4</div>
              <div className="timeline-label">Closed</div>
            </div>
          </div>

          <div className="status-details">
            <div className="detail-row">
              <span className="label">Complaint ID:</span>
              <span className="value">{complaint.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Current Status:</span>
              <span className={`value status-badge ${complaint.status}`}>
                {complaint.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Last Updated:</span>
              <span className="value">{new Date(complaint.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          {complaint.findings && (
            <div className="findings-section">
              <h4>Investigation Findings</h4>
              <div className="findings-content">{complaint.findings}</div>
            </div>
          )}

          <div className="info-box">
            <p>
              <strong>Need Help?</strong> If you have questions about your complaint, please contact us at accountability@police.mu
            </p>
          </div>
        </div>
      )}

      {!complaint && !error && (
        <div className="placeholder">
          <p>Enter your Complaint ID above to view the status and any investigation findings.</p>
        </div>
      )}
    </div>
  );
}
