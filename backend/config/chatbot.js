import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import { Ollama } from "ollama";

config(); 

export async function generateAiResponse(prompt, type) {
  if (type === 'Gemini'){
    const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); 
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return response.text
  }

  else if (type === "llama3" || type === "qwen2" || type === "mistral"){
    const ollamaHost = process.env.OLLAMA_HOST || "http://ollama:11434";

    const client = new Ollama({
      host: ollamaHost
    });

    const response = await client.generate({
      model: type,
      prompt: prompt
    });
    return response.response.trim();
  } 
}