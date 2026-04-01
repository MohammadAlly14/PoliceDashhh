import React, { useState } from 'react';
import './Reports.css';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    {
      id: 1,
      title: 'Monthly Accountability Report - March 2024',
      type: 'Monthly',
      date: '2024-03-31',
      status: 'Published',
      description: 'Comprehensive review of all complaints and incidents for the month of March 2024.',
      highlights: [
        'Total Complaints: 120',
        'Total Incidents: 73',
        'Resolved Cases: 45',
        'Pending Cases: 28',
        'Average Resolution Time: 12 days',
      ],
    },
    {
      id: 2,
      title: 'Use of Force Incident Analysis',
      type: 'Thematic',
      date: '2024-03-15',
      status: 'Published',
      description: 'In-depth analysis of all use of force incidents reported in Q1 2024.',
      highlights: [
        'Total Use of Force Cases: 45',
        'Percentage of Complaints: 37.5%',
        'Most Common Location: Central District',
        'Average Officer Experience: 8.5 years',
        'Injury Rate: 12%',
      ],
    },
    {
      id: 3,
      title: 'Officer Performance Review - Quarter 1',
      type: 'Performance',
      date: '2024-03-10',
      status: 'Published',
      description: 'Individual officer performance metrics for the first quarter of 2024.',
      highlights: [
        'Officers Reviewed: 287',
        'High Performers (Score >8.5): 142',
        'Flagged for Review: 5',
        'Training Recommended: 18',
        'Average Performance Score: 7.8/10',
      ],
    },
    {
      id: 4,
      title: 'Community Feedback Summary',
      type: 'Community',
      date: '2024-03-05',
      status: 'Draft',
      description: 'Summary of community feedback and citizen satisfaction surveys.',
      highlights: [
        'Response Rate: 2,847 surveys',
        'Satisfaction Score: 72%',
        'Top Concern: Response Time',
        'Most Praised: Professionalism',
        'Recommendations: 34 unique suggestions',
      ],
    },
    {
      id: 5,
      title: 'Training & Development Report',
      type: 'Training',
      date: '2024-02-28',
      status: 'Published',
      description: 'Overview of officer training and professional development programs.',
      highlights: [
        'Officers Trained: 156',
        'De-escalation Training: 89 officers',
        'Diversity & Inclusion: 67 officers',
        'Community Relations: 45 officers',
        'Completion Rate: 96%',
      ],
    },
    {
      id: 6,
      title: 'Disciplinary Actions Summary',
      type: 'Disciplinary',
      date: '2024-02-15',
      status: 'Published',
      description: 'Summary of disciplinary actions taken in Q1 2024.',
      highlights: [
        'Total Actions: 12',
        'Suspensions: 3',
        'Written Warnings: 7',
        'Retraining Required: 2',
        'Most Common Violation: Excessive Force',
      ],
    },
  ];

  const reportTypes = ['All', 'Monthly', 'Thematic', 'Performance', 'Community', 'Training', 'Disciplinary'];

  return (
    <div className="reports">
      <h2>📄 Reports & Documents</h2>

      <div className="reports-container">
        <div className="reports-list">
          <div className="report-filters">
            <h3>Filter Reports</h3>
            {reportTypes.map((type) => (
              <button
                key={type}
                className="filter-btn"
                style={{
                  background: type === 'All' ? '#003d5c' : 'transparent',
                  color: type === 'All' ? 'white' : '#003d5c',
                }}
                onClick={() => setSelectedReport(null)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="reports-entries">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`report-entry ${report.status.toLowerCase()}`}
                onClick={() => setSelectedReport(report)}
                style={{
                  borderLeft: selectedReport?.id === report.id ? '4px solid #003d5c' : '4px solid #ddd',
                  background: selectedReport?.id === report.id ? '#f0f8ff' : 'white',
                }}
              >
                <div className="report-header">
                  <h4>{report.title}</h4>
                  <span className={`report-status ${report.status.toLowerCase()}`}>{report.status}</span>
                </div>
                <div className="report-meta">
                  <span className="report-type">{report.type}</span>
                  <span className="report-date">{new Date(report.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedReport && (
          <div className="report-details">
            <h3>{selectedReport.title}</h3>
            <div className="details-info">
              <div className="info-row">
                <strong>Type:</strong> {selectedReport.type}
              </div>
              <div className="info-row">
                <strong>Date:</strong> {new Date(selectedReport.date).toLocaleDateString()}
              </div>
              <div className="info-row">
                <strong>Status:</strong> <span className={`badge ${selectedReport.status.toLowerCase()}`}>{selectedReport.status}</span>
              </div>
            </div>

            <div className="details-description">
              <h4>Description</h4>
              <p>{selectedReport.description}</p>
            </div>

            <div className="details-highlights">
              <h4>Key Highlights</h4>
              <ul>
                {selectedReport.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className="report-actions">
              <button className="btn btn-primary">📥 Download PDF</button>
              <button className="btn btn-secondary">🖨️ Print</button>
              <button className="btn btn-secondary">📧 Email</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
