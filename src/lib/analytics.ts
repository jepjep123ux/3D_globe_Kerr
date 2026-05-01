import { TrackingPoint } from '../types/movebank';

export interface MovementStats {
  totalDistance: number; // km
  avgSpeed: number; // km/h
  maxSpeed: number; // km/h
  totalDuration: number; // hours
  stopCount: number;
  migrationSegments: Array<{
    start: string;
    end: string;
    distance: number;
    direction: string; // compass direction
  }>;
  behaviorPeriods: Array<{
    type: 'resting' | 'foraging' | 'migrating' | 'nomadic';
    start: string;
    end: string;
    duration: number; // hours
  }>;
}

export interface AnomalyEvent {
  type: 'stop' | 'mortality_risk' | 'erratic_movement' | 'zone_entry';
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  location?: { lat: number; lng: number };
}

const EARTH_RADIUS_KM = 6371;

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

function getCompassDirection(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const dLng = lng2 - lng1;
  const dLat = lat2 - lat1;
  let angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(angle / 22.5) % 16;
  return directions[index];
}

export function analyzeMovement(points: TrackingPoint[]): MovementStats {
  if (points.length < 2) {
    return {
      totalDistance: 0,
      avgSpeed: 0,
      maxSpeed: 0,
      totalDuration: 0,
      stopCount: 0,
      migrationSegments: [],
      behaviorPeriods: [],
    };
  }

  let totalDistance = 0;
  let maxSpeed = 0;
  let stopCount = 0;
  const migrationSegments: MovementStats['migrationSegments'] = [];
  const behaviorPeriods: MovementStats['behaviorPeriods'] = [];
  
  let currentSegment: { start: string; points: TrackingPoint[] } | null = null;
  let currentBehavior: { type: MovementStats['behaviorPeriods'][0]['type']; start: string; points: TrackingPoint[] } | null = null;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    
    const dist = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    totalDistance += dist;
    
    const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000 / 3600; // hours
    const speed = timeDiff > 0 ? dist / timeDiff : 0;
    maxSpeed = Math.max(maxSpeed, speed);
    
    // Detect stops (speed < 0.5 km/h for > 1 hour)
    if (speed < 0.5 && timeDiff > 1) {
      stopCount++;
    }
    
    // Migration segment detection (movement > 50km in consistent direction)
    if (dist > 1) {
      if (!currentSegment) {
        currentSegment = { start: prev.timestamp, points: [prev] };
      }
      currentSegment.points.push(curr);
    } else {
      if (currentSegment && currentSegment.points.length > 10) {
        const startPoint = currentSegment.points[0];
        const endPoint = currentSegment.points[currentSegment.points.length - 1];
        const segDist = calculateDistance(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng);
        if (segDist > 50) {
          migrationSegments.push({
            start: currentSegment.start,
            end: curr.timestamp,
            distance: segDist,
            direction: getCompassDirection(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng),
          });
        }
      }
      currentSegment = null;
    }
    
    // Behavior classification
    const behavior = classifyBehavior(speed, dist, timeDiff);
    if (!currentBehavior || currentBehavior.type !== behavior) {
      if (currentBehavior) {
        const duration = (new Date(curr.timestamp).getTime() - new Date(currentBehavior.start).getTime()) / 1000 / 3600;
        behaviorPeriods.push({
          type: currentBehavior.type,
          start: currentBehavior.start,
          end: curr.timestamp,
          duration,
        });
      }
      currentBehavior = { type: behavior, start: prev.timestamp, points: [prev] };
    }
    currentBehavior.points.push(curr);
  }
  
  // Close last segment/behavior
  if (currentSegment && currentSegment.points.length > 10) {
    const startPoint = currentSegment.points[0];
    const endPoint = currentSegment.points[currentSegment.points.length - 1];
    const segDist = calculateDistance(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng);
    if (segDist > 50) {
      migrationSegments.push({
        start: currentSegment.start,
        end: points[points.length - 1].timestamp,
        distance: segDist,
        direction: getCompassDirection(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng),
      });
    }
  }
  
  if (currentBehavior) {
    const duration = (new Date(points[points.length - 1].timestamp).getTime() - new Date(currentBehavior.start).getTime()) / 1000 / 3600;
    behaviorPeriods.push({
      type: currentBehavior.type,
      start: currentBehavior.start,
      end: points[points.length - 1].timestamp,
      duration,
    });
  }

  const totalDuration = (new Date(points[points.length - 1].timestamp).getTime() - new Date(points[0].timestamp).getTime()) / 1000 / 3600;
  const avgSpeed = totalDuration > 0 ? totalDistance / totalDuration : 0;

  return {
    totalDistance: Math.round(totalDistance * 100) / 100,
    avgSpeed: Math.round(avgSpeed * 100) / 100,
    maxSpeed: Math.round(maxSpeed * 100) / 100,
    totalDuration: Math.round(totalDuration * 100) / 100,
    stopCount,
    migrationSegments,
    behaviorPeriods,
  };
}

