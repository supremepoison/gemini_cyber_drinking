import React, { useState } from 'react';
import { InventoryItem, PlayerStats, StatType, ShopItemContent, ItemCategory } from '../types';
import { SHOP_ITEMS, TRANSLATIONS } from '../constants';

interface ShopPanelProps {
  stats: PlayerStats;
  inventory: InventoryItem[];
  onBuy: (item: ShopItemContent) => void;
  onSell: (item: ShopItemContent) => void;
  onContinue: () => void;
  lang: 'en' | 'zh';
}

export const ShopPanel: React.FC<ShopPanelProps> = ({ stats, inventory, onBuy, onSell, onContinue, lang }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<ItemCategory>('BODY');

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeTab);

  const TabButton = ({ cat, label }: { cat: ItemCategory, label: string }) => (
    <button
      onClick={() => setActiveTab(cat)}
      className={`flex-1 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all relative overflow-hidden
        ${activeTab === cat 
          ? 'text-black bg-luxury-gold' 
          : 'text-gray-500 hover:text-gray-200 bg-black/40'}`}
    >
      {label}
      {activeTab === cat && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/50"></div>}
    </button>
  );

  return (
    <div className="flex flex-col h-full noir-panel rounded-lg p-0 relative overflow-hidden shadow-2xl border border-white/10">
      
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/10 bg-black/40 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white mb-1 tracking-wide">{t.shopTitle}</h2>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">{t.shopDesc}</p>
        </div>
        <div className="text-left md:text-right">
           <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t.statCash}</div>
           <div className="font-mono text-lg md:text-xl text-luxury-gold">¥{stats[StatType.WEALTH].toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <TabButton cat="BODY" label={t.shopCatBody} />
        <TabButton cat="SOCIAL" label={t.shopCatSocial} />
        <TabButton cat="TACTIC" label={t.shopCatTactic} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-1 p-2 md:p-1 bg-white/5 overflow-y-auto flex-1 scrollbar-hide">
        {filteredItems.map((item) => {
          const owned = inventory.find(i => i.id === item.id)?.quantity || 0;
          const canAfford = stats[StatType.WEALTH] >= item.cost;
          const name = item.name[lang];
          const desc = item.description[lang];

          return (
            <div key={item.id} className="bg-black/80 p-4 md:p-5 flex flex-col justify-between hover:bg-[#151515] transition-colors group relative border border-transparent hover:border-white/10">
              
              {/* Item Info */}
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-gray-200 font-bold text-xs md:text-sm tracking-wide group-hover:text-luxury-gold transition-colors flex-1">{name}</h3>
                  <span className={`font-mono text-xs flex-shrink-0 ${canAfford ? 'text-luxury-gold' : 'text-gray-600'}`}>¥{item.cost}</span>
                </div>
                <div className="w-8 h-[1px] bg-white/10 mb-3 group-hover:w-full transition-all duration-500"></div>
                <p className="text-gray-500 text-xs mb-4 leading-relaxed min-h-[2.5rem] md:h-10 line-clamp-2">{desc}</p>
              </div>
              
              {/* Controls */}
              <div className="flex justify-between items-center mt-auto gap-2">
                <div className="text-[10px] text-gray-600 font-mono uppercase">
                  {t.owned}: <span className={owned > 0 ? 'text-white' : 'text-gray-600'}>{owned}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Decrease */}
                  <button
                    onClick={() => onSell(item)}
                    disabled={owned <= 0}
                    className={`w-7 h-7 flex items-center justify-center border transition-all touch-manipulation
                      ${owned > 0 
                        ? 'border-white/20 hover:bg-red-900/50 hover:border-red-500 active:bg-red-900/70 text-gray-400 hover:text-white' 
                        : 'border-transparent opacity-0'}
                    `}
                  >
                    -
                  </button>

                  {/* Buy */}
                  <button
                    onClick={() => onBuy(item)}
                    disabled={!canAfford}
                    className={`h-7 px-3 md:px-4 text-[10px] font-bold uppercase tracking-widest transition-all touch-manipulation
                      ${canAfford 
                        ? 'bg-white/10 text-white hover:bg-luxury-gold hover:text-black active:bg-luxury-gold/80 border border-white/10 hover:border-luxury-gold' 
                        : 'bg-transparent text-gray-700 border border-white/5 cursor-not-allowed'}`}
                  >
                    {t.buy}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur">
        <button
          onClick={onContinue}
          className="w-full py-3 bg-luxury-gold text-black font-bold text-sm tracking-[0.3em] uppercase hover:bg-white active:bg-white/90 transition-colors touch-manipulation"
        >
          {t.continue}
        </button>
      </div>
    </div>
  );
};