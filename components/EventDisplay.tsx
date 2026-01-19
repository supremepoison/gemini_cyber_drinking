import React from 'react';
import { GameEvent, GameEventChoice, StatType } from '../types';
import { TRANSLATIONS } from '../constants';

interface EventDisplayProps {
  event: GameEvent;
  onChoice: (choice: GameEventChoice) => void;
  loading: boolean;
  lang: 'en' | 'zh';
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ event, onChoice, loading, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative flex flex-col h-full noir-panel rounded-sm overflow-hidden border-t border-b border-white/10 md:border border-white/10">
      
      {/* Loading Overlay with Glitch Effect */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="text-luxury-gold font-mono text-xs tracking-[0.5em] animate-pulse mb-2">{t.loading}</div>
          <div className="h-[1px] w-32 bg-luxury-gold/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-luxury-gold animate-glitch"></div>
          </div>
        </div>
      )}

      {/* Image & Description Section */}
      <div className="relative flex-1 min-h-[40%] md:min-h-[50%] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-105"
          style={{ backgroundImage: `url(${event.backgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#050505]"></div>
        
        {/* Text Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pb-4 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-2 h-2 bg-luxury-gold rotate-45 shadow-[0_0_8px_#D4AF37]"></div>
             <h2 className="text-2xl md:text-4xl font-serif text-white tracking-wide drop-shadow-lg">
                {event.title}
             </h2>
          </div>
          <p className="text-sm md:text-lg text-gray-300 font-sans leading-relaxed tracking-wide font-light max-w-4xl border-l-2 border-luxury-gold/30 pl-4">
            {event.description}
          </p>
        </div>
      </div>

      {/* Choices Area */}
      <div className="bg-[#050505] border-t border-white/5 p-4 md:p-6 space-y-3 z-10">
        <div className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold mb-2 ml-1">{t.select}</div>
        
        <div className="grid grid-cols-1 gap-3">
          {event.choices.map((choice, idx) => {
            const isRisky = choice.statChanges[StatType.HEALTH] && choice.statChanges[StatType.HEALTH]! < 0;
            const isItem = !!choice.itemUsed;

            return (
              <button
                key={idx}
                onClick={() => !loading && onChoice(choice)}
                disabled={loading}
                className={`group relative w-full p-4 md:p-5 border text-left transition-all duration-300
                  ${loading 
                    ? 'border-white/5 opacity-50 cursor-wait' 
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-luxury-gold/50 cursor-pointer'
                  }
                  ${isItem ? 'border-l-4 border-l-luxury-blue' : 'hover:border-l-4 hover:border-l-luxury-gold'}
                `}
              >
                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
                  <div className="flex-1">
                    <span className="text-gray-200 font-medium text-sm md:text-base tracking-wide group-hover:text-white transition-colors">
                      {choice.text}
                    </span>
                    {isItem && (
                       <span className="ml-2 inline-block text-[10px] px-1.5 py-0.5 border border-luxury-blue/30 text-luxury-blue rounded bg-luxury-blue/5">ITEM</span>
                    )}
                  </div>
                  
                  {/* Stat Impact Hint - Subtle */}
                  <div className="flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity text-[10px] font-mono">
                    {Object.entries(choice.statChanges).map(([key, val]) => {
                      const v = val as number;
                      if (v === 0) return null;
                      const color = key === 'HEALTH' && v < 0 ? 'text-luxury-red' : 
                                    key === 'WEALTH' && v < 0 ? 'text-luxury-gold' : 
                                    key === 'SOBRIETY' && v < 0 ? 'text-luxury-blue' : 'text-gray-400';
                      return (
                        <span key={key} className={`${color}`}>
                           {key.substring(0,3)} {v > 0 ? '+' : ''}{v}
                        </span>
                      )
                    })}
                  </div>
                </div>
                
                {/* Decoration Corner */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-luxury-gold transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-luxury-gold transition-colors"></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};