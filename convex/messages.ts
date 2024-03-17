import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { patientId: v.any(), doctorId: v.any()},
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages")
    .filter((q) => q.eq(q.field("patientId"), args.patientId) && q.eq(q.field("doctorId"), args.doctorId) )
    .order("desc").take(100);
    return messages.reverse();
  },
});

export const send = mutation({
  args: { body: v.string(), patientId: v.any(), doctorId: v.any()},
  handler: async (ctx, args) => {
    const { body, patientId, doctorId } = args;
    // Send a new message.
    await ctx.db.insert("messages", { body, patientId, doctorId });
  },
});