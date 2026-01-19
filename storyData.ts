import { GameEvent, StatType } from './types';

// Images focusing on the dinner environment nuances
const IMG_DINNER_OVERVIEW = "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070"; 
const IMG_DINNER_CLOSEUP = "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974"; 
const IMG_BOSS = "https://images.unsplash.com/photo-1556125574-d7f275d6eb0b?q=80&w=2670"; 
const IMG_CHEERS = "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=2574"; 
const IMG_BILL = "https://images.unsplash.com/photo-1554672408-730436b60dde?q=80&w=2526"; 
const IMG_TOILET = "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?q=80&w=2574"; 
const IMG_CHAOS = "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?q=80&w=2672"; 
const IMG_DAWN = "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2670";
const IMG_SPY = "https://images.unsplash.com/photo-1496360341764-90807604f810?q=80&w=2670"; 

// Helper
const createNode = (
  id: string,
  turn: number,
  bgImage: string,
  titleZh: string,
  descZh: string,
  choicesZh: any[],
  titleEn: string,
  descEn: string,
  choicesEn: any[]
): { zh: GameEvent, en: GameEvent } => {
  return {
    zh: {
      id,
      turn,
      title: titleZh,
      description: descZh,
      backgroundImage: bgImage,
      choices: choicesZh.map(c => ({
        text: c.text,
        outcomeNarrative: c.outcome,
        statChanges: c.stats,
        itemUsed: c.item,
        nextEventId: c.next
      }))
    },
    en: { 
      id,
      turn,
      title: titleEn || titleZh,
      description: descEn || descZh,
      backgroundImage: bgImage,
      choices: choicesEn ? choicesEn.map(c => ({
        text: c.text,
        outcomeNarrative: c.outcome,
        statChanges: c.stats,
        itemUsed: c.item,
        nextEventId: c.next
      })) : choicesZh.map(c => ({...c, text: c.text + " (EN)", nextEventId: c.next}))
    }
  };
};

// LOGIC UPDATE: Heavy penalties for drinking (-15 to -30). Face is hard to earn. Items are weak.

