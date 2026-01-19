import React from 'react';
import { Scenario, StatType } from '../types';
import { TRANSLATIONS } from '../constants';

interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
  lang: 'en' | 'zh';
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onSelect, lang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div 
      onClick={() => onSelect(scenario)}
      className="bg-white text-black overflow-hidden shadow-2xl cursor-pointer group hover:-translate-y-1 transition-all duration-300 rounded-sm"
    >
      {/* Image Section */}
      <div className="w-full h-40 bg-gray-200 overflow-hidden relative">
        {scenario.imageUrl ? (
           <img 
             src={scenario.imageUrl} 
             alt={scenario.name} 
             className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
           />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif text-4xl bg-gray-900">
            ?
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col border-t-4 border-luxury-gold">
        <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">
          {scenario.difficulty}
        </div>
        <h3 className="text-2xl font-serif text-black mb-3">{scenario.name}</h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
          {scenario.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-xs font-sans text-gray-500 border-t border-gray-200 pt-4">
          <div>{t.statBody}: <span className="text-black font-semibold">{scenario.initialStats[StatType.HEALTH]}</span></div>
          <div>{t.statMind}: <span className="text-black font-semibold">{scenario.initialStats[StatType.SOBRIETY]}</span></div>
          <div>{t.statFace}: <span className="text-black font-semibold">{scenario.initialStats[StatType.FACE]}</span></div>
          <div>{t.statCash}: <span className="text-black font-semibold">¥{scenario.initialStats[StatType.WEALTH]}</span></div>
        </div>
      </div>
    </div>
  );
};