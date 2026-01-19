import React from 'react';
import { StatType } from '../types';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  type: StatType;
  icon?: React.ReactNode;
}

const COLORS = {
  [StatType.HEALTH]: 'bg-luxury-red shadow-[0_0_10px_rgba(255,42,42,0.6)]',
  [StatType.SOBRIETY]: 'bg-luxury-blue shadow-[0_0_10px_rgba(0,240,255,0.6)]',
  [StatType.FACE]: 'bg-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]',
  [StatType.WEALTH]: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]',
};

const DIM_COLORS = {
  [StatType.HEALTH]: 'bg-red-900/30',
  [StatType.SOBRIETY]: 'bg-blue-900/30',
  [StatType.FACE]: 'bg-yellow-900/30',
  [StatType.WEALTH]: 'bg-emerald-900/30',
};

export const StatBar: React.FC<StatBarProps> = ({ label, value, max = 100, type, icon }) => {
  // Create segments (e.g., 20 segments for 100 max)
  const segments = 20;
  const valuePerSegment = max / segments;
  const activeSegments = Math.ceil(value / valuePerSegment);

  return (
    <div className="flex flex-col w-full group">
      <div className="flex justify-between items-center mb-1.5 px-0.5">
        <div className="flex items-center gap-2 text-[10px] md:text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 group-hover:text-gray-200 transition-colors">
          <span className="opacity-80 w-3 h-3 flex items-center justify-center">{icon}</span>
          <span>{label}</span>
        </div>
        <span className={`font-mono text-[11px] md:text-xs font-bold ${activeSegments < 5 && type !== StatType.WEALTH ? 'text-red-500 animate-pulse' : 'text-gray-200'}`}>
          {Math.round(value)}
          <span className="text-gray-500 text-[9px] md:text-[10px] ml-1">/ {max}</span>
        </span>
      </div>

      {/* Segmented Bar */}
      <div className="flex gap-[2px] md:gap-[2px] h-2 md:h-2 w-full">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-[1px] transition-all duration-300 ${
              i < activeSegments
                ? COLORS[type]
                : `${DIM_COLORS[type]} border border-white/5`
            }`}
          />
        ))}
      </div>
    </div>
  );
};