export const STORY_TREE: Record<string, { zh: GameEvent, en: GameEvent }> = {
  
  // --- TURN 1: SEATING POLITICS ---
  't1_seating': createNode(
    't1_seating', 1, IMG_DINNER_OVERVIEW,
    "第一轮：座次博弈",
    "你提前到了包厢。主宾位对着门（雷总），主陪位在主宾左手（王总）。\n座次决定了你今晚的挡酒压力。",
    [
      { text: "坐末席（最安全，最卑微）", outcome: "你选择了上菜口的位置。王总看都没看你一眼。虽然安全，但这让你的存在感极低。", stats: { FACE: -5, SOBRIETY: 0 }, next: 't2_cold_dish' },
      { text: "坐王总右手边（二陪位）", outcome: "高风险高回报。王总皱了皱眉：“小李今天很有冲劲嘛。”你在这个位置必须帮领导挡酒。", stats: { FACE: 10, HEALTH: -5, SOBRIETY: -5 }, next: 't2_cold_dish' }, 
      { text: "道具：自带陈年茅台", item: 'vintage_wine', outcome: "你把3000块的茅台往桌上一放，全场侧目。王总大喜让你坐身边。但代价是，今晚这酒你必须带头喝。", stats: { FACE: 30, HEALTH: -10, WEALTH: 0 }, next: 't2_cold_dish' }
    ],
    "Turn 1: Seating", "Where do you sit?", []
  ),

  // --- TURN 2: COLD DISHES ---
  't2_cold_dish': createNode(
    't2_cold_dish', 2, IMG_DINNER_CLOSEUP,
    "第二轮：凉菜铺垫",
    "老张最后才来，满头大汗地自罚了一杯。凉菜上了，雷总没动筷子，大家都不敢动。你的胃已经在隐隐作痛。",
    [
      { text: "忍着不吃", outcome: "空腹喝酒是大忌。你的胃黏膜在抗议。", stats: { HEALTH: -5 }, next: 't3_opening' },
      { text: "偷吃几粒花生米", outcome: "趁人不备吃了几口。虽然不雅（扣面子），但胃里舒服了点。", stats: { HEALTH: 5, FACE: -5 }, next: 't3_opening' },
      { text: "道具：喝纯牛奶", item: 'milk', outcome: "你当众喝了一盒牛奶。雷总笑了：“小李还是个孩子啊。” 胃保护住了，但场面一度尴尬。", stats: { HEALTH: 10, FACE: -10 }, next: 't3_opening' }
    ],
    "Turn 2: Preparation", "Coat your stomach.", []
  ),

  // --- TURN 3: OPENING TOAST ---
  't3_opening': createNode(
    't3_opening', 3, IMG_BOSS,
    "第三轮：提杯开场",
    "王总提议：“第一杯酒，敬雷总。感情深，一口闷。” 这是一个满杯（约1两半）。",
    [
      { text: "一口闷（标准动作）", outcome: "辛辣的液体顺着喉咙烧下去。王总满意地点头。", stats: { FACE: 5, HEALTH: -10, SOBRIETY: -15 }, next: 't4_hierarchy' },
      { text: "道具：给红包换水", item: 'red_envelope', outcome: "服务员给你倒的是矿泉水。你演得很痛苦。王总似乎看出来了，但没拆穿。面子收益减半。", stats: { FACE: 2, SOBRIETY: 0 }, next: 't4_hierarchy' },
      { text: "分三口喝完", outcome: "你没敢一口闷。雷总看了你一眼：“小李养鱼呢？” 气氛瞬间冷了。", stats: { FACE: -15, SOBRIETY: -5 }, next: 't4_hierarchy' }
    ],
    "Turn 3: The Opening", "The first toast.", []
  ),

  // --- TURN 4: HIERARCHY ATTACK ---
  't4_hierarchy': createNode(
    't4_hierarchy', 4, IMG_CHEERS,
    "第四轮：等级压制",
    "雷总看着你和老张：“听说你们在争副总？今天谁表现好，我这单子就支持谁。来，打个样，连干三杯。”",
    [
      { text: "拼了！连干三杯！", outcome: "三杯下肚，天旋地转。你的胃在燃烧，但雷总带头鼓掌。", stats: { FACE: 20, HEALTH: -25, SOBRIETY: -30 }, next: 't5_fish' },
      { text: "认怂，只喝一杯", outcome: "“雷总，我真不行。”你只喝了一杯。雷总转头看向老张，不再理你。", stats: { FACE: -20, SOBRIETY: -10 }, next: 't5_fish' },
      { text: "道具：送限量礼物", item: 'gift', outcome: "你拿出礼物转移话题。雷总被礼物吸引，忘了罚酒的事。老张在旁边气得牙痒痒。", stats: { FACE: 15, SOBRIETY: 0 }, next: 't5_fish' }
    ],
    "Turn 4: Hierarchy", "Who drinks first?", []
  ),

  // --- TURN 5: FISH HEAD LOGIC ---
  't5_fish': createNode(
    't5_fish', 5, IMG_DINNER_CLOSEUP,
    "第五轮：鱼头酒",
    "“鸿运当头”。转盘转动，鱼头不偏不倚停在你面前。规矩是“头三尾四”。必须喝三杯。",
    [
      { text: "硬着头皮喝", outcome: "又是三杯。你感觉已经快到极限了，手开始发抖。", stats: { HEALTH: -15, SOBRIETY: -25, FACE: 5 }, next: 't6_rivalry' },
      { text: "借口去厕所逃酒", outcome: "你尿遁了。回来时发现鱼头已经被转走了，但大家看你的眼神充满了鄙视。", stats: { FACE: -25, SOBRIETY: 0 }, next: 't6_rivalry' },
      { text: "耍滑头只喝一口", outcome: "你只抿了一口。王总冷冷地说：“小李，不懂规矩啊。”", stats: { FACE: -15, SOBRIETY: -5 }, next: 't6_rivalry' }
    ],
    "Turn 5: Fish Head", "The fish points at you.", []
  ),

  // --- TURN 6: RIVALRY ---
  't6_rivalry': createNode(
    't6_rivalry', 6, IMG_DINNER_OVERVIEW,
    "第六轮：老张的杀招",
    "老张满脸通红，端着满满一大杯（3两）过来：“李总，咱俩共事五年了，这杯酒必须喝。我不欺负你，我干了，你随意。”",
    [
      { text: "不蒸馒头争口气", outcome: "你也是一口闷。喝完差点当场吐出来。伤敌一千，自损八百。", stats: { HEALTH: -20, SOBRIETY: -25, FACE: 15 }, next: 't7_client_demand' },
      { text: "认怂，喝半杯", outcome: "你喝了一半。老张冷笑：“李总看来是看不起我啊。”", stats: { FACE: -10, SOBRIETY: -10 }, next: 't7_client_demand' },
      { text: "道具：热毛巾吐酒", item: 'towel', outcome: "喝完立刻用毛巾捂嘴，吐了一大半。虽然有点狼狈，但保住了半条命。", stats: { SOBRIETY: -10, FACE: 5 }, next: 't7_client_demand' }
    ],
    "Turn 6: Rivalry", "Zhang attacks.", []
  ),

  // --- TURN 7: CLIENT DEMAND ---
  't7_client_demand': createNode(
    't7_client_demand', 7, IMG_BOSS,
    "第七轮：雷总的刁难",
    "雷总把红酒倒进白酒里：“咱们玩点刺激的，三中全会。谁喝了这杯混酒，这合同我就先看谁的。”",
    [
      { text: "拿命换合同", outcome: "混酒下肚，你的五脏六腑都在翻腾。这是自杀式的喝法。", stats: { HEALTH: -30, SOBRIETY: -35, FACE: 25 }, next: 't8_bathroom' },
      { text: "婉拒", outcome: "“雷总，混酒真会出人命。”雷总把杯子重重一放：“没劲。”", stats: { FACE: -20, HEALTH: 0 }, next: 't8_bathroom' },
      { text: "祸水东引给老张", outcome: "“老张酒量好，让他来！”老张被迫喝了，他狠狠瞪了你一眼。你保住了命，但结下了死仇。", stats: { FACE: -5, SOBRIETY: 0 }, next: 't8_bathroom' }
    ],
    "Turn 7: Demand", "Mix drinks?", []
  ),

  // --- TURN 8: BATHROOM BREAK ---
  't8_bathroom': createNode(
    't8_bathroom', 8, IMG_TOILET,
    "第八轮：中场休息",
    "你摇摇晃晃地冲进洗手间。镜子里的你面色惨白，冷汗直流。",
    [
      { text: "抠喉催吐", outcome: "剧烈的呕吐。虽然伤食道（扣健康），但你把大部分酒精吐了出来，清醒了不少。", stats: { SOBRIETY: 25, HEALTH: -15 }, next: 't9_bomb' },
      { text: "用冷水洗脸", outcome: "冷水让你稍微清醒了一点点。效果有限。", stats: { SOBRIETY: 5 }, next: 't9_bomb' },
      { text: "道具：海王金樽", item: 'liver_pills', outcome: "吃下护肝片。胃里稍微舒服了一点，但这只是杯水车薪。", stats: { HEALTH: 15, SOBRIETY: 5 }, next: 't9_bomb' }
    ],
    "Turn 8: Break", "Bathroom tactics.", []
  ),

  // --- TURN 9: THE BOMB ---
  't9_bomb': createNode(
    't9_bomb', 9, IMG_CHAOS,
    "第九轮：深水炸弹",
    "回到座位，噩梦开始了。王总点了啤酒，正在往白酒里扔杯子：“深水炸弹，一人两颗。”",
    [
      { text: "硬着头皮喝", outcome: "气体加速酒精吸收。喝完第一颗，你几乎失去意识。喝完第二颗，你断片了三秒钟。", stats: { SOBRIETY: -40, HEALTH: -20 }, next: 't10_secret' },
      { text: "道具：电话模拟器", item: 'fake_call', outcome: "“老婆孩子进医院了！”你撒了个弥天大谎躲了出去。回来时大家看你的眼神怪怪的。", stats: { SOBRIETY: 0, FACE: -15 }, next: 't10_secret' },
      { text: "假装手滑打翻酒", outcome: "你故意把酒洒在雷总裤子上。全场大乱。你不用喝了，但你闯大祸了。", stats: { FACE: -40, SOBRIETY: 0 }, next: 't10_secret' }
    ],
    "Turn 9: The Bomb", "Depth Charge.", []
  ),

  // --- TURN 10: SECRET (Key Branch) ---
  't10_secret': createNode(
    't10_secret', 10, IMG_DINNER_CLOSEUP,
    "第十轮：肮脏交易",
    "雷总醉醺醺地凑近你，声音压得很低：“小李，老张给我回扣3个点。你要是能给5个点，这单子归你。”\n**这是违法的。**",
    [
      { text: "装傻听不懂", outcome: "你选择了明哲保身。雷总很不满，觉得你不上道。", stats: { FACE: -10 }, next: 't11_loyalty' },
      { text: "答应他", outcome: "你握住了雷总的手。你出卖了公司的底线，换取了订单。你的钱包鼓了，但良心黑了。", stats: { FACE: 20, WEALTH: 10000 }, next: 't11_loyalty' }, 
      { text: "开启录音笔 (内鬼线)", item: 'spy_pen', outcome: "你按下了录音键。“雷总，5个点怎么操作？走海外账户吗？”你诱导他说出了细节。你现在的身份是：告密者。", stats: { FACE: -5, SOBRIETY: 5 }, next: 't11_spy_1' }
    ],
    "Turn 10: Secret", "A dirty deal?", []
  ),

  // ============================
  // NORMAL BRANCH (Turns 11-15)
  // ============================

  't11_loyalty': createNode(
    't11_loyalty', 11, IMG_BOSS,
    "第十一轮：表忠心",
    "王总显然喝高了，开始整人：“小李，给雷总跪式服务点根烟。年轻人要懂得放低姿态。”",
    [
      { text: "跪下点烟", outcome: "你跪在地上点了烟。尊严碎了一地，但王总和雷总笑得很开心。", stats: { FACE: 10, SOBRIETY: -5 }, next: 't12_game' },
      { text: "站着点烟", outcome: "你弯腰但不跪。王总脸色很难看：“小李腰杆挺硬啊。”", stats: { FACE: -15 }, next: 't12_game' },
      { text: "道具：递中华烟", item: 'cigarettes', outcome: "“王总，跪就不必了，尝尝这个特供的。”你巧妙地用递烟化解了尴尬。", stats: { FACE: 5, SOBRIETY: 0 }, next: 't12_game' }
    ],
    "Turn 11: Loyalty", "Submission.", []
  ),

  't12_game': createNode(
    't12_game', 12, IMG_DINNER_OVERVIEW,
    "第十二轮：大话骰",
    "开始玩骰子。老张针对你，每次都叫死你。",
    [
      { text: "跟他硬刚", outcome: "你喝红了眼，跟他死磕。结果输多赢少，连干三杯。", stats: { SOBRIETY: -25, HEALTH: -10 }, next: 't13_truth' },
      { text: "认输求放过", outcome: "“张哥我服了。”你主动认输喝半杯。老张得意忘形。", stats: { FACE: -10, SOBRIETY: -10 }, next: 't13_truth' },
      { text: "道具：蜂蜜水醒脑", item: 'honey_water', outcome: "喝口蜂蜜水让脑子转快点。你抓住了老张的破绽，让他喝了一杯。", stats: { SOBRIETY: 10, FACE: 5 }, next: 't13_truth' }
    ],
    "Turn 12: Dice", "Liar's Dice.", []
  ),

  't13_truth': createNode(
    't13_truth', 13, IMG_DINNER_CLOSEUP,
    "第十三轮：真心话",
    "真心话环节。王总问：“如果公司要把你调去非洲分部三年，换个副总头衔，你去不去？”",
    [
      { text: "去！为公司赴汤蹈火！", outcome: "你回答得太假。大家都听得出来是场面话。", stats: { FACE: -5 }, next: 't14_round_robin' },
      { text: "犹豫后答应", outcome: "你表现出了人性的一面，然后咬牙答应。这演技逼真。", stats: { FACE: 15 }, next: 't14_round_robin' },
      { text: "不去，我要照顾家庭", outcome: "实话实说。王总摇头：“年轻人没野心。”", stats: { FACE: -15 }, next: 't14_round_robin' }
    ],
    "Turn 13: Truth", "The loaded question.", []
  ),

  't14_round_robin': createNode(
    't14_round_robin', 14, IMG_CHEERS,
    "第十四轮：打通关",
    "雷总提议：“小李，你是全场最小的，跟每位领导喝一杯。” 在座除了你还有4个人。",
    [
      { text: "打通关（4杯）", outcome: "连喝4杯。你感觉胃已经麻木了，眼前出现了重影。", stats: { SOBRIETY: -40, HEALTH: -30, FACE: 20 }, next: 't15_white_water' },
      { text: "喝一半洒一半", outcome: "你耍了滑头。虽然少喝了点，但被王总瞪了一眼。", stats: { SOBRIETY: -20, FACE: -10 }, next: 't15_white_water' },
      { text: "装死趴桌上", outcome: "你直接趴在桌上装死。虽然躲过了酒，但这也意味着你退出了社交舞台。", stats: { FACE: -30, SOBRIETY: 5 }, next: 't15_white_water' }
    ],
    "Turn 14: Round Robin", "Drink with everyone.", []
  ),

  't15_white_water': createNode(
    't15_white_water', 15, IMG_DINNER_CLOSEUP,
    "第十五轮：白酒当水",
    "最后阶段，大家已经喝麻了。王总拿大杯子倒满白酒：“小李，是兄弟就干了。”",
    [
      { text: "干杯！", outcome: "这是压垮骆驼的最后一根稻草。你感觉灵魂出窍了。", stats: { SOBRIETY: -30, HEALTH: -20, FACE: 15 }, next: 't16_contract' },
      { text: "假装喝，吐回杯子", outcome: "极高难度的动作。你成功了，但恶心得想吐。", stats: { SOBRIETY: -5, FACE: 5 }, next: 't16_contract' },
      { text: "哭诉", outcome: "你抱着王总大腿哭诉生活不易。王总被你整懵了，酒也忘了喝。", stats: { FACE: -20, SOBRIETY: 0 }, next: 't16_contract' }
    ],
    "Turn 15: Numbness", "Boss calls you brother.", []
  ),

  // ============================
  // SPY BRANCH (Turns 11-15) - High Tension
  // ============================

  't11_spy_1': createNode(
    't11_spy_1', 11, IMG_SPY,
    "第十一轮：潜伏（套话）",
    "你开启了录音笔。现在你需要让他们多说话。王总正在吹嘘他的发家史。",
    [
      { text: "敬酒恭维，引导话题", outcome: "“王总，那笔账怎么平的？太神了！”你喝了一大杯诱导他说漏嘴。录到了关键信息！", stats: { SOBRIETY: -20, FACE: 10 }, next: 't12_spy_2' },
      { text: "保持沉默", outcome: "你不敢说话，怕露馅。错过了最佳取证机会。", stats: { FACE: -5 }, next: 't12_spy_2' }
    ],
    "Turn 11: Undercover", "Gathering evidence.", []
  ),

  't12_spy_2': createNode(
    't12_spy_2', 12, IMG_SPY,
    "第十二轮：潜伏（危机）",
    "老张突然盯着你的胸口（录音笔的位置）：\"小李，你这里红灯在闪是什么？\"",
    [
      { text: "说是电子烟", outcome: "“哦，新款电子烟，没电了。”你强装镇定。老张半信半疑。", stats: { FACE: -5, SOBRIETY: -5 }, next: 't13_spy_3' },
      { text: "发酒疯把酒泼上去", outcome: "你故意把酒泼在自己身上掩盖。虽然狼狈，但骗过了老张。", stats: { FACE: -20, SOBRIETY: -10 }, next: 't13_spy_3' }
    ],
    "Turn 12: Suspicion", "Zhang is watching.", []
  ),

  't13_spy_3': createNode(
    't13_spy_3', 13, IMG_TOILET,
    "第十三轮：潜伏（云端）",
    "在厕所，你必须上传录音。这里信号很差，只有一格。",
    [
      { text: "举着手机找信号", outcome: "你在厕所隔间里像个傻子一样举着手机。终于发送成功了。你手心全是汗。", stats: { SOBRIETY: 5 }, next: 't14_spy_4' },
      { text: "放弃上传，保存在本地", outcome: "太慢了。你决定赌一把，相信没人会搜身。风险极大。", stats: { SOBRIETY: 5 }, next: 't14_spy_4' }
    ],
    "Turn 13: Backup", "Upload the evidence.", []
  ),

  't14_spy_4': createNode(
    't14_spy_4', 14, IMG_BOSS,
    "第十四轮：潜伏（合同）",
    "他们拿出阴阳合同了。你需要拍下那个签字的瞬间。",
    [
      { text: "假装自拍", outcome: "你举起手机，假装和雷总合影，实则拍合同。雷总很配合地比了个耶。荒诞而讽刺。", stats: { FACE: 10 }, next: 't15_spy_5' },
      { text: "直接偷拍", outcome: "手抖了，照片有点糊。王总似乎察觉到了闪光灯（虽然你没开）。", stats: { FACE: -10 }, next: 't15_spy_5' }
    ],
    "Turn 14: The Photo", "Capture the contract.", []
  ),

  't15_spy_5': createNode(
    't15_spy_5', 15, IMG_DINNER_OVERVIEW,
    "第十五轮：潜伏（抉择）",
    "证据链完整了。你可以现在发给警察，或者等结束后发给竞争公司卖个好价钱。",
    [
      { text: "准备报警（正义线）", outcome: "你手指悬在拨号键上。这将毁了你的行业声誉，但能让你问心无愧。", stats: { FACE: -50 }, next: 't16_spy_showdown' },
      { text: "勒索他们（黑化线）", outcome: "你决定用这个证据换取下半辈子的财富。你彻底黑化了。", stats: { WEALTH: 0 }, next: 't16_spy_showdown' }
    ],
    "Turn 15: The Turn", "Ready to strike.", []
  ),


  // ============================
  // CONVERGENCE & ENDINGS
  // ============================

  't16_contract': createNode(
    't16_contract', 16, IMG_BILL, 
    "第十六轮：签字画押",
    "雷总拿笔的手在抖：“合同没问题吧？” 此时你已经神志不清了。",
    [
      { text: "递笔（消耗大量精力）", outcome: "你强行集中精神递笔。雷总签了。你感觉身体被掏空。", stats: { FACE: 30, HEALTH: -10, SOBRIETY: -10 }, next: 't17_crash' },
      { text: "让老张递", outcome: "你实在动不了了。老张抢了功劳。功亏一篑？", stats: { FACE: -30 }, next: 't17_crash' }
    ],
    "Turn 16: Contract", "Sign it now.", []
  ),

  't16_spy_showdown': createNode(
    't16_spy_showdown', 16, IMG_SPY, 
    "第十六轮：摊牌时刻",
    "“雷总，王总，听听这个。” 你播放了录音。",
    [
      { text: "我是为了正义", outcome: "你报了警。警察已经在楼下了。雷总面如死灰。", stats: { FACE: 0, WEALTH: 0 }, next: 'ending_whistleblower' },
      { text: "给我500万，我删了", outcome: "你开价了。雷总恶狠狠地盯着你，然后转账了。你赢了钱，输了人。", stats: { WEALTH: 500000, FACE: -100 }, next: 't17_crash' }
    ],
    "Turn 16: Showdown", "Reveal the truth.", []
  ),

  'ending_whistleblower': createNode(
    'ending_whistleblower', 21, IMG_DAWN, 
    "结局：正道的光", 
    "警笛声响彻夜空。你看着他们被带走，长舒了一口气。虽然失业了，但你从未如此清醒。",
    [], "Ending: Justice", "Justice served.", []
  ),

  't17_crash': createNode(
    't17_crash', 17, IMG_DINNER_OVERVIEW,
    "第十七轮：强弩之末",
    "隔壁桌来敬酒。你只要再喝一杯就会倒下。",
    [
      { text: "喝！", outcome: "你倒了。直接倒在桌子底下。不省人事。", stats: { HEALTH: -50, SOBRIETY: -50 }, next: 't18_bill' },
      { text: "装死不动", outcome: "你像尸体一样瘫在椅子上。没人理你。", stats: { FACE: -20 }, next: 't18_bill' }
    ],
    "Turn 17: Crasher", "Internal politics.", []
  ),

  't18_bill': createNode(
    't18_bill', 18, IMG_BILL,
    "第十八轮：买单时刻",
    "一共消费 28,888 元。王总喝多了，示意谁先垫付一下。",
    [
      { text: "刷卡（大出血）", outcome: "你颤抖着刷了卡。近三万块没了。希望能报销。", stats: { WEALTH: -28888, FACE: 40 }, next: 't19_escort' },
      { text: "尿遁", outcome: "你躲在厕所不出来。最后老张刷了卡。王总明天醒来会怎么想你？", stats: { FACE: -50 }, next: 't19_escort' }
    ],
    "Turn 18: Bill", "Who pays?", []
  ),

  't19_escort': createNode(
    't19_escort', 19, IMG_DINNER_OVERVIEW,
    "第十九轮：送客",
    "雷总要走了。他走路都在飘。",
    [
      { text: "搀扶雷总", outcome: "他吐了你一身呕吐物。酸臭味让你也想吐。健康值狂掉。", stats: { FACE: 20, HEALTH: -10 }, next: 't20_aftermath' },
      { text: "帮着叫车", outcome: "你只负责叫车，不敢靠近。表现平平。", stats: { FACE: 0 }, next: 't20_aftermath' }
    ],
    "Turn 19: Escort", "Leaving.", []
  ),

  't20_aftermath': createNode(
    't20_aftermath', 20, IMG_DAWN,
    "第二十轮：黎明",
    "凌晨三点的大街。冷风吹过。",
    [
      { text: "抽根烟", outcome: "看着路灯，你不知道这一切是为了什么。", stats: { SOBRIETY: 5, HEALTH: -5 }, next: 'victory_check' },
      { text: "狂吐", outcome: "把今晚的委屈和酒精都吐出来吧。", stats: { HEALTH: -5, SOBRIETY: 15 }, next: 'victory_check' }
    ],
    "Turn 20: Alone", "The end of the night.", []
  ),

  'victory_check': createNode('victory_check', 21, IMG_DAWN, "...", "...", [], "...", "...", [])
};