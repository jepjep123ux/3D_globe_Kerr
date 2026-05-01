import { AnimalTrack, TrackingPoint } from '../../types/movebank';
import { analyzeMovement, MovementStats } from '../../lib/analytics';

interface ChartsProps {
  track: AnimalTrack | null;
  playbackProgress: number;
}

export default function Charts({ track, playbackProgress }: ChartsProps) {
  if (!track || track.points.length === 0) return null;

  const visiblePoints = track.points.slice(0, Math.floor(track.points.length * playbackProgress));
  const stats: MovementStats = analyzeMovement(visiblePoints);

  // Prepare data for charts
  const timeLabels = visiblePoints.map((p, i) => {
    const d = new Date(p.timestamp);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const distances = visiblePoints.map((p, i) => {
    if (i === 0) return 0;
    // Cumulative distance approximation
    return 0; // Placeholder - would need full calc
  });

  const speeds = visiblePoints.map(p => p.speed || 0);

  // Activity pie data
  const behaviorCounts = stats.behaviorPeriods.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + p.duration;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(behaviorCounts).map(([type, duration]) => ({
    type,
    duration,
    color: type === 'resting' ? '#3b82f6' :
           type === 'foraging' ? '#22c55e' :
           type === 'migrating' ? '#eab308' : '#a855f7'
  }));

  const totalDuration = pieData.reduce((sum, d) => sum + d.duration, 0);

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-blue-300 mb-2">Speed Over Time</h4>
        <div className="bg-white/5 rounded p-2 h-32">
          <svg viewBox="0 0 300 100" className="w-full h-full">
            {speeds.length > 1 && (
              <polyline
                points={speeds.map((s, i) => {
                  const x = (i / (speeds.length - 1)) * 280 + 10;
                  const y = 90 - (s / Math.max(...speeds) * 80);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
              />
            )}
            {/* Axes */}
            <line x1="10" y1="90" x2="290" y2="90" stroke="#666" strokeWidth="1" />
            <line x1="10" y1="10" x2="10" y2="90" stroke="#666" strokeWidth="1" />
            {/* Labels */}
            <text x="150" y="105" fill="#999" fontSize="8" textAnchor="middle">Time →</text>
            <text x="5" y="50" fill="#999" fontSize="8" textAnchor="middle" transform="rotate(-90 5,50)">km/h</text>
          </svg>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-blue-300 mb-2">Activity Distribution</h4>
        <div className="bg-white/5 rounded p-3">
          <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto">
            {pieData.map((d, i) => {
              const startAngle = pieData.slice(0, i).reduce((sum, item) => sum + (item.duration / totalDuration) * 360, 0);
              const endAngle = startAngle + (d.duration / totalDuration) * 360;
              const startRad = (startAngle - 90) * (Math.PI / 180);
              const endRad = (endAngle - 90) * (Math.PI / 180);
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              const largeArc = endAngle - startAngle > 180 ? 1 : 0;
              const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
              return <path key={i} d={pathData} fill={d.color} opacity={0.8} />;
            })}
            <circle cx="50" cy="50" r="20" fill="#0a0a1a" />
            <text x="50" y="50" fill="white" fontSize="8" textAnchor="middle" dy="3">
              {Math.round(totalDuration)}h
            </text>
          </svg>
          <div className="space-y-1 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="capitalize flex-1">{d.type}</span>
                <span className="text-gray-400">{Math.round(d.duration)}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-blue-300 mb-2">Movement Summary</h4>
        <div className="bg-white/5 rounded p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Distance</span>
            <span className="text-blue-400 font-bold">{stats.totalDistance} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Avg Speed</span>
            <span className="text-green-400 font-bold">{stats.avgSpeed} km/h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Max Speed</span>
            <span className="text-yellow-400 font-bold">{stats.maxSpeed} km/h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Stops</span>
            <span className="text-purple-400 font-bold">{stats.stopCount}</span>
          </div>
          {stats.migrationSegments.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <span className="text-gray-400">Migrations: </span>
              <span className="text-yellow-400 font-bold">{stats.migrationSegments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
