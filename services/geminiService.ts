import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

export const analyzeSubnetWithAi = async (cidr: string, ipType: string): Promise<AiAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the IPv4 subnet ${cidr}.
    It is classified as a ${ipType} network.
    Provide a technical summary, common use cases for a subnet of this size, and any potential security considerations.
    Keep it concise and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A technical summary of the subnet" },
            useCases: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of common use cases" 
            },
            securityNotes: { type: Type.STRING, description: "Security implications or best practices" }
          },
          required: ["summary", "useCases", "securityNotes"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AiAnalysisResult;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw error;
  }
};
