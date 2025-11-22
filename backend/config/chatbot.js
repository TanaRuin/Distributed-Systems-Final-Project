import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

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
  else if (type === 'Deepseek' || type === 'Qwen'){
    const modelMap = {
      Deepseek: "deepseek/deepseek-r1:free",
      Qwen: "qwen/qwen3-30b-a3b:free",
    };

    const apiKeyMap = {
      Deepseek: process.env.DEEPSEEK_OPENROUTER_KEY,
      Qwen: process.env.QWEN_OPENROUTER_KEY,
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKeyMap[type]}`,
        "HTTP-Referer": "https://distributed-chat-system.com",
        "X-Title": "Distributed Chat System",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelMap[type],
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    console.log(data)
    let text = data?.choices?.[0]?.message?.content || ""
    
    return text
    .replace(/<\|begin[^>]+|>/g, "")
    .replace(/<\|end[^>]+|>/g, "")
    .replace(/<\|[^>]+>/g, "")     
    .trim();
  }  
}