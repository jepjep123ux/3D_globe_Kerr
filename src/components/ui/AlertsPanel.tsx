import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertRule, ActiveAlert, 
  loadAlertRules, saveAlertRules, 
  loadAlerts, saveAlerts, 
  checkAlerts, getUnreadCount, markAlertRead, clearAlerts 
} from '../../lib/alerts';
import { AnimalTrack } from '../../types/movebank';

interface AlertsPanelProps {
  tracks: AnimalTrack[];
  onClose: () => void;
}

export default function AlertsPanel({ tracks, onClose }: AlertsPanelProps) {
  const [rules, setRules] = useState<AlertRule[]>(loadAlertRules());
  const [alerts, setAlerts] = useState<ActiveAlert[]>(loadAlerts());
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    // Check for new alerts when tracks change
    const newAlerts: ActiveAlert[] = [];
    tracks.forEach(track => {
      const trackAlerts = checkAlerts(track, rules);
      newAlerts.push(...trackAlerts);
    });
    
    if (newAlerts.length > 0) {
      const allAlerts = [...newAlerts, ...alerts];
      setAlerts(allAlerts);
      saveAlerts(allAlerts);
    }
  }, [tracks, rules]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRuleToggle = (ruleId: string) => {
    const updated = rules.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r);
    setRules(updated);
    saveAlertRules(updated);
  };

  const handleMarkRead = (alertId: string) => {
    markAlertRead(alertId);
    setAlerts(loadAlerts());
  };

  const handleClearAll = () => {
    clearAlerts();
    setAlerts([]);
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="glass-panel p-4 rounded-2xl w-80 text-white max-h-[80vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-red-400">
          🚨 Alerts {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      {/* Rules Toggle */}
      <div className="mb-3">
        <button
          onClick={() => setShowRules(!showRules)}
          className="text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
        >
          {showRules ? 'Hide' : 'Show'} Rules
        </button>
      </div>

      {/* Alert Rules */}
      {showRules && (
        <div className="mb-4 space-y-2">
          <h4 className="text-sm font-semibold text-blue-300">Alert Rules</h4>
          {rules.map(rule => (
            <div key={rule.id} className="flex items-center justify-between text-xs bg-white/5 p-2 rounded">
              <span className={`${rule.enabled ? 'text-white' : 'text-gray-500'}`}>
                {rule.type.replace('_', ' ').toUpperCase()}
              </span>
              <button
                onClick={() => handleRuleToggle(rule.id)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  rule.enabled 
                    ? 'bg-green-500/30 text-green-400' 
                    : 'bg-gray-500/30 text-gray-400'
                }`}
              >
                {rule.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Alerts */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-blue-300">
            Active Alerts ({alerts.length})
          </h4>
          {alerts.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs px-2 py-1 rounded bg-red-500/30 hover:bg-red-500/50 text-red-400 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="text-xs text-gray-500 text-center py-4">
            No alerts triggered yet.
          </div>
        ) : (
          alerts.slice(0, 10).map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-2 rounded text-xs ${
                alert.severity === 'high' ? 'bg-red-900/50 border border-red-500' :
                alert.severity === 'medium' ? 'bg-yellow-900/50 border border-yellow-500' :
                'bg-blue-900/50 border border-blue-500'
              } ${alert.isRead ? 'opacity-50' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold">{alert.type.replace('_', ' ').toUpperCase()}</span>
                {!alert.isRead && (
                  <button
                    onClick={() => handleMarkRead(alert.id)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Mark Read
                  </button>
                )}
              </div>
              <div className="text-gray-300">{alert.message}</div>
              <div className="text-gray-500 text-xs mt-1">
                {alert.animalName} • {new Date(alert.timestamp).toLocaleString()}
              </div>
              {alert.location && (
                <div className="text-gray-500 text-xs">
                  Location: {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
