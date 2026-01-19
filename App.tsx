import React, { useState, useEffect, useCallback } from 'react';
import { GameState, PlayerStats, Scenario, GameEvent, GameEventChoice, LogEntry, StatType, InventoryItem, ShopItemContent, Badge } from './types';
import { generateEvent } from './services/geminiService';
import { MAX_STATS, MIN_STATS, WIN_TURN, FIXED_SCENARIO, TRANSLATIONS, STAGE_LENGTH, STAGES, COVER_IMAGE_URL, BADGES } from './constants';
import { getEndingTitle } from './endingTitles';
import { getFailureEnding, FailureType } from './failureEndings';
import { getVictoryEnding } from './victoryEndings';
import { StatBar } from './components/StatBar';
import { EventDisplay } from './components/EventDisplay';
import { ShopPanel } from './components/ShopPanel';
import { VFXLayer } from './components/VFXLayer';
import { InventoryPanel } from './components/InventoryPanel';

// Icons
const HeartIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
const BrainIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>;
const UserIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const CoinIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.95V5h-2.93v2.63c-1.67.4-2.87 1.25-2.87 2.59 0 1.7 1.42 2.59 4.31 3.29 1.77.43 2.36.91 2.36 1.69 0 .96-.83 1.5-2.22 1.5-1.5 0-2.14-.7-2.26-1.63H6.87c.14 1.71 1.1 2.87 2.8 3.16V20h2.93v-2.75c1.78-.42 3.03-1.42 3.03-2.8 0-1.87-1.53-2.73-4.32-3.31z"/></svg>;

