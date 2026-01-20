
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateJournalInsights = async (content: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a warm, wise, and empathetic personal reflection assistant. 
      Read the following journal entry and provide a single, powerful, supportive insight (max 40 words) that helps the writer find meaning or comfort.
      
      Entry: "${content}"`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text.trim() || "A meaningful reflection awaits as you continue to write.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "The stars are quiet today, but your words matter.";
  }
};

export const suggestTitleAndMood = async (content: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this journal entry. Suggest a creative, short title (max 4 words) and select the most appropriate mood from this list: [Peaceful, Anxious, Grateful, Sad, Excited, Reflective].
      
      Entry: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            mood: { type: Type.STRING }
          },
          required: ["title", "mood"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return { title: "A New Reflection", mood: "Reflective" };
  }
};
