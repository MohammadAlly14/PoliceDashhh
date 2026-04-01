import { io } from 'socket.io-client';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const realtimeUrl = apiUrl.replace(/\/api\/?$/, '');

export function connectRealtime() {
  return io(realtimeUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
  });
}

export function formatRealtimeEvent(eventName, payload) {
  switch (eventName) {
    case 'complaint:submitted':
      return {
        id: `${eventName}-${payload.complaintId}-${payload.emittedAt}`,
        badge: 'NEW',
        badgeClass: 'new',
        title: `Complaint #${payload.complaintId} submitted`,
        detail: payload.location ? `Location: ${payload.location}` : 'New complaint received from public portal',
        timestamp: payload.emittedAt,
      };
    case 'complaint:status-updated':
      return {
        id: `${eventName}-${payload.complaintId}-${payload.emittedAt}`,
        badge: 'UPDATE',
        badgeClass: 'pending',
        title: `Complaint #${payload.complaintId} moved to ${String(payload.status || '').replace('_', ' ')}`,
        detail: payload.findings || 'Investigation record updated by admin staff',
        timestamp: payload.emittedAt,
      };
    case 'incident:created':
      return {
        id: `${eventName}-${payload.incidentId}-${payload.emittedAt}`,
        badge: 'LIVE',
        badgeClass: 'live',
        title: `Incident #${payload.incidentId} created`,
        detail: payload.location ? `Operational area: ${payload.location}` : 'New field incident logged',
        timestamp: payload.emittedAt,
      };
    case 'incident:flagged':
      return {
        id: `${eventName}-${payload.incidentId}-${payload.emittedAt}`,
        badge: 'FLAG',
        badgeClass: 'alert',
        title: `Incident #${payload.incidentId} flagged for review`,
        detail: payload.flaggedReason || 'Escalated for command review',
        timestamp: payload.emittedAt,
      };
    case 'incident:distress':
      return {
        id: `${eventName}-${payload.incidentId}-${payload.emittedAt}`,
        badge: 'DISTRESS',
        badgeClass: `alert distress-${payload.distressLevel}`,
        title: `🚨 OFFICER DISTRESS ALERT (${String(payload.distressLevel).toUpperCase()})`,
        detail: `Constable in ${payload.distressLevel} distress at ${payload.location || 'unknown location'}. Coordinates: ${payload.latitude ? `${payload.latitude.toFixed(4)}, ${payload.longitude.toFixed(4)}` : 'GPS awaiting'}`,
        timestamp: payload.emittedAt,
      };
    case 'incident:location-update':
      return {
        id: `${eventName}-${payload.incidentId}-${payload.emittedAt}`,
        badge: 'GPS',
        badgeClass: 'live',
        title: `Location update for distress incident #${payload.incidentId}`,
        detail: `New coordinates: ${payload.latitude.toFixed(4)}, ${payload.longitude.toFixed(4)} at ${payload.location}`,
        timestamp: payload.emittedAt,
      };
    case 'incident:acknowledged':
      return {
        id: `${eventName}-${payload.incidentId}-${payload.emittedAt}`,
        badge: 'ACK',
        badgeClass: 'new',
        title: `Distress incident #${payload.incidentId} acknowledged`,
        detail: `Responding unit: ${payload.respondingUnit || 'en route'}. Command acknowledged at ${new Date(payload.acknowledgedAt).toLocaleTimeString()}`,
        timestamp: payload.emittedAt,
      };
    default:
      return null;
  }
}
