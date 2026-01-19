import React, { useState } from 'react';
import { InventoryItem, PlayerStats } from '../types';
import { applyItemEffect, canUseItem } from '../itemEffects';

interface InventoryPanelProps {
  inventory: InventoryItem[];
  stats: PlayerStats;
  onUseItem: (itemId: string, newStats: PlayerStats, consumeItem: boolean) => void;
  lang: 'en' | 'zh';
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ 
  inventory, 
  stats, 
  onUseItem,
  lang 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUseItem = (item: InventoryItem) => {
    if (!canUseItem(item.id, stats, inventory)) return;
    
    const { newStats, consumeItem } = applyItemEffect(item.id, stats);
    onUseItem(item.id, newStats, consumeItem);
  };

  const usableItems = inventory.filter(item => item.quantity > 0 && item.id !== 'spy_pen' && item.id !== 'vintage_wine');

  if (usableItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/80 border border-white/20 px-4 py-2 text-white text-xs font-bold uppercase tracking-wider hover:bg-black/90 transition-all mb-2"
      >
        {lang === 'zh' ? '道具栏' : 'Inventory'} ({usableItems.length})
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="bg-black/95 border border-white/20 p-4 max-w-xs max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider">
              {lang === 'zh' ? '道具栏' : 'Inventory'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            {usableItems.map((item) => {
              const canUse = canUseItem(item.id, stats, inventory);
              return (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-white text-xs font-bold mb-1">{item.name}</div>
                      <div className="text-gray-400 text-[10px] mb-2">{item.description}</div>
                      <div className="text-gray-500 text-[10px] font-mono">
                        {lang === 'zh' ? '数量' : 'Qty'}: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUseItem(item)}
                    disabled={!canUse}
                    className={`w-full py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                      canUse
                        ? 'bg-luxury-gold text-black hover:bg-white active:bg-luxury-gold/80'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {lang === 'zh' ? '使用' : 'Use'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
