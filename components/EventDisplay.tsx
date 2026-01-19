import React, { useState, useMemo } from 'react';
import { GameEvent, GameEventChoice, StatType, InventoryItem, PlayerStats } from '../types';
import { TRANSLATIONS } from '../constants';
import { getAvailableItemsInContext } from '../itemContext';
import { applyItemEffect, canUseItem } from '../itemEffects';

interface EventDisplayProps {
  event: GameEvent;
  onChoice: (choice: GameEventChoice) => void;
  loading: boolean;
  lang: 'en' | 'zh';
  inventory: InventoryItem[];
  stats: PlayerStats;
  onUseItem: (itemId: string, newStats: PlayerStats, consumeItem: boolean) => void;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ 
  event, 
  onChoice, 
  loading, 
  lang,
  inventory,
  stats,
  onUseItem
}) => {
  const t = TRANSLATIONS[lang];
  const [showItems, setShowItems] = useState(false);
  
  // 直接使用 getAvailableItemsInContext 获取当前事件可用的道具
  // 该函数已经处理了去重逻辑，不需要额外的 useMemo 处理
  const availableItems = useMemo(() => {
    return getAvailableItemsInContext(inventory, event);
  }, [inventory, event]);
  
  const handleUseItem = (item: InventoryItem) => {
    if (!canUseItem(item.id, stats, inventory)) return;
    
    const { newStats, consumeItem } = applyItemEffect(item.id, stats);
    onUseItem(item.id, newStats, consumeItem);
    setShowItems(false);
  };

  return (
    <div className="relative flex flex-col h-full noir-panel rounded-sm overflow-hidden border-t border-b border-white/10 md:border border-white/10 flex-shrink-0">
      
      {/* Loading Overlay with Glitch Effect */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="text-luxury-gold font-mono text-xs tracking-[0.5em] animate-pulse mb-2">{t.loading}</div>
          <div className="h-[1px] w-32 bg-luxury-gold/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-luxury-gold animate-glitch"></div>
          </div>
        </div>
      )}

      {/* Image & Description Section - Fixed Height */}
      <div className="relative flex-shrink-0 h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-105"
          style={{ backgroundImage: `url(${event.backgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#050505]"></div>
        
        {/* Text Content */}
        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-10 pb-2 md:pb-4 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent">
          <div className="flex items-center gap-1.5 md:gap-3 mb-1 md:mb-3">
             <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-luxury-gold rotate-45 shadow-[0_0_8px_#D4AF37] flex-shrink-0"></div>
             <h2 className="text-sm md:text-2xl lg:text-4xl font-serif text-white tracking-wide drop-shadow-lg leading-tight">
                {event.title}
             </h2>
          </div>
          <p className="text-[10px] md:text-sm lg:text-lg text-gray-300 font-sans leading-relaxed tracking-wide font-light max-w-4xl border-l-2 border-luxury-gold/30 pl-2 md:pl-4 line-clamp-3 md:line-clamp-none">
            {event.description}
          </p>
        </div>
      </div>

      {/* Choices Area */}
      <div className="bg-[#050505] border-t border-white/5 p-2 md:p-6 space-y-1.5 md:space-y-3 overflow-y-auto flex-1 relative">
        <div className="flex justify-between items-center mb-1 md:mb-2 gap-2 relative z-10">
          <div className="text-[8px] md:text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold">{t.select}</div>
          
          {/* Item Button */}
          {availableItems.length > 0 && (
            <div className="relative z-50">
              <button
                onClick={() => setShowItems(!showItems)}
                className="px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider bg-luxury-gold/20 border border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all"
              >
                {lang === 'zh' ? '道具' : 'Items'} ({availableItems.length})
              </button>
              
              {/* Item Dropdown - Fixed Position Modal */}
              {showItems && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 bg-black/50 z-[100]" 
                    onClick={() => setShowItems(false)}
                  ></div>
                  
                  {/* Modal Content */}
                  <div className="fixed inset-x-4 md:inset-x-auto md:right-4 md:top-auto md:bottom-20 top-1/2 md:max-w-sm max-h-[70vh] md:max-h-96 overflow-y-auto bg-black/98 border-2 border-luxury-gold/50 z-[101] rounded-lg shadow-2xl">
                    <div className="sticky top-0 bg-black/98 border-b border-luxury-gold/30 p-3 flex justify-between items-center">
                      <h3 className="text-white text-sm md:text-base font-bold uppercase tracking-wider">
                        {lang === 'zh' ? '可用道具' : 'Available Items'}
                      </h3>
                      <button
                        onClick={() => setShowItems(false)}
                        className="text-luxury-gold hover:text-white text-xl md:text-2xl font-bold w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                    <div className="p-3 space-y-2">
                      {availableItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleUseItem(item)}
                          className="w-full text-left p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-luxury-gold/50 transition-all rounded"
                        >
                          <div className="text-xs md:text-sm text-white font-bold mb-1">{item.name}</div>
                          <div className="text-[10px] md:text-xs text-gray-400 mb-1">{item.description}</div>
                          <div className="text-[10px] md:text-xs text-luxury-gold font-mono">
                            {lang === 'zh' ? '数量' : 'Qty'}: {item.quantity}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-1.5 md:gap-3">
          {event.choices.map((choice, idx) => {
            const isRisky = choice.statChanges[StatType.HEALTH] && choice.statChanges[StatType.HEALTH]! < 0;
            const isItem = !!choice.itemUsed;

            return (
              <button
                key={idx}
                onClick={() => !loading && onChoice(choice)}
                disabled={loading}
                className={`group relative w-full p-2 md:p-5 border text-left transition-all duration-300
                  ${loading 
                    ? 'border-white/5 opacity-50 cursor-wait' 
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-luxury-gold/50 cursor-pointer active:bg-white/[0.08]'
                  }
                  ${isItem ? 'border-l-2 md:border-l-4 border-l-luxury-blue' : 'hover:border-l-2 md:hover:border-l-4 hover:border-l-luxury-gold'}
                `}
              >
                <div className="flex justify-between items-start flex-col md:flex-row gap-1 md:gap-2">
                  <div className="flex-1">
                    <span className="text-gray-200 font-medium text-[10px] md:text-base tracking-wide group-hover:text-white transition-colors leading-tight">
                      {choice.text}
                    </span>
                    {isItem && (
                       <span className="ml-1 md:ml-2 inline-block text-[8px] md:text-[10px] px-1 md:px-1.5 py-0 md:py-0.5 border border-luxury-blue/30 text-luxury-blue rounded bg-luxury-blue/5">ITEM</span>
                    )}
                  </div>
                  
                  {/* Stat Impact Hint - Subtle */}
                  <div className="flex gap-1 md:gap-3 opacity-60 group-hover:opacity-100 transition-opacity text-[8px] md:text-[10px] font-mono flex-wrap">
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
                <div className="absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t border-r border-white/20 group-hover:border-luxury-gold transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-l border-white/20 group-hover:border-luxury-gold transition-colors"></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};