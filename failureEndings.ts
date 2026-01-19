import { PlayerStats, StatType } from './types';

export type FailureType = 'HEALTH' | 'SOBRIETY' | 'FACE' | 'WEALTH';

export interface FailureEnding {
  id: string;
  failureType: FailureType;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  story: { en: string; zh: string };
}

export const FAILURE_ENDINGS: FailureEnding[] = [
  // 健康归零 - 急性酒精中毒
  {
    id: 'health_failure',
    failureType: 'HEALTH',
    title: {
      en: 'The Collapse',
      zh: '身体崩溃'
    },
    description: {
      en: 'Your body gave up. The alcohol was too much, and your organs couldn\'t take it anymore.',
      zh: '你的身体撑不住了。酒精过量，你的器官已经无法承受。'
    },
    story: {
      en: `The last thing you remember is the burning sensation in your throat. Then everything went black.

You woke up in a hospital bed, tubes connected to your arms. The doctor's voice was distant: "Acute alcohol poisoning. Your liver enzymes are through the roof. You're lucky to be alive."

Three days later, you were discharged. Your job was gone—they said you "embarrassed the company." Your health insurance wouldn't cover the $50,000 medical bill. Your family looked at you with disappointment.

You sit alone in your apartment, staring at the bottle of pills. The doctor said you can't drink anymore. Not ever. The corporate dinner that was supposed to be your big break became your breaking point.

Sometimes, survival isn't about making it through the night. Sometimes, it's about knowing when to stop.`,
      zh: `你最后记得的是喉咙里的灼烧感。然后一切都变黑了。

你在医院的病床上醒来，手臂上插着管子。医生的声音很遥远："急性酒精中毒。你的肝酶指标爆表了。你能活下来很幸运。"

三天后，你出院了。你的工作没了——公司说你"让公司丢脸"。你的医疗保险不覆盖这5万块的医疗费。你的家人用失望的眼神看着你。

你独自坐在公寓里，盯着那瓶药。医生说你再也不能喝酒了。永远不能。那场本应是你大展身手的商务宴请，成了你的崩溃点。

有时候，生存不是关于撑过这个夜晚。有时候，是关于知道何时该停下来。`
    }
  },

  // 清醒度归零 - 彻底断片
  {
    id: 'sobriety_failure',
    failureType: 'SOBRIETY',
    title: {
      en: 'The Blackout',
      zh: '彻底断片'
    },
    description: {
      en: 'Your mind shut down. The alcohol overwhelmed your system, and consciousness slipped away.',
      zh: '你的大脑关闭了。酒精压垮了你的系统，意识悄然离去。'
    },
    story: {
      en: `The world started spinning. Colors blurred together. You tried to focus on the faces around you, but they were just smudges of light.

Then nothing.

You don't remember how you got home. You don't remember what you said. You don't remember who you offended.

The next morning, your phone was full of messages. Some were concerned. Most were angry. Your boss called: "What the hell did you do last night? You insulted the client. You're fired."

You check your bank account. There are charges you don't remember making. A $10,000 bar tab. A taxi ride to a part of town you've never been to. A hotel room.

You look in the mirror. Your face is bruised. You have no idea how.

The worst part isn't the lost job or the money. It's the gap in your memory. The hours you'll never get back. The person you might have been in those missing moments.

You'll never know what happened. And that's the most terrifying part.`,
      zh: `世界开始旋转。颜色模糊在一起。你试图聚焦周围的脸，但它们只是模糊的光点。

然后什么都没有了。

你不记得你是怎么回家的。你不记得你说了什么。你不记得你得罪了谁。

第二天早上，你的手机里全是消息。有些是关心的。大多数是愤怒的。你的老板打电话来："你昨晚到底做了什么？你侮辱了客户。你被开除了。"

你查看银行账户。有你不记得的消费。1万块的酒吧账单。打车去了你从未去过的城区。一间酒店房间。

你照镜子。你的脸有淤青。你不知道是怎么弄的。

最糟糕的不是失去工作或金钱。而是记忆的空白。那些你永远找不回来的时间。在那些缺失的时刻里你可能成为的那个人。

你永远不会知道发生了什么。那是最可怕的部分。`
    }
  },

  // 面子归零 - 社交自杀
  {
    id: 'face_failure',
    failureType: 'FACE',
    title: {
      en: 'Social Suicide',
      zh: '社交死亡'
    },
    description: {
      en: 'You lost all respect. Your reputation was destroyed in front of everyone who mattered.',
      zh: '你失去了所有的尊重。你的声誉在所有重要的人面前被摧毁了。'
    },
    story: {
      en: `It started with a joke that went too far. Then you said something you shouldn't have. Then you did something unforgivable.

You don't remember the exact moment it happened. But you remember the silence that followed. The way everyone stopped talking. The way the boss's face went from amused to disgusted.

"You're done here," he said quietly. "Get out."

You tried to apologize. You tried to explain. But the damage was done. In one night, you destroyed everything you'd built over years.

The next day, word spread. Your industry is small. Everyone knows everyone. Your name became a punchline. "Remember that guy who..."

Job applications went unanswered. Former colleagues stopped returning your calls. Your LinkedIn profile became a ghost town.

You sit in your empty apartment, scrolling through old photos. The person in those pictures—confident, respected, on the rise—feels like a stranger.

You're not that person anymore. You're the cautionary tale. The one they warn new employees about.

Some failures you can recover from. This isn't one of them.`,
      zh: `从一个过火的玩笑开始。然后你说了一些不该说的话。然后你做了一些不可原谅的事。

你不记得具体是什么时候发生的。但你记得随之而来的沉默。所有人停止说话的方式。老板的脸从好笑变成厌恶的方式。

"你完了，"他轻声说。"滚出去。"

你试图道歉。你试图解释。但伤害已经造成。在一个晚上，你摧毁了多年来建立的一切。

第二天，消息传开了。你的行业很小。每个人都认识每个人。你的名字成了一个笑话。"记得那个家伙..."

求职申请石沉大海。前同事不再回你的电话。你的LinkedIn个人资料变成了鬼城。

你坐在空荡荡的公寓里，翻看旧照片。照片里的那个人——自信、受尊重、正在上升——感觉像个陌生人。

你不再是那个人了。你是那个警示故事。他们用来警告新员工的那个。

有些失败你可以恢复。这个不是。`
    }
  },

  // 财富归零 - 破产
  {
    id: 'wealth_failure',
    failureType: 'WEALTH',
    title: {
      en: 'Financial Ruin',
      zh: '财务崩溃'
    },
    description: {
      en: 'You ran out of money. The bills piled up, and you couldn\'t pay. Your financial life collapsed.',
      zh: '你花光了钱。账单堆积如山，你付不起了。你的财务生活崩溃了。'
    },
    story: {
      en: `The bill came. ¥28,888. You reached for your wallet, but it was empty. You tried your credit card. Declined.

The restaurant manager's smile disappeared. "Sir, we need payment."

You called your bank. Your account was frozen. Overdrawn. You'd spent everything—the dinner, the drinks, the "gifts" you thought would help.

The manager called security. You were escorted out, humiliated, in front of everyone. The client watched. Your boss watched. Your rival smiled.

The next day, debt collectors started calling. Your credit cards were maxed out. Your savings were gone. You couldn't pay rent.

You moved back in with your parents at 32. Your friends stopped inviting you out. You couldn't afford to go anyway.

You sit in your childhood bedroom, looking at job listings. Entry-level positions. Half your old salary. But you need the money.

That one night cost you everything. Not just the money—your independence, your dignity, your future.

You'll spend years paying it back. If you ever can.`,
      zh: `账单来了。28,888元。你伸手拿钱包，但它是空的。你试了信用卡。被拒绝了。

餐厅经理的笑容消失了。"先生，我们需要付款。"

你打电话给银行。你的账户被冻结了。透支了。你花光了所有——晚餐、酒水、你以为会有帮助的"礼物"。

经理叫了保安。你被护送出去，在所有人面前受辱。客户看着。你的老板看着。你的对手笑了。

第二天，催债公司开始打电话。你的信用卡刷爆了。你的积蓄没了。你付不起房租。

32岁的你搬回了父母家。你的朋友不再邀请你出去。反正你也去不起。

你坐在童年的卧室里，看着招聘信息。入门级职位。你以前工资的一半。但你需要钱。

那一夜让你失去了一切。不仅仅是钱——你的独立、你的尊严、你的未来。

你将花很多年才能还清。如果你还能还清的话。`
    }
  }
];

export function getFailureEnding(failureType: FailureType, lang: 'en' | 'zh'): FailureEnding {
  const ending = FAILURE_ENDINGS.find(e => e.failureType === failureType);
  return ending || FAILURE_ENDINGS[0]; // 默认返回第一个
}
