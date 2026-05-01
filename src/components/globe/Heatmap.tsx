import * as THREE from 'three';
import { useMemo } from 'react';
import { AnimalTrack } from '../../types/movebank';

interface HeatmapProps {
  tracks: AnimalTrack[];
  intensity?: number; // 0-1, default 0.5
}

export function generateHeatmapData(tracks: AnimalTrack[], resolution: number = 64): Float32Array {
  const data = new Float32Array(resolution * resolution);
  
  tracks.forEach(track => {
    track.points.forEach(point => {
      // Convert lat/lng to grid coordinates
      const x = Math.floor(((point.lng + 180) / 360) * resolution);
      const y = Math.floor(((90 - point.lat) / 180) * resolution);
      
      if (x >= 0 && x < resolution && y >= 0 && y < resolution) {
        data[y * resolution + x] += 1;
      }
    });
  });
  
  // Normalize to 0-1
  const max = Math.max(...data);
  if (max > 0) {
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i] / max;
    }
  }
  
  return data;
}

export function createHeatmapTexture(tracks: AnimalTrack[], resolution: number = 64): THREE.DataTexture {
  const data = generateHeatmapData(tracks, resolution);
  const rgba = new Uint8Array(resolution * resolution * 4);
  
  for (let i = 0; i < data.length; i++) {
    const intensity = data[i];
    const idx = i * 4;
    
    // Color gradient: blue -> green -> yellow -> red
    if (intensity < 0.25) {
      rgba[idx] = 0; // R
      rgba[idx + 1] = intensity * 4 * 255; // G
      rgba[idx + 2] = 255; // B
    } else if (intensity < 0.5) {
      rgba[idx] = 0;
      rgba[idx + 1] = 255;
      rgba[idx + 2] = (1 - (intensity - 0.25) * 4) * 255;
    } else if (intensity < 0.75) {
      rgba[idx] = ((intensity - 0.5) * 4) * 255;
      rgba[idx + 1] = 255;
      rgba[idx + 2] = 0;
    } else {
      rgba[idx] = 255;
      rgba[idx + 1] = (1 - (intensity - 0.75) * 4) * 255;
      rgba[idx + 2] = 0;
    }
    rgba[idx + 3] = intensity * 200; // Alpha
  }
  
  const texture = new THREE.DataTexture(rgba, resolution, resolution, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

export default function Heatmap({ tracks, intensity = 0.5 }: HeatmapProps) {
  const texture = useMemo(() => {
    return createHeatmapTexture(tracks);
  }, [tracks]);

  return (
    <mesh>
      <sphereGeometry args={[1.01, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={intensity * 0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
