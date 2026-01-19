import { GoogleGenAI } from "@google/genai";
import { PlayerStats, InventoryItem, GameEvent } from "../types";
import { STORY_TREE } from "../storyData";
import { TRANSLATIONS, COVER_IMAGE_URL } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export const generateImage = async (description: string): Promise<string | undefined> => {
  try {
    const prompt = `Cinematic photography, realistic, atmospheric, dark moody lighting, 8k resolution, film grain. No text. Context: ${description}`;
    
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Failed to generate image:", error);
    return undefined;
  }
}

export const generateEnding = async (
  stats: PlayerStats,
  turn: number,
  reason: string,
  isVictory: boolean,
  lang: 'en' | 'zh'
): Promise<string> => {
  try {
    const prompt = `
      Write a cinematic, noir-style epilogue for a story about a corporate employee surviving a night of intense business drinking.
      
      Language: ${lang === 'zh' ? 'Simplified Chinese (简体中文)' : 'English'}
      Outcome: ${isVictory ? 'Victory/Survival' : 'Failure/Collapse'}
      Cause of End: ${reason}
      Final Stats: Health ${stats.HEALTH}, Sobriety ${stats.SOBRIETY}, Face ${stats.FACE}, Wealth ${stats.WEALTH}.
      Turns Survived: ${turn}.

      Style: First-person ("I") or Second-person ("You"). Emotional, atmospheric, realistic, slightly dark.
      Length: About 100 words.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    return response.text || (lang === 'zh' ? "故事就这样结束了..." : "The story ends here...");
  } catch (error) {
    return lang === 'zh' ? "意识模糊，记忆中断..." : "Consciousness fades...";
  }
}

// Replaced AI generation with Instant Local Lookup
export const generateEvent = async (
  stats: PlayerStats,
  turn: number,
  scenarioContext: string,
  history: string[],
  inventory: InventoryItem[],
  lang: 'en' | 'zh',
  stageName: string,
  eventId: string = 's1_t1_start' // Default entry point
): Promise<GameEvent> => {
  
  // 1. Look up event in the tree
  const eventNode = STORY_TREE[eventId];
  
  if (eventNode) {
    const rawEvent = lang === 'zh' ? eventNode.zh : eventNode.en;
    
    // Filter choices: Only show item-based choices if the player has the item in inventory
    const filteredChoices = rawEvent.choices.filter(choice => {
      if (choice.itemUsed) {
        // Check if inventory has this item with quantity > 0
        return inventory.some(i => i.id === choice.itemUsed && i.quantity > 0);
      }
      return true;
    });

    return {
      ...rawEvent,
      choices: filteredChoices
    };
  }

  // Fallback if ID not found (should not happen with correct data)
  const t = TRANSLATIONS[lang];
  return {
    id: 'error',
    turn: turn,
    title: t.fallbackError,
    description: "System Error: Narrative node not found.",
    backgroundImage: COVER_IMAGE_URL,
    choices: [
      {
        text: t.fallbackChoice1,
        outcomeNarrative: t.fallbackOutcome1,
        statChanges: {},
        nextEventId: 's1_t1_start' // Reboot
      }
    ]
  };
};