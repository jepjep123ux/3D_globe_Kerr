'use client';

import { motion } from 'framer-motion';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  rotationSpeed?: number;
  onRotationSpeedChange?: (speed: number) => void;
  showDots?: boolean;
  onToggleDots?: () => void;
}

export default function PlaybackControls({
  isPlaying,
  onPlayPause,
  rotationSpeed,
  onRotationSpeedChange,
  showDots,
  onToggleDots,
}: PlaybackControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel p-4 rounded-2xl w-full max-w-2xl text-white flex items-center gap-4"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayPause}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
      >
        {isPlaying ? '⏸' : '▶'}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleDots}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30 transition-all cursor-pointer"
      >
        {showDots ? '●' : '○'}
      </motion.button>

      <div className="flex-1 text-center text-sm text-gray-300">
        {isPlaying ? 'Globe spinning...' : 'Click play to spin globe'} • Click ● to toggle dots
      </div>
    </motion.div>
  );
}
