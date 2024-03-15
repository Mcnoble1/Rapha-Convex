import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";


export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("chats").order("desc").take(100);
    // Reverse the list so that it's in a chronological order.
    return messages.reverse();
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    const { body, author } = args;
    // Send a new message.
    await ctx.db.insert("chats", { body, author });
    // Schedule the chat action to run immediately
    await ctx.scheduler.runAfter(0, api.openai.chat, {
    messageBody: body,
    });
  },
});