'use client';

import { motion } from 'framer-motion';
import { MovebankStudy } from '../../types/movebank';

interface StudySelectorProps {
  studies: MovebankStudy[];
  selectedStudyIds: number[];
  onStudySelect: (studyId: number) => void;
  loading: boolean;
}

export default function StudySelector({
  studies,
  selectedStudyIds,
  onStudySelect,
  loading,
}: StudySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 rounded-2xl w-80 text-white"
    >
      <h3 className="text-lg font-bold mb-3 text-blue-400">Select Study</h3>
      
      {loading ? (
        <div className="text-gray-400">Loading studies...</div>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {studies.map((study, index) => (
            <motion.button
              key={`${study.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onStudySelect(study.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedStudyIds.includes(study.id)
                  ? 'bg-blue-500/30 border border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
              }`}
            >
              <div className="font-semibold text-sm">{study.name}</div>
              {study.number_of_individuals && (
                <div className="text-xs text-gray-400 mt-1">
                  {study.number_of_individuals} animals • {study.number_of_deployed_locations || 0} locations
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
