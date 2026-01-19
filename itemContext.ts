import { GameEvent, InventoryItem } from './types';

// 定义每个道具在哪些场景/回合可以使用
export interface ItemContext {
  itemId: string;
  // 可以在哪些回合使用（turn范围）
  allowedTurns?: number[];
  // 可以在哪些事件ID使用
  allowedEvents?: string[];
  // 可以在哪些事件类型使用（通过事件ID前缀判断）
  allowedEventPrefixes?: string[];
  // 是否可以在任何场景使用
  alwaysAvailable?: boolean;
}

// 道具使用场景规则
export const ITEM_CONTEXTS: ItemContext[] = [
  // BODY类道具 - 可以在任何需要恢复的场景使用
  {
    itemId: 'milk',
    alwaysAvailable: true
  },
  {
    itemId: 'liver_pills',
    alwaysAvailable: true
  },
  {
    itemId: 'energy_drink',
    alwaysAvailable: true
  },
  {
    itemId: 'stomach_medicine',
    alwaysAvailable: true
  },
  {
    itemId: 'vitamin_c',
    alwaysAvailable: true
  },
  {
    itemId: 'ginkgo_biloba',
    alwaysAvailable: true
  },

  // SOCIAL类道具 - 在社交场景使用
  {
    itemId: 'cigarettes',
    allowedEventPrefixes: ['t11', 't12', 't13', 't14', 't15', 't16', 't17', 't18', 't19']
  },
  {
    itemId: 'gift',
    allowedEventPrefixes: ['t11', 't12', 't13', 't14', 't15', 't16', 't17', 't18', 't19']
  },
  {
    itemId: 'toast_skill',
    allowedEventPrefixes: ['t3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15']
  },
  {
    itemId: 'wine_knowledge',
    allowedEventPrefixes: ['t11', 't12', 't13', 't14', 't15', 't16', 't17', 't18', 't19']
  },
  {
    itemId: 'network_connection',
    allowedEventPrefixes: ['t11', 't12', 't13', 't14', 't15', 't16', 't17', 't18', 't19']
  },

  // TACTIC类道具 - 在需要策略的场景使用
  {
    itemId: 'red_envelope',
    allowedEventPrefixes: ['t3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15']
  },
  {
    itemId: 'towel',
    allowedEventPrefixes: ['t3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15']
  },
  {
    itemId: 'water_bottle',
    allowedEventPrefixes: ['t3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15']
  },
  {
    itemId: 'distraction',
    allowedEventPrefixes: ['t3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15']
  },
  {
    itemId: 'fake_call',
    allowedEventPrefixes: ['t3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15']
  },
  {
    itemId: 'water_swap',
    allowedEventPrefixes: ['t3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15']
  }
];

// 检查道具是否可以在当前场景使用
export function canUseItemInContext(
  itemId: string, 
  currentEvent: GameEvent | null,
  inventory: InventoryItem[]
): boolean {
  // 检查是否拥有该道具
  const item = inventory.find(i => i.id === itemId);
  if (!item || item.quantity <= 0) return false;

  // 特殊道具检查
  if (itemId === 'spy_pen' || itemId === 'vintage_wine') {
    return false; // 这些道具只能通过选择使用
  }

  if (!currentEvent) return false;

  // 查找道具的上下文规则
  const context = ITEM_CONTEXTS.find(c => c.itemId === itemId);
  if (!context) return false; // 如果没有规则，默认不可用

  // 如果总是可用
  if (context.alwaysAvailable) return true;

  // 检查事件ID前缀
  if (context.allowedEventPrefixes) {
    const eventPrefix = currentEvent.id.split('_')[0]; // 例如 't11' from 't11_loyalty'
    if (context.allowedEventPrefixes.includes(eventPrefix)) {
      return true;
    }
  }

  // 检查特定事件ID
  if (context.allowedEvents && context.allowedEvents.includes(currentEvent.id)) {
    return true;
  }

  // 检查回合
  if (context.allowedTurns && context.allowedTurns.includes(currentEvent.turn)) {
    return true;
  }

  return false;
}

// 获取当前场景可用的道具列表
export function getAvailableItemsInContext(
  inventory: InventoryItem[],
  currentEvent: GameEvent | null
): InventoryItem[] {
  // 先过滤出可用的道具，然后去重
  const availableMap = new Map<string, InventoryItem>();
  
  inventory.forEach(item => {
    if (canUseItemInContext(item.id, currentEvent, inventory)) {
      // 如果已存在，确保使用最新的数量
      if (availableMap.has(item.id)) {
        const existing = availableMap.get(item.id)!;
        // 使用数量更多的版本（理论上不应该有重复，但以防万一）
        if (item.quantity > existing.quantity) {
          availableMap.set(item.id, item);
        }
      } else {
        availableMap.set(item.id, item);
      }
    }
  });
  
  return Array.from(availableMap.values());
}
