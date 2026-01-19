import { PlayerStats } from './types';

export interface VictoryEnding {
  id: string;
  title: { en: string; zh: string };
  story: { en: string; zh: string };
  condition: (stats: PlayerStats, turn: number) => boolean;
  priority: number;
}

export const VICTORY_ENDINGS: VictoryEnding[] = [
  // 完美结局 - 所有指标都很高
  {
    id: 'perfect_survivor',
    title: { en: 'The Perfect Survivor', zh: '完美幸存者' },
    story: {
      en: `The bill was finally paid. ¥28,888. The boss signed it with a smile.

"刘超, you're something else tonight," he said, his voice warm with genuine respect. "I've seen many people try to survive these dinners. But you? You handled it perfectly. The client loved you. The team respects you. And look at you—still standing tall."

雷总 shook your hand firmly. "We're signing the contract. I want someone like you on our team."

You walked out of 江南汇 at 2 AM, the city lights blurring into a golden haze. Your phone buzzed—a promotion notification. Deputy Director, no longer just "Acting."

Your body was tired, but your mind was clear. You hadn't just survived the night. You'd mastered the game.

At home, you poured yourself a glass of water—no alcohol. You looked in the mirror and saw someone who had walked through fire and come out stronger.

Some nights change you. This was one of those nights. But unlike most people's stories, this one had a happy ending.

You earned it.`,
      zh: `账单终于付了。28,888元。老板笑着签了字。

"刘超，你今晚真是让我刮目相看，"他的声音里带着真正的尊重。"我见过很多人在这种饭局上挣扎。但你？你处理得完美无缺。客户喜欢你。团队尊重你。而且看看你——依然站得笔直。"

雷总有力地握了你的手。"我们要签合同了。我想要你这样的人在我们的团队里。"

凌晨2点，你走出了江南汇，城市的灯光模糊成一片金色的光晕。你的手机震动了一下——升职通知。副总监，不再是"代理"。

你的身体很累，但头脑很清醒。你不仅仅是撑过了这个夜晚。你掌握了这个游戏。

回到家，你给自己倒了一杯水——没有酒精。你看着镜子，看到了一个走过火焰却变得更强大的人。

有些夜晚会改变你。这就是那样的夜晚。但不像大多数人的故事，这个有一个幸福的结局。

这是你应得的。`
    },
    condition: (s, turn) => s.HEALTH >= 70 && s.SOBRIETY >= 70 && s.FACE >= 70 && turn >= 20,
    priority: 100
  },

  // 社交达人 - 面子极高
  {
    id: 'social_master',
    title: { en: 'Social Master', zh: '社交达人' },
    story: {
      en: `"A toast to 刘超!" The boss raised his glass. Everyone followed.

You couldn't remember how many toasts you'd survived. Your vision was blurry, your stomach churning, but you kept that perfect smile painted on your face. Because that's what a social master does.

They loved you. The client called you "brother." Your rival老张 looked on with jealousy as you closed the deal right there at the table.

When you finally stumbled out of the restaurant, the boss caught your arm. "You sacrificed yourself tonight. I won't forget that."

Three days later, the contract was signed. Two weeks later, you were promoted.

But the victory came with a cost. Your doctor called with test results. "Your liver enzymes are elevated. You need to stop drinking."

You looked at the framed contract on your wall. Worth it? You're not sure anymore.

But you won. And in this game, winning is everything.`,
      zh: `"敬刘超！"老板举起酒杯。所有人都跟着举杯。

你不记得你撑过了多少轮敬酒。你的视线模糊，胃里翻江倒海，但你脸上依然挂着完美的笑容。因为这就是社交大师的所作所为。

他们喜欢你。客户叫你"兄弟"。当你在桌上当场拿下订单时，你的对手老张嫉妒地看着你。

当你终于跌跌撞撞走出餐厅时，老板抓住了你的手臂。"你今晚牺牲了自己。我不会忘记的。"

三天后，合同签了。两周后，你升职了。

但胜利是有代价的。你的医生打电话来告诉你的检查结果。"你的肝酶升高了。你需要停止喝酒。"

你看着墙上装裱好的合同。值得吗？你不再确定了。

但你赢了。在这个游戏中，赢就是一切。`
    },
    condition: (s, turn) => s.FACE >= 90 && turn >= 20,
    priority: 90
  },

  // 健康守护者
  {
    id: 'health_guardian',
    title: { en: 'Health Guardian', zh: '健康守护者' },
    story: {
      en: `You were the only one still standing at the end.

Around you, they lay like fallen soldiers—老张 under the table, the client slumped in his chair, even the boss having trouble focusing. But you? Clear-eyed, steady-handed, perfectly sober.

"刘超, how are you still conscious?" the boss murred, impressed despite himself.

You smiled politely. "Just lucky, I guess."

The bill came. ¥35,000. They'd ordered way too much. You quietly calculated your share, paid your portion, and helped them get taxis.

You saved your health tonight. Your liver thanked you. Your head would thank you tomorrow morning.

But as you walked home alone, watching your drunk colleagues stumble into the night, you wondered—did you miss something? Was there a point to all that drinking you carefully avoided?

The next morning, your phone buzzed. Group chat photos from last night. Everyone looked happy. Everyone looked bonded.

You were in the photos too. Smiling. Sober. Healthy.

And completely alone.`,
      zh: `你是唯一还站着的人。

在你周围，他们像倒下的士兵——老张在桌子底下，客户瘫在椅子上，甚至老板都难以集中注意力。但你？眼睛清澈，手稳，完全清醒。

"刘超，你怎么还这么清醒？"老板嘟囔着，尽管自己也很佩服。

你礼貌地笑了笑。"只是运气好而已。"

账单来了。35,000元。他们点得太多了。你安静地算了自己那一份，付了钱，帮他们叫了出租车。

你今晚保住了你的健康。你的肝脏感谢你。你的头脑明天早上也会感谢你。

但当你独自走回家，看着你醉酒的同事跌跌撞撞消失在夜色中，你 wonder——你错过了什么吗？那些你小心避开的酒，有什么意义吗？

第二天早上，你的手机震动。昨晚的群聊照片。每个人看起来都很开心。每个人都看起来建立了联系。

你也在照片里。微笑着。清醒。健康。

但完全孤独。`
    },
    condition: (s, turn) => s.HEALTH >= 80 && s.SOBRIETY >= 80 && turn >= 20,
    priority: 85
  },

  // 财富赢家
  {
    id: 'wealth_winner',
    title: { en: 'Wealth Winner', zh: '财富赢家' },
    story: {
      en: `The bill arrived. ¥45,888. An astronomical sum.

Before you could reach for your wallet, the client stopped you. "This one's on me. You've earned it."

雷总 signed the check, then slid an envelope across the table. "A bonus. For closing the deal tonight."

You opened it later in the taxi. ¥50,000. Cash.

Your phone buzzed. Bank notification: Commission from the deal, ¥120,000 deposited.

You did the math in your head. Tonight's profit: ¥170,000. Minus the few hundred you spent on gifts and taxi. Net gain: astronomical.

You arrived home, poured a drink, and counted your winnings. The contract was signed. The commission was secured. And that envelope bonus...

Your boss called the next day. "Great job last night. By the way, we're restructuring. I want you as my new deputy."

You hung up and looked at your bank balance. ¥320,000 and climbing.

Money talks. And tonight, it was speaking your language loud and clear.`,
      zh: `账单到了。45,888元。一个天文数字。

你还没来得及伸手拿钱包，客户阻止了你。"这顿算我的。你应得的。"

雷总签了支票，然后滑过一个信封到桌子对面。"奖金。为了今晚签成的合同。"

你后来在出租车里打开它。50,000元。现金。

你的手机震动。银行通知：交易的佣金，120,000元已存入。

你在脑子里算了算。今晚的利润：170,000元。减去你在礼物和出租车上花的几百块。净收益：天文数字。

你回到家，倒了一杯酒，数着你的 winnings。合同签了。佣金到手了。还有那个信封奖金...

你的老板第二天打电话来。"昨晚干得漂亮。顺便说一句，我们要重组了。我想要你做我的新副手。"

你挂了电话，看着你的银行余额。320,000元，还在增长。

金钱会说话。而今晚，它在用你的语言大声清晰地说话。`
    },
    condition: (s, turn) => s.WEALTH >= 50000 && turn >= 20,
    priority: 80
  },

  // 苟活专家
  {
    id: 'humble_survivor',
    title: { en: 'Humble Survivor', zh: '苟活专家' },
    story: {
      en: `You kept your head down. You smiled when they insulted you. You laughed when they made fun of you. You accepted every "punishment drink" without complaint.

They called you "soft." They said you had no backbone.老张 smirked every time you took another hit to your dignity.

But here's what they didn't see: you were playing the long game.

When the bill came and the chaos erupted, you were the only one clear-headed enough to handle it. You negotiated with the restaurant manager. You helped the client into a taxi. You made sure everyone got home safe.

The next morning, your phone rang. It was雷总.

"刘超, I want to thank you for last night. You were the only one who kept their cool. I respect that."

He paused. "The contract's signed. But I want to work with you personally on the project. Not your boss. You."

You won. Not by being the loudest or the strongest. But by being the smartest.

And sometimes, that's enough.`,
      zh: `你低着头。他们侮辱你时你微笑。他们嘲笑你时你大笑。你毫无怨言地接受了每一杯"罚酒"。

他们叫你"软弱"。他们说你是软骨头。每次你丢掉尊严，老张都会冷笑。

但他们没看到的是：你在玩长期游戏。

当账单来了、混乱爆发时，你是唯一头脑清醒能处理的人。你和餐厅经理谈判。你帮客户上了出租车。你确保每个人都安全到家。

第二天早上，你的电话响了。是雷总。

"刘超，我想感谢你昨晚的所作所为。你是唯一保持冷静的人。我尊重这一点。"

他停顿了一下。"合同签了。但我想在项目上和你个人合作。不是你的老板。你。"

你赢了。不是靠成为最响亮或最强壮的。而是靠成为最聪明的。

有时候，这就够了。`
    },
    condition: (s, turn) => s.FACE < 30 && s.HEALTH >= 70 && s.SOBRIETY >= 50 && turn >= 20,
    priority: 75
  },

  // 铁肝战神
  {
    id: 'iron_liver',
    title: { en: 'Iron Liver', zh: '铁肝战神' },
    story: {
      en: `Your body was screaming. Every organ, every cell, begging you to stop.

But you didn't. Couldn't. They challenged you, and you met every challenge. Drink for drink. Toast for toast. When老张 went down, you were still standing. When the client slurred, you were articulate.

By the end, they weren't toasting to the deal anymore. They were toasting to you.

"刘超's liver is made of steel!" the boss shouted, slamming his glass on the table.

You stumbled out at 3 AM, barely able to walk, but you did it. You survived.

The next week, the doctor's face was grim. "How are you still alive? Your liver enzymes are critical. You need to stop drinking. Forever."

You nodded, not really listening. Because in your pocket was the contract. Signed. Sealed. Delivered.

And in your phone was a message from the boss: "You're a legend. Come see me Monday. We need to talk about your future."

Was it worth it? Your body would never be the same. But you'd won. And somehow, that made the pain fade into the background.

They called you 铁肝战神. Tonight, you earned that title.`,
      zh: `你的身体在尖叫。每个器官，每个细胞，都在乞求你停下来。

但你没有。不能。他们挑战你，你迎接每一个挑战。一杯接一杯。一轮接一轮。当老张倒下时，你还站着。当客户说话含糊时，你仍然清晰流利。

到最后，他们不再为合同举杯了。他们在为你举杯。

"刘超的肝是钢铁做的！"老板喊道，把杯子砸在桌子上。

凌晨3点你跌跌撞撞走出来，几乎走不动路，但你做到了。你活下来了。

下一周，医生的脸很严峻。"你怎么还活着？你的肝酶指标危险。你需要停止喝酒。永远。"

你点点头，没有真的在听。因为在你口袋里是那份合同。签了。封了。交付了。

而在你的手机里有一条老板的消息："你是个传说。周一来见我。我们需要谈谈你的未来。"

值得吗？你的身体再也不会和以前一样了。但你赢了。不知何故，这让疼痛淡出了背景。

他们叫你铁肝战神。今晚，你赢得了这个称号。`
    },
    condition: (s, turn) => s.HEALTH < 30 && s.SOBRIETY >= 60 && turn >= 20,
    priority: 70
  },

  // 平衡大师
  {
    id: 'balanced_master',
    title: { en: 'Balanced Master', zh: '平衡大师' },
    story: {
      en: `You didn't excel at anything tonight. But you didn't fail at anything either.

Health? Still standing. Sobriety? A bit buzzed, but functional. Face? Some respect, some jokes. Wealth? Spent reasonable, gained reasonable.

The boss's final assessment: "刘超, you're reliable."

It wasn't a glowing endorsement. It wasn't a legendary performance. But it was enough.

雷总 signed the contract with a nod. "Solid. You're a solid guy."

老张 couldn't find any angle to attack you. You were too average to be a threat, too competent to be ignored.

You walked out of the restaurant feeling... okay. Not great, not terrible. Just okay.

The next morning, your head hurt a little. Your wallet was lighter. But your phone had a message: "Contract confirmed. Good work."

And maybe that's the real victory in this game. Not the spectacular triumphs or the dramatic failures. Just showing up, doing your job, and making it through.

Average. Balanced. Sustainable.

Some might call it boring. You call it survival.`,
      zh: `你今晚没有任何出色的地方。但你也没有任何失败的地方。

健康？还站着。清醒？有点醉，但还能运作。面子？一些尊重，一些笑话。财富？花得合理，赚得合理。

老板的最终评价："刘超，你很可靠。"

这不是一个光彩的推荐。这不是一个传奇的表现。但这足够了。

雷总点头签了合同。"扎实。你是个靠谱的人。"

老张找不到任何角度攻击你。你太平均了构不成威胁，又太能干了不能被忽视。

你走出餐厅感觉...还好。不太好，也不太坏。就是还好。

第二天早上，你的头有点痛。你的钱包轻了一些。但你的手机有一条消息："合同确认了。干得好。"

也许这才是这个游戏的真正胜利。不是那些耀眼的胜利或戏剧性的失败。只是出现，做你的工作，活下来。

平均。平衡。可持续。

有些人可能称之为无聊。你称之为生存。`
    },
    condition: (s, turn) => {
      const avg = (s.HEALTH + s.SOBRIETY + s.FACE) / 3;
      return avg >= 40 && avg <= 70 && turn >= 20;
    },
    priority: 65
  },

  // 险胜者
  {
    id: 'narrow_survivor',
    title: { en: 'Narrow Survivor', zh: '险胜者' },
    story: {
      en: `You have no idea how you made it.

The last few hours are a blur of toasts and challenges and punishments. You remember faces swimming in your vision. You remember your hands shaking as you raised your glass. You remember the room spinning.

But you remember one thing clearly: the client's final words.

"刘超, I don't know how you're still conscious. But I respect that. The deal is done."

When you woke up the next afternoon, your head felt like it had been split open. Your phone had 17 missed calls. Your wallet was empty.

But the contract was signed. The job was done.

Your boss left a voicemail: "Next time, maybe don't push it so close to the edge. But... good work."

You dragged yourself to the kitchen, drank three glasses of water, and collapsed on the couch.

You'd won. Barely. By the skin of your teeth. On the razor's edge.

But a win is a win. And you're still here to tell the tale.

Barely.`,
      zh: `你不知道你是怎么做到的。

最后几个小时是敬酒、挑战和惩罚的模糊记忆。你记得脸上的表情在你的视线中游动。你记得你举杯时双手颤抖。你记得房间在旋转。

但你清楚地记得一件事：客户的最后的话。

"刘超，我不知道你怎么还能清醒。但我尊重这一点。交易完成了。"

当你第二天下午醒来时，你的头感觉像被劈开了。你的手机有17个未接来电。你的钱包空了。

但合同签了。工作完成了。

你的老板留了一条语音："下次，也许不要逼自己到边缘。但是...干得好。"

你把自己拖到厨房，喝了三杯水，倒在了沙发上。

你赢了。勉强地。险险地。在刀刃边缘。

但赢就是赢。你还在这里讲述这个故事。

勉强地。`
    },
    condition: (s, turn) => {
      const avg = (s.HEALTH + s.SOBRIETY + s.FACE) / 3;
      return avg < 40 && turn >= 20;
    },
    priority: 60
  },

  // 默认胜利者
  {
    id: 'survivor',
    title: { en: 'Survivor', zh: '幸存者' },
    story: {
      en: `The restaurant doors closed behind you. 2:47 AM.

You stood on the sidewalk, the cool night air hitting your face. You'd survived.

Inside, the bill was paid. The contract was signed. The client was satisfied. Your boss was... well, your boss.

老张 had passed out in the corner. The client could barely stand. But you? You were still here. Still functioning. Still in the game.

Your phone buzzed. A notification from the company:

"CONTRACT CONFIRMED. Commission will be processed within 7 business days. Great work, team."

You smiled for the first time in hours. It was done.

The taxi ride home felt like a dream. The city lights blurred past. You replayed the night's highlights in your head—the good toasts, the avoided disasters, the moments when you almost broke but didn't.

When you finally unlocked your apartment door and collapsed onto your bed, you knew one thing for certain:

You'd made it through. Not perfectly. Not beautifully. But you'd made it.

And in this game, sometimes that's enough.

Tomorrow would come with its own problems. Hangovers. Regrets. The question of whether any of this was worth it.

But tonight? Tonight, you could sleep.

Victory, however you define it, was yours.`,
      zh: `餐厅的门在你身后关上。凌晨2:47。

你站在人行道上，凉爽的夜风吹在你的脸上。你活下来了。

在里面，账单付了。合同签了。客户满意了。你的老板...嗯，还是你的老板。

老张在角落里昏过去了。客户几乎站不住。但你？你还在这里。还能运作。还在游戏里。

你的手机震动。公司的通知：

"合同已确认。佣金将在7个工作日内处理。干得好，团队。"

几小时来你第一次笑了。结束了。

出租车回家的路感觉像一场梦。城市的灯光模糊地掠过。你在脑海里重播今晚的亮点——好的敬酒，避免的灾难，那些你几乎崩溃但没有的时刻。

当你终于打开公寓门倒到床上时，你确定了一件事：

你撑过来了。不完美。不漂亮。但你撑过来了。

在这个游戏中，有时这就够了。

明天会有它自己的问题。宿醉。后悔。这一切是否值得的问题。

但今晚？今晚，你可以睡了。

胜利，无论你如何定义，是你的了。`
    },
    condition: (s, turn) => turn >= 20,
    priority: 50
  },

  // 内鬼线 - 特殊结局
  {
    id: 'whistleblower',
    title: { en: 'The Whistleblower', zh: '正道的光' },
    story: {
      en: `The restaurant bathroom mirror showed you a stranger's face—pale, determined, terrified.

In your pocket: the recording pen. 4 hours of evidence. Bribery. Fraud. Conspiracy.

雷总 wasn't just a difficult client. He was a criminal. And your boss wasn't just accommodating him—he was part of it.

You made your choice. Slipped out the back door. Called the authorities.

When they arrived, the dinner was in full swing. Toasts. Laughter. The sound of a deal being made.

Then the restaurant doors burst open. Investigators. Flash badges. "雷总, you're under arrest."

The chaos was absolute. Your boss turned pale, then angry. "刘超, what did you do?"

You stood up, voice shaking but clear. "What I should have done from the start."

The next months were a blur of statements, evidence, testimony. The company collapsed. Your boss went to prison.老张 turned witness and disappeared.

But you? You got a call from a different company.

"We saw what you did. That took courage. We need people like you."

The job paid less than the path you were on. But when you went to sleep at night, you didn't see their faces anymore.

You saw the mirror in that restaurant bathroom. The moment you chose who you wanted to be.

Some endings aren't about winning or losing. They're about choosing.

And you chose.`,
      zh: `餐厅洗手间的镜子向你展示了一个陌生人的脸——苍白、坚定、恐惧。

在你口袋里：录音笔。4小时的证据。贿赂。欺诈。阴谋。

雷总不仅仅是一个难搞的客户。他是一个罪犯。而你的老板不仅仅是迁就他——他是同谋。

你做出了你的选择。从后门溜走。拨打了当局电话。

当他们到达时，晚餐正在高潮。敬酒。笑声。交易达成的声音。

然后餐厅门被撞开。调查员。亮徽章。"雷总，你被捕了。"

混乱是绝对的。你的老板脸色变白，然后愤怒。"刘超，你做了什么？"

你站起来，声音颤抖但清晰。"我一开始就应该做的事。"

接下来的几个月是声明、证据、证词的模糊记忆。公司崩溃了。你的老板进了监狱。老张变成证人消失了。

但你？你接到另一家公司的电话。

"我们看到你做了什么。那需要勇气。我们需要你这样的人。"

这份工作比你原本走的路薪水少。但当你晚上睡觉时，你再也看不到他们的脸了。

你看到了餐厅洗手间里的那面镜子。那个你选择成为谁的时刻。

有些结局不是关于赢或输。它们是关于选择。

而你选择了。`
    },
    condition: (s, turn) => turn >= 15 && s.FACE < 50, // 这个条件会在storyData的特殊选择中触发
    priority: 1000
  }
];

export function getVictoryEnding(stats: PlayerStats, turn: number, lang: 'en' | 'zh', specialEndingId?: string): VictoryEnding {
  // 如果有特殊结局ID（如内鬼线），直接返回
  if (specialEndingId) {
    const special = VICTORY_ENDINGS.find(e => e.id === specialEndingId);
    if (special) return special;
  }

  // 否则根据条件找到所有匹配的结局，按优先级排序
  const matchings = VICTORY_ENDINGS
    .filter(ending => ending.condition(stats, turn))
    .sort((a, b) => b.priority - a.priority);

  // 返回优先级最高的
  return matchings[0] || VICTORY_ENDINGS[VICTORY_ENDINGS.length - 1];
}
