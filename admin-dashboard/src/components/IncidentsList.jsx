import React, { useState } from 'react';
import './IncidentsList.css';

export default function IncidentsList() {
  const [incidents] = useState([
    { id: 1, date: '2024-03-28', officer: 'Officer A', badge: 'A-001', location: 'Downtown Station', type: 'Use of Force', description: 'Reported excessive force during traffic stop', status: 'flagged', severity: 'high', details: 'Witness reported officer used unnecessary force during vehicle search.' },
    { id: 2, date: '2024-03-27', officer: 'Officer B', badge: 'A-002', location: 'Central District', type: 'Misconduct', description: 'Alleged officer misconduct during arrest', status: 'active', severity: 'medium', details: 'Complaint filed regarding unprofessional language.' },
    { id: 3, date: '2024-03-26', officer: 'Officer C', badge: 'A-003', location: 'North Precinct', type: 'Use of Force', description: 'Physical altercation with suspect', status: 'active', severity: 'high', details: 'Officer used control techniques to restrain resisting suspect.' },
    { id: 4, date: '2024-03-25', officer: 'Officer D', badge: 'A-004', location: 'South Division', type: 'Discrimination', description: 'Alleged discriminatory conduct', status: 'resolved', severity: 'medium', details: 'Investigation completed - no substantiated violations found.' },
    { id: 5, date: '2024-03-24', officer: 'Officer E', badge: 'A-005', location: 'Central Station', type: 'Excessive Ticketing', description: 'Multiple citations issued in single stop', status: 'active', severity: 'low', details: 'Citizen contested multiple traffic citations.' },
    { id: 6, date: '2024-03-23', officer: 'Officer A', badge: 'A-001', location: 'Broadway', type: 'Misconduct', description: 'Officer conduct complaint', status: 'active', severity: 'medium', details: 'Complaint regarding officer response time.' },
  ]);

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredIncidents = incidents.filter((incident) => {
    const typeMatch = filterType === 'all' || incident.type === filterType;
    const statusMatch = filterStatus === 'all' || incident.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || incident.severity === filterSeverity;
    return typeMatch && statusMatch && severityMatch;
  });

  const getSeverityColor = (severity) => {
    const colors = {
      high: '#ff7c7c',
      medium: '#ffc658',
      low: '#82ca9d',
    };
    return colors[severity] || '#999';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: '🔵 Active',
      flagged: '🚩 Flagged',
      resolved: '✅ Resolved',
      closed: '⚫ Closed',
    };
    return labels[status] || status;
  };

  return (
    <div className="incidents-list">
      <h2>📹 Incidents & Footage</h2>

      <div className="incidents-container">
        <div className="incidents-filters">
          <h3>Filters & Search</h3>

          <div className="filter-group">
            <label>Incident Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="Use of Force">Use of Force</option>
              <option value="Misconduct">Misconduct</option>
              <option value="Discrimination">Discrimination</option>
              <option value="Excessive Ticketing">Excessive Ticketing</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="flagged">Flagged</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Severity</label>
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-stats">
            <p><strong>{filteredIncidents.length}</strong> incidents match</p>
            <p><strong>{incidents.filter((i) => i.status === 'flagged').length}</strong> flagged</p>
            <p><strong>{incidents.filter((i) => i.severity === 'high').length}</strong> high severity</p>
          </div>
        </div>

        <div className="incidents-content">
          <div className="incidents-view">
            {filteredIncidents.length === 0 ? (
              <div className="no-results">No incidents match your filters.</div>
            ) : (
              filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`incident-card ${selectedIncident?.id === incident.id ? 'selected' : ''}`}
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className="incident-header">
                    <div className="incident-title">
                      <h4>{incident.type}</h4>
                      <p className="incident-date">{new Date(incident.date).toLocaleDateString()}</p>
                    </div>
                    <div className="incident-badges">
                      <span className="severity" style={{ background: getSeverityColor(incident.severity) }}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className="status">{getStatusLabel(incident.status)}</span>
                    </div>
                  </div>
                  <div className="incident-meta">
                    <span><strong>Officer:</strong> {incident.officer}</span>
                    <span><strong>Location:</strong> {incident.location}</span>
                  </div>
                  <p className="incident-description">{incident.description}</p>
                </div>
              ))
            )}
          </div>

          {selectedIncident && (
            <div className="incident-details">
              <h3>{selectedIncident.type}</h3>

              <div className="detail-section">
                <h4>Incident Information</h4>
                <div className="detail-row">
                  <span className="label">Date & Time:</span>
                  <span className="value">{new Date(selectedIncident.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span className="value">{selectedIncident.location}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Incident ID:</span>
                  <span className="value">#{selectedIncident.id.toString().padStart(5, '0')}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Officer Information</h4>
                <div className="detail-row">
                  <span className="label">Officer Name:</span>
                  <span className="value">{selectedIncident.officer}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Badge Number:</span>
                  <span className="value">{selectedIncident.badge}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Incident Details</h4>
                <p className="incident-description-full">{selectedIncident.details}</p>
              </div>

              <div className="detail-section">
                <h4>Status & Severity</h4>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className="value">{getStatusLabel(selectedIncident.status)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Severity:</span>
                  <span className="value" style={{ background: getSeverityColor(selectedIncident.severity), color: 'white', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                    {selectedIncident.severity.toUpperCase()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Type:</span>
                  <span className="value">{selectedIncident.type}</span>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn btn-primary">📹 View Footage</button>
                <button className="btn btn-secondary">📝 Add Notes</button>
                <button className="btn btn-secondary">🚩 Flag for Review</button>
                <button className="btn btn-secondary">� Generate Report</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
