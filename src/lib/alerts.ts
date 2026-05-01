import { TrackingPoint } from '../types/movebank';
import { MovementStats, detectAnomalies, AnomalyEvent } from './analytics';

export interface AlertRule {
  id: string;
  type: 'stop' | 'mortality_risk' | 'zone_entry' | 'speed_limit' | 'battery_low';
  enabled: boolean;
  severity: 'low' | 'medium' | 'high';
  message: string;
  threshold?: number; // For speed limits, etc.
}

export interface ActiveAlert {
  id: string;
  ruleId: string;
  animalId: string;
  animalName: string;
  timestamp: string;
  type: AlertRule['type'];
  severity: AlertRule['severity'];
  message: string;
  location?: { lat: number; lng: number };
  isRead: boolean;
}

// Default alert rules
export const DEFAULT_RULES: AlertRule[] = [
  {
    id: 'stop-alert',
    type: 'stop',
    enabled: true,
    severity: 'medium',
    message: 'Animal has stopped moving for > 48 hours',
    threshold: 48, // hours
  },
  {
    id: 'mortality-alert',
    type: 'mortality_risk',
    enabled: true,
    severity: 'high',
    message: 'Possible mortality detected - no movement for > 72 hours',
    threshold: 72,
  },
  {
    id: 'speed-alert',
    type: 'speed_limit',
    enabled: true,
    severity: 'low',
    message: 'Animal moving at unusually high speed',
    threshold: 100, // km/h
  },
  {
    id: 'battery-alert',
    type: 'battery_low',
    enabled: false,
    severity: 'low',
    message: 'Device battery low (simulated)',
  },
];

// Storage keys
const RULES_KEY = 'movebank-alert-rules';
const ALERTS_KEY = 'movebank-active-alerts';

// Load/Save rules
export function loadAlertRules(): AlertRule[] {
  if (typeof window === 'undefined') return DEFAULT_RULES;
  const stored = localStorage.getItem(RULES_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_RULES;
}

export function saveAlertRules(rules: AlertRule[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RULES_KEY, JSON.stringify(rules));
}

// Load/Save alerts
export function loadAlerts(): ActiveAlert[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ALERTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveAlerts(alerts: ActiveAlert[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

// Check a track for alerts
export function checkAlerts(
  track: { animalId: string; animalName: string; points: TrackingPoint[] },
  rules: AlertRule[]
): ActiveAlert[] {
  const alerts: ActiveAlert[] = [];
  const anomalies: AnomalyEvent[] = detectAnomalies(track.points);

  rules.forEach(rule => {
    if (!rule.enabled) return;

    if (rule.type === 'stop' || rule.type === 'mortality_risk') {
      // Check for long stops
      const thresholdHours = rule.threshold || (rule.type === 'stop' ? 48 : 72);
      anomalies.forEach(anomaly => {
        if (anomaly.type === 'stop' && anomaly.severity === 'high') {
          const hours = parseInt(anomaly.description.match(/\d+/)?.[0] || '0');
          if (hours >= thresholdHours) {
            alerts.push({
              id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              ruleId: rule.id,
              animalId: track.animalId,
              animalName: track.animalName,
              timestamp: anomaly.timestamp,
              type: rule.type,
              severity: rule.severity,
              message: `${rule.message} (${hours} hours)`,
              location: anomaly.location,
              isRead: false,
            });
          }
        }
      });
    }

    if (rule.type === 'speed_limit') {
      anomalies.forEach(anomaly => {
        if (anomaly.type === 'erratic_movement' && anomaly.description.includes('speed')) {
          alerts.push({
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            ruleId: rule.id,
            animalId: track.animalId,
            animalName: track.animalName,
            timestamp: anomaly.timestamp,
            type: rule.type,
            severity: rule.severity,
            message: anomaly.description,
            location: anomaly.location,
            isRead: false,
          });
        }
      });
    }
  });

  return alerts;
}

// Mark alert as read
export function markAlertRead(alertId: string): void {
  const alerts = loadAlerts();
  const updated = alerts.map(a => a.id === alertId ? { ...a, isRead: true } : a);
  saveAlerts(updated);
}

// Clear all alerts
export function clearAlerts(): void {
  saveAlerts([]);
}

// Get unread count
export function getUnreadCount(): number {
  const alerts = loadAlerts();
  return alerts.filter(a => !a.isRead).length;
}
