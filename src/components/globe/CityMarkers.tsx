import * as THREE from 'three';
import { useMemo } from 'react';
import { Line, Html } from '@react-three/drei';

interface City {
  name: string;
  lat: number;
  lng: number;
  population?: number;
}

interface CityMarkersProps {
  cities: City[];
  selectedAnimal?: string | null;
}

function latLngToVector3(lat: number, lng: number, radius: number = 1.02): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function CityMarkers({ cities, selectedAnimal }: CityMarkersProps) {
  const cityPoints = useMemo(() =>
    cities.map(city => ({
      ...city,
      position: latLngToVector3(city.lat, city.lng),
    })),
    [cities]
  );

  // Create lines between cities
  const connectionLines = useMemo(() => {
    const lines: Array<{ start: THREE.Vector3; end: THREE.Vector3 }> = [];
    for (let i = 0; i < cityPoints.length; i++) {
      for (let j = i + 1; j < cityPoints.length; j++) {
        lines.push({
          start: cityPoints[i].position,
          end: cityPoints[j].position,
        });
      }
    }
    return lines;
  }, [cityPoints]);

  return (
    <group>
      {/* Connection lines between cities */}
      {connectionLines.map((line, idx) => (
        <Line
          key={`connection-${idx}`}
          points={[line.start, line.end]}
          color="#ffffff"
          lineWidth={0.5}
          transparent
          opacity={0.15}
          dashed
          dashSize={0.5}
          gapSize={0.5}
        />
      ))}

      {/* City markers */}
      {cityPoints.map((city, idx) => {
        const size = Math.max(0.02, Math.min(0.08, (city.population || 1000000) / 50000000));
        const intensity = selectedAnimal ? 0.3 : 0.8;
        
        return (
          <mesh key={`city-${idx}`} position={city.position}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffaa00"
              emissiveIntensity={intensity * 2}
              transparent
              opacity={intensity}
            />
            {/* City name label */}
            <Html
              position={[0, size + 0.02, 0]}
              center
              distanceFactor={15}
              style={{ pointerEvents: 'none' }}
            >
              <div style={{
                color: '#ffff00',
                fontSize: '8px',
                whiteSpace: 'nowrap',
                textShadow: '0 0 4px rgba(255,255,0,0.8)',
                fontWeight: city.population && city.population > 10000000 ? 'bold' : 'normal',
              }}>
                {city.name}
                {city.population && (
                  <div style={{ fontSize: '6px', opacity: 0.7 }}>
                    {(city.population / 1000000).toFixed(1)}M
                  </div>
                )}
              </div>
            </Html>
          </mesh>
        );
      })}
    </group>
  );
}
