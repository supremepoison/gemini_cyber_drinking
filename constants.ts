import { StatType, ShopItemContent, Scenario, Badge } from './types';

export const MAX_STATS = {
  [StatType.HEALTH]: 100,
  [StatType.SOBRIETY]: 100,
  [StatType.FACE]: 100, 
  [StatType.WEALTH]: 999999,
};

export const MIN_STATS = 0;

export const WIN_TURN = 20; 
export const STAGE_LENGTH = 5;

export const COVER_IMAGE_URL = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop"; 

// Updated stages
export const STAGES = {
  1: { en: "The Arrival", zh: "第一阶段：排位与凉菜 (Turn 1-5)" },
  2: { en: "The Assault", zh: "第二阶段：主菜与激战 (Turn 6-10)" },
  3: { en: "The Chaos", zh: "第三阶段：混战与游戏 (Turn 11-15)" },
  4: { en: "The Bill", zh: "第四阶段：残局与买单 (Turn 16-20)" }, 
};

export const WIN_WEALTH = 100000; 

export const SHOP_ITEMS: ShopItemContent[] = [
  // --- BODY / RECOVERY (Nerfed) ---
  {
    id: 'milk',
    category: 'BODY',
    name: { en: 'Yoghurt', zh: '纯牛奶' },
    description: { en: 'Coat stomach.', zh: '胃黏膜保护剂。被动减少少量身体伤害，但显得孩子气。' },
    cost: 50,
    effect: 'Passive: Small Health protect.'
  },
  {
    id: 'liver_pills',
    category: 'BODY',
    name: { en: 'Detox Pills', zh: '进口海王金樽' },
    description: { en: 'Heal +15 Health.', zh: '护肝片。无法逆天改命，只能稍微续命。恢复 +15 身体值。' },
    cost: 300,
    effect: 'Active: +15 Health.'
  },
  {
    id: 'honey_water',
    category: 'BODY',
    name: { en: 'Honey Water', zh: '保温杯蜂蜜水' },
    description: { en: 'Sober up.', zh: '稍微稀释一点酒精。恢复 +10 清醒值。' },
    cost: 100,
    effect: 'Active: +10 Sobriety.'
  },

  // --- SOCIAL / FACE (High Cost / High Risk) ---
  {
    id: 'vintage_wine',
    category: 'SOCIAL',
    name: { en: 'Vintage Wine', zh: '自带陈年茅台' },
    description: { en: 'Power move.', zh: '反客为主。面子+30，但你需要带头喝，身体/清醒伤害加倍。' },
    cost: 3000,
    effect: 'Active: High Face, High Self-Damage.'
  },
  {
    id: 'cigarettes',
    category: 'SOCIAL',
    name: { en: 'Premium Cigs', zh: '软中华' },
    description: { en: 'Social tool.', zh: '社交硬通货。递烟可以缓解一次尴尬局面，恢复少量面子 (+10)。' },
    cost: 150,
    effect: 'Active: +10 Face.'
  },
  {
    id: 'gift',
    category: 'SOCIAL',
    name: { en: 'Luxury Gift', zh: '限量伴手礼' },
    description: { en: 'For the boss.', zh: '给领导的礼物。可抵消一次重大失误（避免面子归零），仅限一次。' },
    cost: 2500,
    effect: 'Active: Save from Social Death.'
  },

  // --- TACTIC / TRICKS (Strategic) ---
  {
    id: 'spy_pen',
    category: 'TACTIC',
    name: { en: 'Spy Pen', zh: '录音笔' },
    description: { en: 'Record evidence.', zh: '开启【内鬼线】的必需品。不加属性，只改命运。' },
    cost: 800,
    effect: 'Active: Unlocks Secret Ending.'
  },
  {
    id: 'red_envelope',
    category: 'TACTIC',
    name: { en: 'Red Envelope', zh: '给服务员的红包' },
    description: { en: 'Swap wine.', zh: '买通服务员换水。本轮免伤，但容易被发现，面子收益减半。' },
    cost: 600,
    effect: 'Active: Drink without damage, low Face gain.'
  },
  {
    id: 'fake_call',
    category: 'TACTIC',
    name: { en: 'Fake Call App', zh: '电话模拟器' },
    description: { en: 'Escape.', zh: '躲出去一轮。虽然不喝酒，但把领导晾在一边会掉面子 (-10)。' },
    cost: 0,
    effect: 'Active: Skip turn, lose Face.'
  },
  {
    id: 'towel',
    category: 'TACTIC',
    name: { en: 'Thick Towel', zh: '深色热毛巾' },
    description: { en: 'Spit drink.', zh: '吐酒神器。减少 50% 的清醒值扣除。' },
    cost: 50,
    effect: 'Active: Reduce Sobriety loss.'
  }
];

// Badges for Endings
export const BADGES: Badge[] = [
  {
    id: 'whistleblower',
    name: '正道的光',
    description: '你没有在这个染缸里沉沦，而是选择了揭露真相。',
    color: 'text-purple-400 border-purple-400',
    condition: (s, turn) => turn >= 20 && s.FACE < 50 // Logic handled by specific ending node
  },
  {
    id: 'tycoon',
    name: '职场影帝',
    description: '面子极高(>90)，且活着走出去。',
    color: 'text-yellow-400 border-yellow-400',
    condition: (s) => s.FACE >= 90 && s.SOBRIETY > 0 && s.HEALTH > 0
  },
  {
    id: 'survivor',
    name: '苟活专家',
    description: '面子丢光了(<20)，但身体倍儿棒(>80)。',
    color: 'text-green-400 border-green-400',
    condition: (s) => s.FACE < 20 && s.HEALTH > 80
  },
  {
    id: 'wallet_hero',
    name: '冤大头',
    description: '这顿饭花光了你的积蓄，值得吗？',
    color: 'text-red-400 border-red-400',
    condition: (s) => s.WEALTH < 500
  },
  {
    id: 'liver_king',
    name: '铁肝战神',
    description: '你是怎么在身体几乎崩溃(<10)的情况下保持清醒的？',
    color: 'text-blue-400 border-blue-400',
    condition: (s) => s.HEALTH < 10 && s.SOBRIETY > 50
  }
];

