'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { COUNTRIES } from '../components/globe/Globe';
import PlaybackControls from '../components/ui/PlaybackControls';

const Globe = dynamic(() => import('../components/globe/Globe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-4xl"
      >
        🌍
      </motion.div>
    </div>
  ),
});

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [selectedCountryIdx, setSelectedCountryIdx] = useState<number | null>(null);
  const [showDots, setShowDots] = useState(true);

  useEffect(() => {
    document.title = 'WorldView 3D';
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setRotationSpeed(0.3);
    } else {
      setRotationSpeed(0);
    }
  };

  return (
    <main className="w-full h-screen bg-[#0a0a1a] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Globe
          selectedCountry={selectedCountryIdx}
          onCountrySelect={(idx: number | null) => setSelectedCountryIdx(idx)}
          isPlaying={isPlaying}
          rotationSpeed={rotationSpeed}
          showDots={showDots}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-10"
      >
        <h1 className="text-2xl font-bold text-white tracking-wide" style={{ textShadow: '0 0 20px rgba(0,136,255,0.8), 0 0 40px rgba(0,136,255,0.4)' }}>
          WorldView 3D
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <PlaybackControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          rotationSpeed={rotationSpeed}
          onRotationSpeedChange={setRotationSpeed}
          showDots={showDots}
          onToggleDots={() => setShowDots(!showDots)}
        />
      </motion.div>

      {selectedCountryIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedCountryIdx(null)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              color: '#00aaff',
              fontSize: '16px',
              fontWeight: 'bold',
              whiteSpace: 'normal',
              userSelect: 'none',
              background: 'rgba(0, 20, 40, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid rgba(0, 170, 255, 0.5)',
              minWidth: '500px',
              maxWidth: '600px',
              boxShadow: '0 20px 60px rgba(0, 170, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(0, 170, 255, 0.4)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '24px', textShadow: '0 0 20px #00aaff' }}>{COUNTRIES[selectedCountryIdx].name}</span>
              <button
                onClick={() => setSelectedCountryIdx(null)}
                style={{
                  background: 'rgba(0, 170, 255, 0.4)',
                  border: '1px solid rgba(0, 170, 255, 0.6)',
                  color: '#00aaff',
                  cursor: 'pointer',
                  fontSize: '28px',
                  lineHeight: '1',
                  padding: '6px 16px',
                  borderRadius: '10px',
                  backdropFilter: 'blur(4px)',
                }}
              >
                ×
              </button>
            </div>
            <div style={{ fontWeight: 'normal', fontSize: '15px', lineHeight: '2', color: 'rgba(255, 255, 255, 1)' }}>
              <div style={{ marginBottom: '8px', fontSize: '12px', color: 'rgba(0, 170, 255, 1)' }}>{COUNTRIES[selectedCountryIdx].official_name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px' }}>
                <span style={{ color: 'rgba(0, 170, 255, 0.8)' }}>ISO:</span><span>{COUNTRIES[selectedCountryIdx].iso2} / {COUNTRIES[selectedCountryIdx].iso3}</span>
                <span style={{ color: 'rgba(0, 170, 255, 0.8)' }}>Capital:</span><span>{COUNTRIES[selectedCountryIdx].capital}</span>
                <span style={{ color: 'rgba(0, 170, 255, 0.8)' }}>Continent:</span><span>{COUNTRIES[selectedCountryIdx].continent}</span>
                <span style={{ color: 'rgba(0, 170, 255, 0.8)' }}>Region:</span><span>{COUNTRIES[selectedCountryIdx].region}</span>
                <span style={{ color: 'rgba(0, 170, 255, 0.8)' }}>Population:</span><span>{COUNTRIES[selectedCountryIdx].population}</span>
                <span style={{ color: 'rgba(0, 170, 255, 0.8)' }}>Area:</span><span>{COUNTRIES[selectedCountryIdx].area_km2} km²</span>
                <span style={{ color: 'rgba(0, 170, 255, 0.8)' }}>GDP:</span><span>{COUNTRIES[selectedCountryIdx].gdp_usd}</span>
                <span style={{ color: 'rgba(0, 170, 255, 0.8)' }}>Currency:</span><span>{COUNTRIES[selectedCountryIdx].currency}</span>
              </div>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0, 170, 255, 0.4)', fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>Languages: {COUNTRIES[selectedCountryIdx].languages}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
