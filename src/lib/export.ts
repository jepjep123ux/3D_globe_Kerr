import { AnimalTrack, TrackingPoint } from '../types/movebank';

export function exportToCSV(tracks: AnimalTrack[], filename: string = 'wildlife-data.csv') {
  const allPoints: Array<{
    animalId: string;
    animalName: string;
    species: string;
    timestamp: string;
    lat: number;
    lng: number;
    speed?: number;
    heading?: number;
    altitude?: number;
    temperature?: number;
  }> = [];

  tracks.forEach(track => {
    track.points.forEach(point => {
      allPoints.push({
        animalId: track.animalId,
        animalName: track.animalName,
        species: track.species || 'unknown',
        timestamp: point.timestamp,
        lat: point.lat,
        lng: point.lng,
        speed: point.speed,
        heading: point.heading,
        altitude: point.altitude,
        temperature: point.temperature,
      });
    });
  });

  const headers = ['animalId', 'animalName', 'species', 'timestamp', 'lat', 'lng', 'speed', 'heading', 'altitude', 'temperature'];
  const csvRows = [
    headers.join(','),
    ...allPoints.map(p => 
      headers.map(h => JSON.stringify((p as any)[h] ?? '')).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportToJSON(tracks: AnimalTrack[], filename: string = 'wildlife-data.json') {
  const data = tracks.map(track => ({
    animalId: track.animalId,
    animalName: track.animalName,
    species: track.species,
    color: track.color,
    pointCount: track.points.length,
    points: track.points.map(p => ({
      timestamp: p.timestamp,
      coordinates: [p.lng, p.lat],
      speed: p.speed,
      heading: p.heading,
      altitude: p.altitude,
      temperature: p.temperature,
    }))
  }));

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

export function exportToGeoJSON(tracks: AnimalTrack[], filename: string = 'wildlife-data.geojson') {
  const features = tracks.map(track => {
    const coordinates = track.points.map(p => [p.lng, p.lat, p.altitude || 0]);
    const speeds = track.points.map(p => p.speed).filter(Boolean) as number[];
    const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;

    return {
      type: 'Feature',
      properties: {
        animalId: track.animalId,
        animalName: track.animalName,
        species: track.species,
        color: track.color,
        pointCount: track.points.length,
        avgSpeed: Math.round(avgSpeed * 100) / 100,
        timeRange: {
          start: track.points[0]?.timestamp,
          end: track.points[track.points.length - 1]?.timestamp,
        }
      },
      geometry: {
        type: 'LineString',
        coordinates,
      }
    };
  });

  const geojson = {
    type: 'FeatureCollection',
    features,
  };

  const geojsonContent = JSON.stringify(geojson, null, 2);
  downloadFile(geojsonContent, filename, 'application/geo+json');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
