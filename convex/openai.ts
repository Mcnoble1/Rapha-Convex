"use node";
import OpenAI from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Initialize the OpenAI client with the given API key
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });



export const chat = action({
    args: { 
        messageBody: v.string()
     },
     handler: async (ctx, args) => {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              // Provide a 'system' message to give GPT context about how to respond
              role: "system",
              content:
                "You are a well versed Healthcare bot in a group chat responding to questions about health, wellness, symptoms, solutions, medications and you can pass as a personal doctor.",
            },
            {
              // Pass on the chat user's message to GPT
              role: "user",
              content: args.messageBody,
            },
          ],
        });
    
        // Pull the message content out of the response
        const messageContent = response.choices[0].message?.content;

        // Send the message to the chat
        await ctx.runMutation(api.chats.send, { 
            body: messageContent || "Sorry, I don't have an answer for that.",
            author: "RaphaAI" 
        });
      },
})