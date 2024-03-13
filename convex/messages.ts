import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
    args: { body: v.string(), author: v.string() },
    handler: async (ctx, args) => {
        const { body, author } = args;
        await ctx.db.insert("chats", { body, author });
    },
});

