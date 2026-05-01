import { TrackingPoint } from '../types/movebank';

interface PredictionResult {
  predictedPath: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    probability: number;
  }>;
  confidence: number; // 0-1
  summary: string;
  nextLocation?: { lat: number; lng: number; timestamp: string };
}

interface MovementPattern {
  direction: number; // degrees
  avgSpeed: number; // km/h
  dayTimePrefrence: 'day' | 'night' | 'mixed';
  seasonalTrend: 'north' | 'south' | 'east' | 'west' | 'stable';
}

export function extractMovementPattern(points: TrackingPoint[]): MovementPattern {
  if (points.length < 3) {
    return {
      direction: 0,
      avgSpeed: 0,
      dayTimePrefrence: 'mixed',
      seasonalTrend: 'stable',
    };
  }

  // Calculate average direction
  let totalAngle = 0;
  let speedSum = 0;
  let dayCount = 0;
  let nightCount = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const date = new Date(curr.timestamp);
    const hour = date.getHours();
    
    if (hour >= 6 && hour < 18) dayCount++;
    else nightCount++;

    // Direction calculation (simplified)
    const dLng = curr.lng - prev.lng;
    const dLat = curr.lat - prev.lat;
    const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
    totalAngle += angle;

    // Speed
    const timeDiff = (date.getTime() - new Date(prev.timestamp).getTime()) / 1000 / 3600;
    if (timeDiff > 0) {
      const dist = calculateDistanceSimple(prev.lat, prev.lng, curr.lat, curr.lng);
      speedSum += dist / timeDiff;
    }
  }

  const avgDirection = totalAngle / (points.length - 1);
  const avgSpeed = speedSum / (points.length - 1);
  const dayTimePrefrence = dayCount > nightCount * 1.5 ? 'day' : 
                           nightCount > dayCount * 1.5 ? 'night' : 'mixed';

  // Seasonal trend (check if moving generally north/south/east/west)
  const latDiff = points[points.length - 1].lat - points[0].lat;
  const lngDiff = points[points.length - 1].lng - points[0].lng;
  let seasonalTrend: MovementPattern['seasonalTrend'] = 'stable';
  if (Math.abs(latDiff) > Math.abs(lngDiff)) {
    seasonalTrend = latDiff > 0 ? 'north' : 'south';
  } else {
    seasonalTrend = lngDiff > 0 ? 'east' : 'west';
  }

  return { direction: avgDirection, avgSpeed, dayTimePrefrence, seasonalTrend };
}

function calculateDistanceSimple(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function predictNextLocations(
  points: TrackingPoint[], 
  steps: number = 10,
  hoursAhead: number = 24
): PredictionResult {
  if (points.length < 2) {
    return { predictedPath: [], confidence: 0, summary: 'Insufficient data for prediction' };
  }

  const pattern = extractMovementPattern(points);
  const lastPoint = points[points.length - 1];
  const lastDate = new Date(lastPoint.timestamp);
  const predictions: PredictionResult['predictedPath'] = [];

  // Simple linear extrapolation based on recent movement
  const recentPoints = points.slice(-10); // Last 10 points
  let avgSpeed = pattern.avgSpeed;
  let avgDirection = pattern.direction;

  if (recentPoints.length >= 2) {
    // Calculate recent trend
    const speeds: number[] = [];
    let angleSum = 0;
    for (let i = 1; i < recentPoints.length; i++) {
      const prev = recentPoints[i - 1];
      const curr = recentPoints[i];
      const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000 / 3600;
      if (timeDiff > 0) {
        const dist = calculateDistanceSimple(prev.lat, prev.lng, curr.lat, curr.lng);
        speeds.push(dist / timeDiff);
      }
      const dLng = curr.lng - prev.lng;
      const dLat = curr.lat - prev.lat;
      angleSum += Math.atan2(dLng, dLat) * (180 / Math.PI);
    }
    if (speeds.length > 0) {
      avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    }
    avgDirection = angleSum / (recentPoints.length - 1);
  }

  // Generate predictions
  const timeStep = (hoursAhead * 3600000) / steps; // milliseconds per step
  let currentLat = lastPoint.lat;
  let currentLng = lastPoint.lng;

  for (let i = 1; i <= steps; i++) {
    const distance = (avgSpeed * (timeStep / 3600000)); // km to travel in this step
    const directionRad = avgDirection * (Math.PI / 180);
    
    // Convert distance and direction to lat/lng change
    const latChange = (distance / 111.32) * Math.cos(directionRad); // ~111.32 km per degree lat
    const lngChange = (distance / (111.32 * Math.cos(currentLat * (Math.PI / 180)))) * Math.sin(directionRad);

    currentLat += latChange;
    currentLng += lngChange;

    const predTime = new Date(lastDate.getTime() + (timeStep * i));
    const probability = Math.max(0.3, 1 - (i / steps) * 0.7); // Decreasing confidence over time

    predictions.push({
      lat: currentLat,
      lng: currentLng,
      timestamp: predTime.toISOString(),
      probability,
    });
  }

  const confidence = Math.min(0.9, points.length / 100); // More data = higher confidence
  const nextLocation = predictions[0];

  const summary = `Based on ${points.length} tracking points, this ${pattern.seasonalTrend}ward trending animal ` +
    `is predicted to travel at ~${avgSpeed.toFixed(1)} km/h ` +
    `towards ${degreesToCompass(avgDirection)}. ` +
    `Next location estimated: ${nextLocation?.lat.toFixed(4)}, ${nextLocation?.lng.toFixed(4)} ` +
    `(${confidence * 100}% confidence).`;

  return {
    predictedPath: predictions,
    confidence,
    summary,
    nextLocation,
  };
}

function degreesToCompass(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
  return directions[index];
}

export function generateSmartPredictionSummary(result: PredictionResult): string {
  if (!result.nextLocation) return result.summary;
  
  const parts: string[] = [];
  parts.push(`Predicted movement: ${result.confidence * 100}% confidence`);
  
  if (result.predictedPath.length > 1) {
    const totalDist = calculateDistanceSimple(
      result.predictedPath[0].lat, result.predictedPath[0].lng,
      result.predictedPath[result.predictedPath.length - 1].lat, 
      result.predictedPath[result.predictedPath.length - 1].lng
    );
    parts.push(`Estimated distance in next 24h: ${totalDist.toFixed(1)} km`);
  }
  
  return parts.join('. ') + '.';
}