// Helper to determine stage (5 turns per stage)
const getStage = (turn: number) => {
  if (turn <= STAGE_LENGTH) return 1;
  if (turn <= STAGE_LENGTH * 2) return 2;
  if (turn <= STAGE_LENGTH * 3) return 3;
  return 4;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const [stats, setStats] = useState<PlayerStats>({
    [StatType.HEALTH]: 100,
    [StatType.SOBRIETY]: 100,
    [StatType.FACE]: 50,
    [StatType.WEALTH]: 1000,
  });
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [turn, setTurn] = useState(1);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [currentEventId, setCurrentEventId] = useState<string>('t1_seating');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [endingStory, setEndingStory] = useState<string>('');
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [hasVintageWineDebuff, setHasVintageWineDebuff] = useState(false); // 茅台 debuff：后续伤害加倍
  const [failureType, setFailureType] = useState<FailureType | null>(null); // 失败类型
  const [activeItemEffects, setActiveItemEffects] = useState<Set<string>>(new Set()); // 当前激活的道具效果

  const t = TRANSLATIONS[lang];
  const currentStage = getStage(turn);

  // Check API Key - 如果 API key 已写死在代码中，直接设置为 ready
  useEffect(() => {
    // 如果 API key 在代码中写死，直接设置为 ready
    // 否则检查环境变量
      setIsApiReady(true);
  }, []);

  const initGame = useCallback(async () => {
    const scenario = FIXED_SCENARIO;
    setCurrentScenario(scenario);
    setStats(scenario.initialStats);
    setInventory([]);
    setTurn(1);
    setCurrentEventId(scenario.startEventId);
    setLogs([]);
    setEndingStory('');
    setEarnedBadges([]);
    setHasVintageWineDebuff(false); // 重置茅台 debuff
    setFailureType(null); // 重置失败类型
    setActiveItemEffects(new Set()); // 重置道具效果
    setGameState(GameState.INTRO);
  }, []);

  const enterShop = () => {
    setGameState(GameState.SHOP);
  };

  const handleBuyItem = (item: ShopItemContent) => {
    if (stats[StatType.WEALTH] >= item.cost) {
      const newStats = { ...stats, [StatType.WEALTH]: stats[StatType.WEALTH] - item.cost };
      setStats(newStats);
      
      setInventory(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { 
          id: item.id,
          name: item.name[lang], 
          description: item.description[lang],
          cost: item.cost,
          effect: item.effect,
          quantity: 1
        }];
      });
    }
  };

  const handleSellItem = (item: ShopItemContent) => {
    // Find if the user has the item
    const existing = inventory.find(i => i.id === item.id);
    if (existing && existing.quantity > 0) {
      // Refund the cost
      const newStats = { ...stats, [StatType.WEALTH]: stats[StatType.WEALTH] + item.cost };
      setStats(newStats);

      // Decrease quantity or remove item
      setInventory(prev => {
        return prev.map(i => {
          if (i.id === item.id) {
            return { ...i, quantity: i.quantity - 1 };
          }
          return i;
        }).filter(i => i.quantity > 0);
      });
    }
  };

  const handleUseItem = (itemId: string, newStats: PlayerStats, consumeItem: boolean) => {
    // 对于持续效果的道具（如减少伤害的道具），添加到激活列表，不立即应用stats变化
    const persistentItems = ['milk', 'stomach_medicine', 'towel', 'water_bottle', 'red_envelope', 'water_swap', 'distraction', 'toast_skill'];
    if (persistentItems.includes(itemId)) {
      // 持续效果道具：添加到激活列表，效果在选择时应用
      setActiveItemEffects(prev => new Set(prev).add(itemId));
      
      // 所有道具使用后都消耗数量，并添加日志
      setInventory(prev => {
        const updated = prev.map(i => {
          if (i.id === itemId) {
            return { ...i, quantity: i.quantity - 1 };
          }
          return i;
        }).filter(i => i.quantity > 0);
        
        // 在更新前获取道具信息用于日志
        const item = prev.find(i => i.id === itemId);
        if (item) {
          const logMsg = lang === 'zh' 
            ? `使用了 ${item.name}（效果将在下次选择时生效）` 
            : `Used ${item.name} (effect will apply on next choice)`;
          setLogs(prevLogs => [...prevLogs, { turn, message: logMsg }]);
        }
        
        return updated;
      });
    } else {
      // 立即生效的道具：直接应用stats变化
      setStats(newStats);
      
      // 所有道具使用后都消耗数量，并添加日志
      if (consumeItem) {
        setInventory(prev => {
          const updated = prev.map(i => {
            if (i.id === itemId) {
              return { ...i, quantity: i.quantity - 1 };
            }
            return i;
          }).filter(i => i.quantity > 0);
          
          // 在更新前获取道具信息用于日志
          const item = prev.find(i => i.id === itemId);
          if (item) {
            const logMsg = lang === 'zh' 
              ? `使用了 ${item.name}` 
              : `Used ${item.name}`;
            setLogs(prevLogs => [...prevLogs, { turn, message: logMsg }]);
          }
          
          return updated;
        });
      } else {
        // 如果不消耗，直接从当前inventory获取
        const item = inventory.find(i => i.id === itemId);
        if (item) {
          const logMsg = lang === 'zh' 
            ? `使用了 ${item.name}` 
            : `Used ${item.name}`;
          setLogs(prev => [...prev, { turn, message: logMsg }]);
        }
      }
    }
  };

  const startGameLoop = () => {
    const startMsg = lang === 'zh' ? `入局。当前阶段：${STAGES[1].zh}` : `Venue Entered. Stage: ${STAGES[1].en}`;
    setLogs([{ turn: 1, message: startMsg }]);
    setGameState(GameState.PLAYING);
    if (currentScenario) {
      loadNextEvent(stats, 1, currentScenario.description, [], inventory, currentScenario.startEventId);
    }
  };

  const loadNextEvent = async (
    currentStats: PlayerStats, 
    currentTurn: number, 
    context: string, 
    history: LogEntry[], 
    currentInventory: InventoryItem[],
    nextId: string
  ) => {
    setLoading(true);
    const stage = getStage(currentTurn);
    const stageObj = STAGES[stage as 1|2|3|4] || STAGES[1];
    const stageName = lang === 'zh' ? stageObj.zh : stageObj.en;
    
    await new Promise(r => setTimeout(r, 50)); 

    const event = await generateEvent(currentStats, currentTurn, context, [], currentInventory, lang, stageName, nextId);
    
    if (event.turn) {
      setTurn(event.turn);
    }

    setCurrentEvent(event);
    setCurrentEventId(event.id);
    setLoading(false);
  };

  const calculateBadges = (finalStats: PlayerStats, finalTurn: number, endingId?: string) => {
    const badges = BADGES.filter(b => b.condition(finalStats, finalTurn));
    
    // Special check for Whistleblower badge if not caught by generic logic
    if (endingId === 'ending_whistleblower') {
      const wbBadge = BADGES.find(b => b.id === 'whistleblower');
      if (wbBadge && !badges.includes(wbBadge)) {
        badges.push(wbBadge);
      }
    }
    return badges;
  };

  const handleChoice = async (choice: GameEventChoice) => {
    const newStats = { ...stats };
    let gameOver = false;
    let victory = false;
    let deathReason = '';
    const isWhistleblowerEnding = choice.nextEventId === 'ending_whistleblower';

    // 检查是否使用了茅台，如果使用了则设置 debuff（用于后续回合）
    const isUsingVintageWine = choice.itemUsed === 'vintage_wine';
    if (isUsingVintageWine) {
      setHasVintageWineDebuff(true);
    }

    // 应用状态变化，如果之前使用了茅台（hasVintageWineDebuff），HEALTH 和 SOBRIETY 的负值伤害加倍
    // 注意：当前回合使用茅台的选择本身不受影响（因为 debuff 从下一回合开始生效）
    (Object.keys(choice.statChanges) as StatType[]).forEach((key) => {
      let delta = choice.statChanges[key] || 0;
      
      // 如果之前已经使用了茅台（debuff 已激活）且是 HEALTH 或 SOBRIETY 的负值伤害，则加倍
      // 当前回合使用茅台的选择不受影响，因为这是"带头喝"的代价，从下一回合开始加倍
      if (hasVintageWineDebuff && (key === StatType.HEALTH || key === StatType.SOBRIETY) && delta < 0) {
        delta = delta * 2;
      }
      
      // 应用道具效果：减少伤害
      if (delta < 0) {
        if (key === StatType.HEALTH) {
          // 身体伤害减少道具
          if (activeItemEffects.has('milk')) {
            delta = delta * 0.5; // 减少50%
          } else if (activeItemEffects.has('stomach_medicine')) {
            delta = delta * 0.7; // 减少30%
          }
          // 免伤道具
          if (activeItemEffects.has('red_envelope') || activeItemEffects.has('water_swap')) {
            delta = 0; // 完全免伤
          }
        } else if (key === StatType.SOBRIETY) {
          // 清醒度伤害减少道具
          if (activeItemEffects.has('towel')) {
            delta = delta * 0.5; // 减少50%
          } else if (activeItemEffects.has('water_bottle')) {
            delta = delta * 0.6; // 减少40%
          }
          // 免伤道具
          if (activeItemEffects.has('red_envelope') || activeItemEffects.has('water_swap')) {
            delta = 0; // 完全免伤
          }
        }
        // 避免喝酒（转移注意力）
        if (activeItemEffects.has('distraction') && (key === StatType.HEALTH || key === StatType.SOBRIETY)) {
          delta = 0; // 避免这次喝酒的伤害
        }
      }
      
      // 应用面子收益加成（敬酒话术）
      if (key === StatType.FACE && delta > 0 && activeItemEffects.has('toast_skill')) {
        delta = delta * 1.5; // 增加50%
      }
      
      // 应用面子收益减半（红包和偷换水）
      if (key === StatType.FACE && delta > 0 && (activeItemEffects.has('red_envelope') || activeItemEffects.has('water_swap'))) {
        delta = delta * 0.5; // 收益减半
      }
      
      newStats[key] = Math.max(MIN_STATS, Math.min(newStats[key] + delta, MAX_STATS[key] || 999999));
    });
    
    // 清除本轮的道具效果（持续效果的道具在下一回合需要重新使用）
    setActiveItemEffects(new Set());

    if (choice.itemUsed) {
      setInventory(prev => {
        return prev.map(i => i.id === choice.itemUsed ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      });
    }

    // Check Win/Loss conditions
    let currentFailureType: FailureType | null = null;
    if (newStats[StatType.HEALTH] <= 0) {
      gameOver = true;
      currentFailureType = 'HEALTH';
      deathReason = lang === 'zh' ? "急性酒精中毒，倒在了桌子底下。" : "Acute alcohol poisoning.";
    } else if (newStats[StatType.SOBRIETY] <= 0) {
      gameOver = true;
      currentFailureType = 'SOBRIETY';
      deathReason = lang === 'zh' ? "彻底断片，醒来时已经躺在医院。" : "Total blackout.";
    } else if (newStats[StatType.FACE] <= 0) {
      gameOver = true;
      currentFailureType = 'FACE';
      deathReason = lang === 'zh' ? "在领导面前出丑，职业生涯彻底结束。" : "Social suicide.";
    } else if (newStats[StatType.WEALTH] < 0) {
      gameOver = true;
      currentFailureType = 'WEALTH';
      deathReason = lang === 'zh' ? "破产，付不起账单被扣留。" : "Bankrupt.";
    }

    if (!gameOver && (choice.nextEventId === 'victory_check' || isWhistleblowerEnding)) {
       victory = true;
       deathReason = isWhistleblowerEnding 
         ? (lang === 'zh' ? "你向警方提交了证据。" : "Evidence submitted.")
         : (lang === 'zh' ? "成功拿下所有项目，全身而退。" : "You survived the night.");
    }

    const newLog: LogEntry = {
      turn: turn,
      message: `${choice.outcomeNarrative}`,
      changes: choice.statChanges
    };
    const newHistory = [...logs, newLog];
    setLogs(newHistory);
    setStats(newStats);

    if (gameOver || victory) {
      const badges = calculateBadges(newStats, turn, choice.nextEventId);
      setEarnedBadges(badges);
      // 只有真正失败（gameOver）才是 GAME_OVER，否则都是 VICTORY
      setGameState(gameOver ? GameState.GAME_OVER : GameState.VICTORY);

      // 如果是失败，设置失败类型并使用失败结局故事
      if (gameOver && currentFailureType) {
        setFailureType(currentFailureType);
        const failureEnding = getFailureEnding(currentFailureType, lang);
        setEndingStory(failureEnding.story[lang]);
      } else {
        // 胜利者使用预设的结局故事
        const specialEndingId = choice.nextEventId === 'ending_whistleblower' ? 'whistleblower' : undefined;
        const victoryEnding = getVictoryEnding(newStats, turn, lang, specialEndingId);
        setEndingStory(victoryEnding.story[lang]);
      }
    } else {
      if (currentScenario) {
        const nextInventory = choice.itemUsed 
          ? inventory.map(i => i.id === choice.itemUsed ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0)
          : inventory;
        
        loadNextEvent(newStats, turn + 1, currentScenario.description, newHistory, nextInventory, choice.nextEventId);
      }
    }
  };

  const resetGame = () => {
    setGameState(GameState.START);
    setLogs([]);
    setEndingStory('');
    setHasVintageWineDebuff(false); // 重置茅台 debuff
    setFailureType(null); // 重置失败类型
  };

  if (!isApiReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-red-500 font-bold">ERROR: API_KEY MISSING</p>
      </div>
    );
  }

  // Determine Background
  let activeBg = COVER_IMAGE_URL;
  if (gameState === GameState.PLAYING && currentEvent?.backgroundImage) {
    activeBg = currentEvent.backgroundImage;
  }
  
  const backgroundStyle = {
    backgroundImage: `url(${activeBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-gray-100 font-sans flex items-center justify-center relative">
      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 transition-all duration-1000 ease-in-out z-0" style={backgroundStyle}></div>
      {/* Dark Overlay for Text Readability */}
      <div className="fixed inset-0 bg-black/70 z-0"></div>
      
      {/* Noise & Scanlines & VFX - 游戏结束时隐藏所有视觉效果 */}
      {gameState === GameState.PLAYING && (
        <>
          <div className="fixed inset-0 bg-grain opacity-20 z-10 pointer-events-none"></div>
      <div className="scanlines z-10"></div>
      <div className="vignette z-10"></div>
        </>
      )}
      <VFXLayer stats={stats} gameState={gameState} />

      <div className="w-full max-w-7xl min-h-screen md:min-h-[95vh] flex flex-col relative z-20 py-4 md:py-0">
        
        {gameState !== GameState.PLAYING && (
          <div className="relative md:absolute inset-0 z-50 flex items-center justify-center p-4 min-h-screen md:min-h-0">
             
             {/* START SCREEN */}
             {gameState === GameState.START && (
               <div className="text-center w-full max-w-4xl p-6 md:p-10 relative">
                 <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-serif text-white mb-2 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{t.startTitle}</h1>
                 <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-serif text-luxury-gold italic mb-6 md:mb-8 tracking-tighter drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]">{t.startTitle2}</h1>
                 <div className="flex gap-4 justify-center mb-8 md:mb-16">
                   <button onClick={() => setLang('en')} className={`text-xs font-bold tracking-widest px-4 py-1.5 border transition-all ${lang === 'en' ? 'bg-luxury-gold text-black border-luxury-gold' : 'border-white/20 text-gray-500 hover:text-white'}`}>EN</button>
                   <button onClick={() => setLang('zh')} className={`text-xs font-bold tracking-widest px-4 py-1.5 border transition-all ${lang === 'zh' ? 'bg-luxury-gold text-black border-luxury-gold' : 'border-white/20 text-gray-500 hover:text-white'}`}>中文</button>
                 </div>
                 <p className="text-gray-400 mb-8 md:mb-12 whitespace-pre-line text-sm md:text-lg font-light tracking-wide px-4">{t.startDesc}</p>
                 <button onClick={initGame} className="group relative px-8 md:px-16 py-4 md:py-5 bg-transparent border border-white/20 text-white font-bold tracking-[0.4em] uppercase overflow-hidden transition-all hover:border-luxury-gold hover:text-luxury-gold text-sm md:text-base">
                   <span className="relative z-10">{t.startBtn}</span>
                   <div className="absolute inset-0 bg-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                 </button>
               </div>
             )}

             {/* INTRO */}
             {gameState === GameState.INTRO && currentScenario && (
               <div className="noir-panel p-6 md:p-16 max-w-3xl rounded-sm border-l-4 border-l-luxury-gold mx-4 md:mx-0">
                 <div className="text-xs font-bold text-luxury-gold uppercase tracking-[0.4em] mb-4 md:mb-6">{t.introTitle}</div>
                 <h2 className="text-2xl md:text-5xl text-white font-serif mb-6 md:mb-8">{currentScenario.name}</h2>
                 <p className="text-gray-300 text-sm md:text-lg leading-loose mb-8 md:mb-12 whitespace-pre-line font-light border-t border-white/10 pt-6 md:pt-8">
                    {currentScenario.storyIntro}
                 </p>
                 <button onClick={enterShop} className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase hover:bg-luxury-gold hover:text-black transition-all text-sm md:text-base">
                    {t.begin}
                 </button>
               </div>
             )}

             {/* SHOP */}
             {gameState === GameState.SHOP && (
               <div className="w-full max-w-5xl h-[90vh] md:h-auto mx-4 md:mx-0">
                 <ShopPanel stats={stats} inventory={inventory} onBuy={handleBuyItem} onSell={handleSellItem} onContinue={startGameLoop} lang={lang} />
               </div>
             )}

             {/* ENDING SCREEN */}
             {(gameState === GameState.GAME_OVER || gameState === GameState.VICTORY) && (() => {
               // 获取结局标题（胜利者）或失败结局（失败者）
               const endingTitle = gameState === GameState.VICTORY ? getEndingTitle(stats, turn, lang) : null;
               const failureEnding = gameState === GameState.GAME_OVER && failureType ? getFailureEnding(failureType, lang) : null;
               
               return (
                 <div className="noir-panel p-6 md:p-14 text-center rounded-sm max-w-4xl flex flex-col items-center overflow-y-auto max-h-[90vh] border-t-4 border-t-white/10 mx-4 md:mx-0">
                    
                    <div className={`text-xs md:text-sm tracking-[0.5em] uppercase font-bold mb-4 md:mb-6 ${gameState === GameState.VICTORY ? 'text-luxury-gold' : 'text-red-600'}`}>
                    {t.endingTitle}
                  </div>

                    {/* 胜利者：结局标题 */}
                    {endingTitle && (
                      <>
                        <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif mb-4 md:mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                          {endingTitle.title[lang]}
                        </h2>
                        <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 font-light leading-relaxed px-4 max-w-2xl">
                          {endingTitle.description[lang]}
                        </p>
                      </>
                    )}

                    {/* 失败者：失败标题和描述 */}
                    {failureEnding && (
                      <>
                        <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif mb-4 md:mb-6 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                          {failureEnding.title[lang]}
                  </h2>
                        <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 font-light leading-relaxed px-4 max-w-2xl">
                          {failureEnding.description[lang]}
                        </p>
                      </>
                    )}
                  
                  {/* Badges Section */}
                  {earnedBadges.length > 0 && (
                      <div className="mb-8 md:mb-10 flex flex-wrap justify-center gap-3">
                      {earnedBadges.map(badge => (
                        <div key={badge.id} className={`border px-4 py-2 text-xs font-bold tracking-wider uppercase ${badge.color} bg-black/50`}>
                          {badge.name}
                        </div>
                      ))}
                    </div>
                  )}

                    {/* 结局故事 */}
                    {endingStory && (
                      <div className={`text-base md:text-lg mb-8 md:mb-10 font-serif leading-relaxed px-6 opacity-0 animate-fade-in border-l-2 pl-6 text-left w-full max-w-2xl whitespace-pre-line ${gameState === GameState.GAME_OVER ? 'text-gray-400 border-red-500/30' : 'text-gray-300 italic border-white/20'}`} style={{ animationDelay: '0.2s' }}>
                        {gameState === GameState.GAME_OVER ? endingStory : `"${endingStory}"`}
                    </div>
                  )}

                    {/* 所有指标展示 */}
                    <div className="w-full border-t border-white/10 pt-6 md:pt-8 mb-6 md:mb-10">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 text-center">{lang === 'zh' ? '最终数据' : 'Final Stats'}</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {/* 健康 */}
                        <div className="text-center">
                          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{t.statBody}</div>
                          <div className="text-xl md:text-2xl font-mono text-white">{stats.HEALTH}</div>
                          <div className="text-[10px] text-gray-700 mt-1">/ 100</div>
                        </div>
                        {/* 清醒 */}
                        <div className="text-center">
                          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{t.statMind}</div>
                          <div className="text-xl md:text-2xl font-mono text-white">{stats.SOBRIETY}</div>
                          <div className="text-[10px] text-gray-700 mt-1">/ 100</div>
                        </div>
                        {/* 面子 */}
                        <div className="text-center">
                          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{t.statFace}</div>
                          <div className="text-xl md:text-2xl font-mono text-white">{stats.FACE}</div>
                          <div className="text-[10px] text-gray-700 mt-1">/ 100</div>
                        </div>
                        {/* 财富 */}
                        <div className="text-center">
                          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{t.statCash}</div>
                          <div className="text-xl md:text-2xl font-mono text-luxury-gold">¥{stats.WEALTH.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* 轮数和总结 */}
                    <div className="w-full grid grid-cols-2 gap-6 md:gap-8 border-t border-white/10 pt-6 md:pt-8 mb-6 md:mb-10 font-mono">
                       <div className="text-center">
                         <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{t.turnsSurvived}</div>
                         <div className="text-2xl md:text-3xl text-white">{turn}</div>
                         <div className="text-[10px] text-gray-700 mt-1">/ {WIN_TURN}</div>
                     </div>
                       <div className="text-center">
                         <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{lang === 'zh' ? '存活率' : 'Survival Rate'}</div>
                         <div className="text-2xl md:text-3xl text-luxury-gold">{Math.round((turn / WIN_TURN) * 100)}%</div>
                     </div>
                  </div>

                  <button 
                    onClick={resetGame} 
                    className="px-12 py-4 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all font-bold tracking-[0.2em] uppercase"
                  >
                    {t.reboot}
                  </button>
               </div>
               );
             })()}
          </div>
        )}

        {/* MAIN GAMEPLAY */}
        {gameState === GameState.PLAYING && (
          <>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 p-2 md:p-8 h-screen md:h-full overflow-hidden">
            {/* Mobile: Vertical stack layout */}
            <div className="md:col-span-3 flex flex-col gap-2 md:gap-6 md:h-full overflow-y-auto md:overflow-y-auto">

              {/* Turn Info - Mobile & Desktop */}
              <div className="noir-panel p-3 md:p-6 border-l-2 border-luxury-gold shrink-0">
                <div className="flex justify-between items-start md:items-center mb-2 md:mb-4">
                  <div>
                    <div className="text-[10px] md:text-[10px] text-luxury-gold uppercase tracking-[0.2em] mb-1 md:mb-2 opacity-80">{t.stage} {currentStage}</div>
                    <h2 className="text-sm md:text-lg font-serif text-white tracking-wide leading-tight">
                      {lang === 'zh' ? STAGES[currentStage as 1|2|3|4]?.zh : STAGES[currentStage as 1|2|3|4]?.en}
                    </h2>
                  </div>
                  <div className="text-right">
                     <div className="font-mono text-lg md:text-2xl text-white">{turn.toString().padStart(2, '0')}</div>
                     <div className="text-[8px] md:text-[10px] text-gray-600">/ {WIN_TURN}</div>
                  </div>
                </div>
              </div>

              {/* Stats - Mobile & Desktop */}
              <div className="noir-panel p-3 md:p-6 md:flex-1">
                 <h3 className="text-[10px] md:text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-3 md:mb-4 border-b border-white/10 pb-2">{lang === 'zh' ? '状态' : 'STATUS'}</h3>
                 <div className="flex flex-col gap-2 md:gap-3">
                   <StatBar type={StatType.HEALTH} label={t.statBody} value={stats.HEALTH} icon={<HeartIcon/>} />
                   <StatBar type={StatType.SOBRIETY} label={t.statMind} value={stats.SOBRIETY} icon={<BrainIcon/>} />
                   <StatBar type={StatType.FACE} label={t.statFace} value={stats.FACE} icon={<UserIcon/>} />
                   <StatBar type={StatType.WEALTH} label={t.statCash} value={stats.WEALTH} max={50000} icon={<CoinIcon/>} />
                 </div>
              </div>

              {/* Inventory - Desktop only */}
              <div className="noir-panel p-3 md:p-6 md:flex-1 overflow-y-auto hidden md:block">
                 <h3 className="text-[10px] md:text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-3 md:mb-4 border-b border-white/10 pb-2">{t.inventory}</h3>
                 <div className="grid grid-cols-1 gap-2">
                    {inventory.length === 0 && <div className="text-gray-700 text-xs italic text-center py-4 opacity-50">NO ITEMS</div>}
                    {inventory.map((item, idx) => (
                      <div key={idx} className="bg-white/[0.03] border border-white/5 p-3 flex justify-between items-center hover:bg-white/[0.06] transition-colors group">
                        <span className="text-xs text-gray-300 font-medium tracking-wide group-hover:text-white truncate">{item.name}</span>
                        <span className="text-[10px] text-luxury-gold font-mono border border-luxury-gold/20 px-1.5 py-0.5 bg-luxury-gold/5 shrink-0">x{item.quantity}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Event Display - Mobile: Full height, no min-height */}
            <div className="md:col-span-9 h-full flex flex-col overflow-hidden min-h-0">
               {currentEvent && (
                 <EventDisplay 
                   event={currentEvent} 
                   onChoice={handleChoice} 
                   loading={loading} 
                   lang={lang}
                   inventory={inventory}
                   stats={stats}
                   onUseItem={handleUseItem}
                 />
               )}
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;