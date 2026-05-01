'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AnimalTrack, TrackingPoint } from '../../types/movebank';
import { calculateTotalDistance, calculateAverageSpeed, formatDistance, formatDate } from '../../lib/utils';

interface AnimalPanelProps {
  track: AnimalTrack | null;
  onClose: () => void;
}

export default function AnimalPanel({ track, onClose }: AnimalPanelProps) {
  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-6 rounded-2xl w-80 text-white"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{ color: track.color }}>
              {track.animalName}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {track.species && (
              <div>
                <span className="text-gray-400">Species:</span>
                <span className="ml-2">{track.species}</span>
              </div>
            )}

            <div>
              <span className="text-gray-400">Data Points:</span>
              <span className="ml-2">{track.points.length}</span>
            </div>

            {track.points[0] && (
              <div>
                <span className="text-gray-400">First Seen:</span>
                <span className="ml-2">{formatDate(track.points[0].timestamp)}</span>
              </div>
            )}

            {track.points[track.points.length - 1] && (
              <div>
                <span className="text-gray-400">Last Seen:</span>
                <span className="ml-2">{formatDate(track.points[track.points.length - 1].timestamp)}</span>
              </div>
            )}

            <div className="border-t border-white/10 pt-3">
              <div>
                <span className="text-gray-400">Total Distance:</span>
                <span className="ml-2 font-semibold">{formatDistance(calculateTotalDistance(track.points))}</span>
              </div>

              <div>
                <span className="text-gray-400">Avg Speed:</span>
                <span className="ml-2 font-semibold">{calculateAverageSpeed(track.points).toFixed(2)} m/s</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
