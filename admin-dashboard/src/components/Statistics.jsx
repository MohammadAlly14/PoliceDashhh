import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './Statistics.css';

export default function Statistics() {
  const complaintsByOfficer = [
    { name: 'Officer A', complaints: 5, incidents: 3 },
    { name: 'Officer B', complaints: 2, incidents: 1 },
    { name: 'Officer C', complaints: 8, incidents: 6 },
    { name: 'Officer D', complaints: 3, incidents: 2 },
    { name: 'Officer E', complaints: 6, incidents: 4 },
    { name: 'Officer F', complaints: 1, incidents: 0 },
  ];

  const complaintsByType = [
    { name: 'Use of Force', value: 45 },
    { name: 'Misconduct', value: 32 },
    { name: 'Discrimination', value: 18 },
    { name: 'Excessive Ticketing', value: 14 },
    { name: 'Other', value: 11 },
  ];

  const resolutionStats = [
    { subject: 'Response Time', value: 85 },
    { subject: 'Case Quality', value: 78 },
    { subject: 'Citizen Satisfaction', value: 72 },
    { subject: 'Documentation', value: 88 },
    { subject: 'Investigation Depth', value: 81 },
    { subject: 'Follow-up', value: 65 },
  ];

  const complaintsByDivision = [
    { name: 'North Division', value: 34 },
    { name: 'South Division', value: 28 },
    { name: 'East Division', value: 22 },
    { name: 'Central Division', value: 25 },
    { name: 'West Division', value: 11 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B'];

  return (
    <div className="statistics">
      <h2>📈 Statistical Analysis</h2>

      <div className="stats-grid">
        <div className="stat-card big">
          <h3>Complaints by Officer</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintsByOfficer}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" fill="#8884d8" />
              <Bar dataKey="incidents" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3>Complaint Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complaintsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {complaintsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} cases`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card big">
          <h3>Resolution Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={resolutionStats}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance Score" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3>Complaints by Division</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complaintsByDivision}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
              >
                {complaintsByDivision.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stats-summary">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight">
            <h4>Highest Complaint Rate</h4>
            <p>Officer C leads with 8 complaints. Investigation recommended.</p>
          </div>
          <div className="insight">
            <h4>Most Common Issue</h4>
            <p>Use of Force accounts for 37.5% of all complaints filed.</p>
          </div>
          <div className="insight">
            <h4>Resolution Rating</h4>
            <p>Average resolution score: 78.2%. Documentation needs improvement.</p>
          </div>
          <div className="insight">
            <h4>Division Performance</h4>
            <p>North Division has highest complaint volume (28.3% of total).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
