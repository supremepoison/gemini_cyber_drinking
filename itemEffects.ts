import { PlayerStats, StatType, InventoryItem } from './types';

export interface ItemEffect {
  id: string;
  applyEffect: (stats: PlayerStats) => { newStats: PlayerStats; consumeItem: boolean };
  canUse: (stats: PlayerStats, inventory: InventoryItem[]) => boolean;
}

// 道具效果定义
export const ITEM_EFFECTS: Record<string, ItemEffect['applyEffect']> = {
  // BODY 类道具
  'milk': (stats) => ({
    newStats: { ...stats }, // 效果在伤害计算时应用
    consumeItem: true // 使用后消耗
  }),
  'liver_pills': (stats) => ({
    newStats: {
      ...stats,
      [StatType.HEALTH]: Math.min(100, stats[StatType.HEALTH] + 15)
    },
    consumeItem: true
  }),
  'energy_drink': (stats) => ({
    newStats: {
      ...stats,
      [StatType.SOBRIETY]: Math.min(100, stats[StatType.SOBRIETY] + 20)
    },
    consumeItem: true
  }),
  'stomach_medicine': (stats) => ({
    newStats: { ...stats }, // 效果在伤害计算时应用
    consumeItem: true // 使用后消耗
  }),
  'vitamin_c': (stats) => ({
    newStats: {
      ...stats,
      [StatType.HEALTH]: Math.min(100, stats[StatType.HEALTH] + 8),
      [StatType.SOBRIETY]: Math.min(100, stats[StatType.SOBRIETY] + 5)
    },
    consumeItem: true
  }),
  'ginkgo_biloba': (stats) => ({
    newStats: {
      ...stats,
      [StatType.SOBRIETY]: Math.min(100, stats[StatType.SOBRIETY] + 18)
    },
    consumeItem: true
  }),

  // SOCIAL 类道具
  'cigarettes': (stats) => ({
    newStats: {
      ...stats,
      [StatType.FACE]: Math.min(100, stats[StatType.FACE] + 10)
    },
    consumeItem: true // 使用后消耗
  }),
  'gift': (stats) => ({
    newStats: {
      ...stats,
      [StatType.FACE]: Math.min(100, stats[StatType.FACE] + 25)
    },
    consumeItem: true // 使用后消耗
  }),
  'toast_skill': (stats) => ({
    newStats: { ...stats }, // 效果在面子收益计算时应用
    consumeItem: true // 使用后消耗
  }),
  'wine_knowledge': (stats) => ({
    newStats: {
      ...stats,
      [StatType.FACE]: Math.min(100, stats[StatType.FACE] + 15)
    },
    consumeItem: true
  }),
  'network_connection': (stats) => ({
    newStats: {
      ...stats,
      [StatType.FACE]: Math.min(100, stats[StatType.FACE] + 20)
    },
    consumeItem: true
  }),

  // TACTIC 类道具
  'red_envelope': (stats) => ({
    newStats: { ...stats }, // 效果在伤害计算时应用
    consumeItem: true // 使用后消耗
  }),
  'towel': (stats) => ({
    newStats: { ...stats }, // 效果在伤害计算时应用
    consumeItem: true // 使用后消耗
  }),
  'water_bottle': (stats) => ({
    newStats: { ...stats }, // 效果在伤害计算时应用
    consumeItem: true // 使用后消耗
  }),
  'distraction': (stats) => ({
    newStats: { ...stats }, // 效果在选择时应用（避免喝酒）
    consumeItem: true // 使用后消耗
  }),
  'water_swap': (stats) => ({
    newStats: { ...stats }, // 效果在伤害计算时应用（免伤）
    consumeItem: true
  }),
  'fake_call': (stats) => ({
    newStats: {
      ...stats,
      [StatType.SOBRIETY]: Math.min(100, stats[StatType.SOBRIETY] + 5), // 休息一下恢复一点清醒
      [StatType.FACE]: Math.max(0, stats[StatType.FACE] - 10) // 但掉面子
    },
    consumeItem: true
  })
};

// 检查道具是否可以使用
export function canUseItem(itemId: string, stats: PlayerStats, inventory: InventoryItem[]): boolean {
  const item = inventory.find(i => i.id === itemId);
  if (!item || item.quantity <= 0) return false;
  
  // 特殊道具检查
  if (itemId === 'vintage_wine') {
    // 茅台只能在使用时设置debuff，不能主动使用
    return false;
  }
  
  return true;
}

// 应用道具效果
export function applyItemEffect(itemId: string, stats: PlayerStats): { newStats: PlayerStats; consumeItem: boolean } {
  const effect = ITEM_EFFECTS[itemId];
  if (!effect) {
    return { newStats: stats, consumeItem: false };
  }
  return effect(stats);
}
