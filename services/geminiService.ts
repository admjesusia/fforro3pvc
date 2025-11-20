import { GoogleGenAI, Type } from "@google/genai";
import { AiInsight } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize AI client only if key exists to prevent runtime crash on init
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getInstallationInsights = async (
  width: number,
  length: number,
  material: string
): Promise<AiInsight> => {
  if (!ai) {
    console.warn("API Key missing for Gemini Service");
    return {
      tips: ["Chave de API não configurada. Não é possível gerar dicas personalizadas."],
      economyJustification: "Cálculo padrão aplicado sem análise de IA."
    };
  }

  try {
    const prompt = `
      Analise a instalação de um forro de ${material} para um ambiente de ${width}m x ${length}m.
      
      Forneça:
      1. 3 dicas técnicas curtas e práticas de instalação específicas para essa proporção de área (ex: direção das réguas, estrutura).
      2. Uma justificativa econômica curta sobre como a otimização de corte reduz custos.

      Retorne APENAS JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 3 dicas técnicas."
            },
            economyJustification: {
              type: Type.STRING,
              description: "Justificativa de economia."
            }
          },
          required: ["tips", "economyJustification"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta do modelo.");
    
    return JSON.parse(text) as AiInsight;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      tips: [
        "Instale as réguas perpendicularmente à estrutura de sustentação.",
        "Verifique o nivelamento em todos os cantos antes de iniciar.",
        "Utilize equipamentos de proteção individual."
      ],
      economyJustification: "Otimização baseada em cálculo geométrico padrão."
    };
  }
};