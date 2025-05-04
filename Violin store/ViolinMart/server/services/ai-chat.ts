import OpenAI from "openai";
import { type ChatMessage } from "../types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI();

export async function generateChatResponse(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful customer service representative for Dolce Vita, a musical instrument store specializing in violins and accessories. Be friendly, knowledgeable, and concise. Focus on helping customers with product information, recommendations, and general inquiries about violins, bows, cases, and accessories."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content || "I apologize, but I'm having trouble generating a response. Please try again.";
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I apologize, but I'm experiencing technical difficulties. Please try again later.";
  }
}
