import { PlayerStats, StatType } from './types';

export interface EndingTitle {
  id: string;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  condition: (stats: PlayerStats, turn: number) => boolean;
  priority: number; // 优先级，数字越大越优先
}

export const ENDING_TITLES: EndingTitle[] = [
  // 完美结局 - 所有指标都很高
  {
    id: 'perfect_survivor',
    title: { en: 'The Perfect Survivor', zh: '完美幸存者' },
    description: {
      en: 'You navigated the night with grace, maintaining your health, sobriety, and reputation. A true master of the corporate game.',
      zh: '你优雅地度过了这个夜晚，保持了健康、清醒和声誉。真正的职场大师。'
    },
    condition: (s, turn) => s.HEALTH >= 70 && s.SOBRIETY >= 70 && s.FACE >= 70 && turn >= 20,
    priority: 100
  },
  
  // 社交达人 - 面子极高
  {
    id: 'social_master',
    title: { en: 'Social Master', zh: '社交达人' },
    description: {
      en: 'You sacrificed your body for reputation. Everyone respects you, but at what cost?',
      zh: '你为了声誉牺牲了身体。所有人都尊重你，但代价是什么？'
    },
    condition: (s, turn) => s.FACE >= 90 && turn >= 20,
    priority: 90
  },
  
  // 健康至上 - 身体和清醒度都很高
  {
    id: 'health_guardian',
    title: { en: 'Health Guardian', zh: '健康守护者' },
    description: {
      en: 'You prioritized your well-being over everything else. You survived, but did you win?',
      zh: '你把健康放在第一位。你活下来了，但你赢了吗？'
    },
    condition: (s, turn) => s.HEALTH >= 80 && s.SOBRIETY >= 80 && turn >= 20,
    priority: 85
  },
  
  // 财富赢家 - 财富很高
  {
    id: 'wealth_winner',
    title: { en: 'Wealth Winner', zh: '财富赢家' },
    description: {
      en: 'You came out richer than you started. Money talks, and you listened well.',
      zh: '你出来时比开始时更富有。金钱会说话，你听得很清楚。'
    },
    condition: (s, turn) => s.WEALTH >= 50000 && turn >= 20,
    priority: 80
  },
  
  // 苟活专家 - 面子低但身体好
  {
    id: 'humble_survivor',
    title: { en: 'Humble Survivor', zh: '苟活专家' },
    description: {
      en: 'You kept your head down and survived. Sometimes, humility is the best strategy.',
      zh: '你低调地活了下来。有时候，谦逊是最好的策略。'
    },
    condition: (s, turn) => s.FACE < 30 && s.HEALTH >= 70 && s.SOBRIETY >= 50 && turn >= 20,
    priority: 75
  },
  
  // 铁肝战神 - 身体差但清醒
  {
    id: 'iron_liver',
    title: { en: 'Iron Liver', zh: '铁肝战神' },
    description: {
      en: 'Your body is broken, but your mind remains sharp. A testament to human resilience.',
      zh: '你的身体垮了，但你的头脑依然清醒。人类韧性的证明。'
    },
    condition: (s, turn) => s.HEALTH < 30 && s.SOBRIETY >= 60 && turn >= 20,
    priority: 70
  },
  
  // 平衡大师 - 各项指标都在中等水平
  {
    id: 'balanced_master',
    title: { en: 'Balanced Master', zh: '平衡大师' },
    description: {
      en: 'You found the perfect balance between survival and success. Not perfect, but sustainable.',
      zh: '你在生存和成功之间找到了完美的平衡。不完美，但可持续。'
    },
    condition: (s, turn) => {
      const avg = (s.HEALTH + s.SOBRIETY + s.FACE) / 3;
      return avg >= 40 && avg <= 70 && turn >= 20;
    },
    priority: 65
  },
  
  // 险胜者 - 各项指标都很低但活下来了
  {
    id: 'narrow_survivor',
    title: { en: 'Narrow Survivor', zh: '险胜者' },
    description: {
      en: 'You survived by the skin of your teeth. Everything is low, but you made it through.',
      zh: '你险胜活了下来。所有指标都很低，但你挺过来了。'
    },
    condition: (s, turn) => {
      const avg = (s.HEALTH + s.SOBRIETY + s.FACE) / 3;
      return avg < 40 && turn >= 20;
    },
    priority: 60
  },
  
  // 早期胜利 - 提前完成
  {
    id: 'early_winner',
    title: { en: 'Early Winner', zh: '提前胜利' },
    description: {
      en: 'You achieved victory before the night was over. Smart and efficient.',
      zh: '你在夜晚结束前就取得了胜利。聪明而高效。'
    },
    condition: (s, turn) => turn < 20 && s.HEALTH > 0 && s.SOBRIETY > 0 && s.FACE > 0,
    priority: 55
  },
  
  // 默认胜利者
  {
    id: 'survivor',
    title: { en: 'Survivor', zh: '幸存者' },
    description: {
      en: 'You made it through the night. The details are blurry, but you survived.',
      zh: '你度过了这个夜晚。细节已经模糊，但你活下来了。'
    },
    condition: (s, turn) => turn >= 20,
    priority: 50
  }
];

export function getEndingTitle(stats: PlayerStats, turn: number, lang: 'en' | 'zh'): EndingTitle {
  // 找到所有符合条件的标题，按优先级排序
  const matchingTitles = ENDING_TITLES
    .filter(title => title.condition(stats, turn))
    .sort((a, b) => b.priority - a.priority);
  
  // 返回优先级最高的
  return matchingTitles[0] || ENDING_TITLES[ENDING_TITLES.length - 1];
}
