
import { GoogleGenAI, Type } from "@google/genai";
import { QuizData, AssessmentResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSpinalHealthInsight = async (data: QuizData): Promise<AssessmentResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a preliminary chiropractic assessment analysis for a patient:
      - Primary Pain Area: ${data.location}
      - Duration: ${data.duration}
      - Lifestyle/Routine: ${data.routine}
      - Primary Goal: ${data.goal}
      
      Patient Name: ${data.firstName}
      
      Provide a constructive, encouraging response focusing on structural health and the importance of a professional consultation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: 'A health score from 0 to 100 based on the severity of symptoms.',
            },
            summary: {
              type: Type.STRING,
              description: 'A brief summary of their condition insights.',
            },
            potentialCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of potential areas of concern for a chiropractor to investigate.',
            },
            recommendation: {
              type: Type.STRING,
              description: 'Actionable next steps.',
            },
          },
          required: ["score", "summary", "potentialCauses", "recommendation"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as AssessmentResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      score: 45,
      summary: "Based on your report, there are structural indicators that require a professional evaluation. Early intervention is key to long-term mobility.",
      potentialCauses: ["Postural Strain", "Nerve Compression"],
      recommendation: "Book an initial consultation at Aligned Chiro for a comprehensive structural assessment."
    };
  }
};
