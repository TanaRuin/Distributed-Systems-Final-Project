import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config(); 

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); 

export async function generateAiResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  console.log(response.text); 
  return response.text
}