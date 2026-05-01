import { AnimalTrack } from '../../types/movebank';
import { analyzeMovement, MovementStats } from '../../lib/analytics';

interface ComparisonProps {
  tracks: AnimalTrack[];
}

export default function ComparisonPanel({ tracks }: ComparisonProps) {
  if (tracks.length < 2) return null;

  const statsArray: Array<{ track: AnimalTrack; stats: MovementStats }> = tracks.map(track => ({
    track,
    stats: analyzeMovement(track.points),
  }));

  const maxDistance = Math.max(...statsArray.map(s => s.stats.totalDistance));
  const maxSpeed = Math.max(...statsArray.map(s => s.stats.maxSpeed));
  const maxDuration = Math.max(...statsArray.map(s => s.stats.totalDuration));

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-blue-400">Comparative Analysis ({tracks.length} animals)</h4>
      
      {/* Distance Comparison */}
      <div>
        <div className="text-xs text-gray-400 mb-2">Total Distance (km)</div>
        <div className="space-y-1">
          {statsArray
            .sort((a, b) => b.stats.totalDistance - a.stats.totalDistance)
            .map(({ track, stats }) => (
              <div key={track.animalId} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="truncate flex-1 mr-2">{track.animalName}</span>
                  <span className="text-blue-400 font-bold">{stats.totalDistance} km</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: track.color,
                      width: `${maxDistance > 0 ? (stats.totalDistance / maxDistance) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Speed Comparison */}
      <div>
        <div className="text-xs text-gray-400 mb-2">Max Speed (km/h)</div>
        <div className="space-y-1">
          {statsArray
            .sort((a, b) => b.stats.maxSpeed - a.stats.maxSpeed)
            .map(({ track, stats }) => (
              <div key={track.animalId} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="truncate flex-1 mr-2">{track.animalName}</span>
                  <span className="text-yellow-400 font-bold">{stats.maxSpeed} km/h</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: track.color,
                      width: `${maxSpeed > 0 ? (stats.maxSpeed / maxSpeed) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Duration Comparison */}
      <div>
        <div className="text-xs text-gray-400 mb-2">Tracking Duration (hours)</div>
        <div className="space-y-1">
          {statsArray
            .sort((a, b) => b.stats.totalDuration - a.stats.totalDuration)
            .map(({ track, stats }) => (
              <div key={track.animalId} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="truncate flex-1 mr-2">{track.animalName}</span>
                  <span className="text-purple-400 font-bold">{stats.totalDuration}h</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: track.color,
                      width: `${maxDuration > 0 ? (stats.totalDuration / maxDuration) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Behavior Comparison Table */}
      <div>
        <div className="text-xs text-gray-400 mb-2">Behavior Distribution</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left font-normal">Animal</th>
                <th className="text-right font-normal">Resting</th>
                <th className="text-right font-normal">Foraging</th>
                <th className="text-right font-normal">Migrating</th>
              </tr>
            </thead>
            <tbody>
              {statsArray.map(({ track, stats }) => {
                const behaviorCounts = stats.behaviorPeriods.reduce((acc, p) => {
                  acc[p.type] = (acc[p.type] || 0) + p.duration;
                  return acc;
                }, {} as Record<string, number>);
                const total = Object.values(behaviorCounts).reduce((a, b) => a + b, 0);

                return (
                  <tr key={track.animalId} className="border-t border-white/5">
                    <td className="py-1 truncate max-w-[100px]">
                      <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: track.color }} />
                      {track.animalName}
                    </td>
                    <td className="text-right text-blue-400">
                      {behaviorCounts['resting'] ? Math.round((behaviorCounts['resting'] / total) * 100) : 0}%
                    </td>
                    <td className="text-right text-green-400">
                      {behaviorCounts['foraging'] ? Math.round((behaviorCounts['foraging'] / total) * 100) : 0}%
                    </td>
                    <td className="text-right text-yellow-400">
                      {behaviorCounts['migrating'] ? Math.round((behaviorCounts['migrating'] / total) * 100) : 0}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/5 p-2 rounded text-xs text-gray-300">
        <div className="font-bold text-white mb-1">Summary</div>
        <div>Fastest: {statsArray.sort((a, b) => b.stats.maxSpeed - a.stats.maxSpeed)[0]?.track.animalName} ({maxSpeed} km/h)</div>
        <div>Longest distance: {statsArray.sort((a, b) => b.stats.totalDistance - a.stats.totalDistance)[0]?.track.animalName} ({maxDistance} km)</div>
        <div>Most active: {statsArray.sort((a, b) => b.stats.totalDuration - a.stats.totalDuration)[0]?.track.animalName} ({maxDuration}h)</div>
      </div>
    </div>
  );
}
