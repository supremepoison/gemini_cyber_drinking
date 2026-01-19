export enum StatType {
  HEALTH = 'HEALTH', // 身体
  SOBRIETY = 'SOBRIETY', // 清醒
  FACE = 'FACE', // 面子/社交
  WEALTH = 'WEALTH', // 资金
}

export interface PlayerStats {
  [StatType.HEALTH]: number;
  [StatType.SOBRIETY]: number;
  [StatType.FACE]: number;
  [StatType.WEALTH]: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string; // Description for AI context
  quantity: number;
}

export type ItemCategory = 'BODY' | 'SOCIAL' | 'TACTIC';

export interface ShopItemContent {
  id: string;
  category: ItemCategory;
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  cost: number;
  effect: string;
}

export interface GameEventChoice {
  text: string;
  outcomeNarrative: string;
  statChanges: Partial<PlayerStats>;
  itemUsed?: string; // ID of item used
  nextEventId: string; // The ID of the next event this choice leads to
}

export interface GameEvent {
  id: string;
  turn: number; // The turn number this event corresponds to
  title: string;
  description: string;
  backgroundImage: string; // Hardcoded background URL
  choices: GameEventChoice[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string; // Short desc for card
  storyIntro: string; // Long narrative intro
  initialStats: PlayerStats;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Nightmare';
  imageUrl?: string;
  startEventId: string; // Entry point for the scenario
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  color: string;
  condition: (stats: PlayerStats, turn: number) => boolean;
}

export enum GameState {
  START = 'START',
  SCENARIO_SELECT = 'SCENARIO_SELECT',
  INTRO = 'INTRO',      
  SHOP = 'SHOP',        
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
}

export interface LogEntry {
  turn: number;
  message: string;
  changes?: Partial<PlayerStats>;
}