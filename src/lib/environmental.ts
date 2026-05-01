// Simple environmental data service (placeholder for API integration)
export interface WeatherData {
  timestamp: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  windDirection?: number;
  condition?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface EnvironmentalOverlay {
  type: 'temperature' | 'humidity' | 'wind' | 'terrain';
  data: WeatherData[];
  visible: boolean;
}

// Placeholder function to fetch weather data for a location
export async function fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
  // In production, integrate with OpenWeatherMap API or similar
  // For now, return mock data
  return {
    timestamp: new Date().toISOString(),
    temperature: 20 + Math.random() * 10,
    humidity: 50 + Math.random() * 40,
    windSpeed: 5 + Math.random() * 15,
    condition: ['Clear', 'Cloudy', 'Rain'][Math.floor(Math.random() * 3)],
    location: { lat, lng },
  };
}

// Calculate simple terrain type based on coordinates
export function getTerrainType(lat: number, lng: number): string {
  const absLat = Math.abs(lat);
  
  if (absLat > 66.5) return 'Polar';
  if (absLat > 23.5) return 'Temperate';
  return 'Tropical';
}

interface TrackSummary {
  points: Array<{ lat: number; lng: number }>;
}

export function getEnvironmentalSummary(tracks: TrackSummary[]): string {
  const allPoints = tracks.flatMap(t => t.points);
  if (allPoints.length === 0) return 'No data available';
  
  const latitudes = allPoints.map(p => p.lat);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  
  const terrainTypes = new Set(allPoints.map(p => getTerrainType(p.lat, p.lng)));
  
  return `Animals tracked across ${terrainTypes.size} terrain type(s): ${Array.from(terrainTypes).join(', ')}. ` +
    `Latitude range: ${minLat.toFixed(2)}° to ${maxLat.toFixed(2)}°`;
}
