import { motion } from 'framer-motion';
import { AnimalTrack, TrackingPoint } from '../../types/movebank';
import { analyzeMovement, detectAnomalies, generateSmartSummary, MovementStats, AnomalyEvent } from '../../lib/analytics';
import { predictNextLocations, generateSmartPredictionSummary } from '../../lib/prediction';

interface AnimalProfileProps {
  track: AnimalTrack | null;
  onClose: () => void;
  playbackProgress: number;
}

export default function AnimalProfile({ track, onClose, playbackProgress }: AnimalProfileProps) {
  if (!track) return null;

  const visiblePoints = track.points.slice(0, Math.floor(track.points.length * playbackProgress));
  const stats: MovementStats = analyzeMovement(visiblePoints);
  const anomalies: AnomalyEvent[] = detectAnomalies(visiblePoints);
  const summary = generateSmartSummary(stats, track.species);
  const prediction = predictNextLocations(visiblePoints, 10, 24);
  const predictionSummary = generateSmartPredictionSummary(prediction);

  const behaviorCounts = stats.behaviorPeriods.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + p.duration;
    return acc;
  }, {} as Record<string, number>);

  const totalBehaviorTime = Object.values(behaviorCounts).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="glass-panel p-4 rounded-2xl w-80 text-white max-h-[80vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-blue-400">{track.animalName}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      {track.species && (
        <div className="text-sm text-gray-300 mb-2">Species: {track.species}</div>
      )}

      <div className="text-xs text-gray-400 mb-4 italic">{summary}</div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-blue-300 mb-2">Movement Statistics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-2 rounded">
              <div className="text-gray-400">Total Distance</div>
              <div className="text-lg font-bold text-blue-400">{stats.totalDistance} km</div>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <div className="text-gray-400">Avg Speed</div>
              <div className="text-lg font-bold text-green-400">{stats.avgSpeed} km/h</div>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <div className="text-gray-400">Max Speed</div>
              <div className="text-lg font-bold text-yellow-400">{stats.maxSpeed} km/h</div>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <div className="text-gray-400">Duration</div>
              <div className="text-lg font-bold text-purple-400">{stats.totalDuration}h</div>
            </div>
          </div>
        </div>

        {stats.migrationSegments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Migration Segments</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {stats.migrationSegments.map((seg, idx) => (
                <div key={idx} className="bg-white/5 p-2 rounded text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-400">{seg.direction}</span>
                    <span className="text-gray-400">{seg.distance} km</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(seg.start).toLocaleDateString()} → {new Date(seg.end).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.behaviorPeriods.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Behavior Distribution</h4>
            <div className="space-y-1">
              {Object.entries(behaviorCounts).map(([type, duration]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    type === 'resting' ? 'bg-blue-500' :
                    type === 'foraging' ? 'bg-green-500' :
                    type === 'migrating' ? 'bg-yellow-500' : 'bg-purple-500'
                  }`} />
                  <span className="text-xs capitalize flex-1">{type}</span>
                  <span className="text-xs text-gray-400">
                    {Math.round(duration)}h ({Math.round((duration / totalBehaviorTime) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {anomalies.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Anomalies Detected</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {anomalies.slice(0, 5).map((anomaly, idx) => (
                <div key={idx} className={`p-2 rounded text-xs ${
                  anomaly.severity === 'high' ? 'bg-red-900/50 border border-red-500' :
                  anomaly.severity === 'medium' ? 'bg-yellow-900/50 border border-yellow-500' :
                  'bg-blue-900/50 border border-blue-500'
                }`}>
                  <div className="font-semibold">{anomaly.type.replace('_', ' ').toUpperCase()}</div>
                  <div className="text-gray-300 mt-1">{anomaly.description}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(anomaly.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {prediction && (
          <div>
            <h4 className="text-sm font-semibold text-cyan-400 mb-2">🔮 Prediction</h4>
            <div className="bg-cyan-900/30 border border-cyan-500/50 p-2 rounded text-xs">
              <div className="text-gray-300">{predictionSummary}</div>
              {prediction.nextLocation && (
                <div className="mt-2 text-cyan-300">
                  Next: {prediction.nextLocation.lat.toFixed(4)}, {prediction.nextLocation.lng.toFixed(4)}
                  <div className="text-gray-500 text-xs">
                    {new Date(prediction.nextLocation.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
              <div className="mt-1 text-gray-500">
                Confidence: {Math.round(prediction.confidence * 100)}%
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-blue-300 mb-2">Location Info</h4>
          {visiblePoints.length > 0 && (
            <div className="text-xs text-gray-300">
              <div>Current: {visiblePoints[visiblePoints.length - 1]?.lat.toFixed(4)}, {visiblePoints[visiblePoints.length - 1]?.lng.toFixed(4)}</div>
              <div className="mt-1">Points tracked: {visiblePoints.length}</div>
              {visiblePoints[visiblePoints.length - 1]?.timestamp && (
                <div className="mt-1">Last update: {new Date(visiblePoints[visiblePoints.length - 1].timestamp).toLocaleString()}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
