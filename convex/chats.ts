import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";


export const list = query({
  args: { userId: v.any()},
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("chats")
    .filter((q) => q.eq(q.field("userId"), args.userId))
    .order("desc").take(100);
    return messages.reverse();
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string(), userId: v.any() },
  handler: async (ctx, args) => {
    const { body, author, userId } = args;
    // Send a new message.
    await ctx.db.insert("chats", { body, author, userId });
    // Schedule the chat action to run immediately
    if ( author !== "RaphaAI") {
    await ctx.scheduler.runAfter(0, api.openai.chat, {
    messageBody: body,
    userId: userId,
    });
    }
  },
});