function classifyBehavior(speed: number, distance: number, timeDiff: number): MovementStats['behaviorPeriods'][0]['type'] {
  if (speed < 0.5) return 'resting';
  if (speed > 30) return 'migrating';
  if (speed < 5 && distance < 10) return 'foraging';
  if (speed > 10) return 'migrating';
  return 'nomadic';
}

export function detectAnomalies(points: TrackingPoint[]): AnomalyEvent[] {
  const anomalies: AnomalyEvent[] = [];
  
  if (points.length < 2) return anomalies;
  
  // Detect sudden stops (possible mortality)
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000 / 3600;
    const dist = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    const speed = timeDiff > 0 ? dist / timeDiff : 0;
    
    // Animal stopped moving for > 48 hours
    if (speed < 0.1 && timeDiff > 48) {
      anomalies.push({
        type: 'mortality_risk',
        timestamp: curr.timestamp,
        description: `Animal stopped moving for ${Math.round(timeDiff)} hours at this location`,
        severity: 'high',
        location: { lat: curr.lat, lng: curr.lng },
      });
    }
    
    // Erratic movement (speed > 100 km/h - likely GPS error)
    if (speed > 100) {
      anomalies.push({
        type: 'erratic_movement',
        timestamp: curr.timestamp,
        description: `Unusually high speed detected: ${Math.round(speed)} km/h`,
        severity: 'medium',
        location: { lat: curr.lat, lng: curr.lng },
      });
    }
    
    // Large distance jump in short time (> 500km in < 2 hours)
    if (dist > 500 && timeDiff < 2) {
      anomalies.push({
        type: 'erratic_movement',
        timestamp: curr.timestamp,
        description: `Large distance jump: ${Math.round(dist)}km in ${Math.round(timeDiff * 60)} minutes`,
        severity: 'medium',
        location: { lat: curr.lat, lng: curr.lng },
      });
    }
  }
  
  return anomalies;
}

export function generateSmartSummary(stats: MovementStats, species?: string): string {
  const parts: string[] = [];
  
  if (stats.totalDistance > 0) {
    parts.push(`This ${species || 'animal'} traveled ${stats.totalDistance} km over ${stats.totalDuration} hours`);
  }
  
  if (stats.avgSpeed > 0) {
    parts.push(`with an average speed of ${stats.avgSpeed} km/h`);
  }
  
  if (stats.migrationSegments.length > 0) {
    const totalMig = stats.migrationSegments.reduce((sum, s) => sum + s.distance, 0);
    parts.push(`and completed ${stats.migrationSegments.length} migration segment(s) covering ${Math.round(totalMig)} km`);
  }
  
  if (stats.stopCount > 0) {
    parts.push(`Made ${stats.stopCount} significant stops during the journey`);
  }
  
  const behaviorCounts = stats.behaviorPeriods.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + p.duration;
    return acc;
  }, {} as Record<string, number>);
  
  const mainBehavior = Object.entries(behaviorCounts).sort((a, b) => b[1] - a[1])[0];
  if (mainBehavior) {
    parts.push(`Primary behavior: ${mainBehavior[0]} (${Math.round(mainBehavior[1])} hours)`);
  }
  
  return parts.join(', ') + '.';
}