export const TRANSLATIONS = {
  en: {
    startTitle: "THE",
    startTitle2: "BANQUET",
    startDesc: "Act 1-20: The Corporate Dinner.\n\nTonight, you are Li Mo. Your goal isn't just to drink—it's to survive the corporate jungle until the bill is paid.",
    startBtn: "TAKE SEAT",
    loading: "CALCULATING...",
    loadingIdentity: "PREPARING SCENE...",
    selectTitle: "SELECT SCENARIO",
    statBody: "BODY",
    statMind: "MIND",
    statFace: "FACE",
    statCash: "CASH",
    turn: "TURN",
    stage: "PHASE",
    gameOver: "COLLAPSED",
    victory: "SURVIVED",
    reboot: "RETRY",
    select: "CHOOSE",
    turnsSurvived: "Turns",
    finalNetWorth: "Net Worth",
    option: "OPTION",
    predictedImpact: "Impact",
    logs: "HISTORY",
    introTitle: "BRIEFING",
    shopTitle: "PREPARATION",
    shopDesc: "Stock up. Items are weak; only strategy saves you.",
    buy: "BUY",
    owned: "OWN",
    continue: "ENTER ROOM",
    begin: "START",
    inventory: "ITEMS",
    fallbackError: "Error",
    fallbackDesc: "...",
    fallbackChoice1: "...",
    fallbackOutcome1: "...",
    fallbackChoice2: "...",
    fallbackOutcome2: "...",
    endingTitle: "PERFORMANCE REVIEW",
    generatingEnding: "ANALYZING...",
    shopCatBody: "RECOVERY",
    shopCatSocial: "SOCIAL",
    shopCatTactic: "TACTICS",
    badge: "BADGE AWARDED",
  },
  zh: {
    startTitle: "逃酒",
    startTitle2: "刘超",
    startDesc: "这是一场残酷的 20 轮商务宴请。\n\n**警告：游戏难度已提升。**\n\n道具只能救急，不能救命。\n你要在“身体崩溃”和“得罪领导”之间做极限选择。\n带上录音笔可能有意外收获。",
    startBtn: "入座",
    loading: "推杯换盏中...",
    loadingIdentity: "正在布置场景...",
    selectTitle: "选择剧本",
    statBody: "身体状况",
    statMind: "清醒程度",
    statFace: "社交面子",
    statCash: "钱包余额",
    turn: "轮次",
    stage: "阶段",
    gameOver: "出局",
    victory: "全身而退",
    reboot: "再次入局",
    select: "决策",
    turnsSurvived: "坚持轮数",
    finalNetWorth: "剩余资产",
    option: "抉择",
    predictedImpact: "后果",
    logs: "酒局记录",
    introTitle: "背景提要",
    shopTitle: "战前准备",
    shopDesc: "请谨慎消费。道具效果有限，关键看怎么用。",
    buy: "购买",
    owned: "持有",
    continue: "推门进入",
    begin: "开始",
    inventory: "随身物品",
    fallbackError: "连接断开",
    fallbackDesc: "大脑一片空白...",
    fallbackChoice1: "喝杯水",
    fallbackOutcome1: "稍微缓了一点。",
    fallbackChoice2: "假装微笑",
    fallbackOutcome2: "只能尴尬陪笑。",
    endingTitle: "酒局结算",
    generatingEnding: "正在生成结局评价...",
    shopCatBody: "身体/恢复",
    shopCatSocial: "社交/面子",
    shopCatTactic: "策略/道具",
    badge: "获得勋章",
  }
};

export const FIXED_SCENARIO: Scenario = {
  id: 'sales_dinner_hard',
  name: '晋升之夜：鸿门宴',
  description: '王总的局，今晚只有这一场，但要喝足 20 轮。你的竞争对手老张、还有那位传说中极其难搞的大客户“雷总”都在。',
  difficulty: 'Hard',
  storyIntro: `
    **你是李默，32岁，销售副总监。**
    
    今晚在“江南汇”顶级包厢，是一场定生死的局。
    主宾是掌握千万订单的雷总（千杯不倒），主陪是你的顶头上司王总（笑面虎）。
    作陪的是你和死对头老张（阴险小人）。
    
    **生存法则：**
    1. 身体和清醒度归零都会导致失败。
    2. 面子归零意味着被踢出局。
    3. 道具效果微弱，请在关键节点使用。
    4. 录音笔可以开启隐藏路线，但会让你陷入巨大的心理压力。
    
    深吸一口气，推开了那扇厚重的包厢大门。
  `,
  initialStats: {
    [StatType.HEALTH]: 70, 
    [StatType.SOBRIETY]: 100,
    [StatType.FACE]: 40,
    [StatType.WEALTH]: 3000, // Reduced starting wealth to make choices harder
  },
  startEventId: 't1_seating'
};