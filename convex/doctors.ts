import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getDoctor = query({
    args: { _id: v.any() },
    handler: async (ctx, args) => {
        const doctor = await ctx.db.query("doctors")
        .filter((q) => q.eq(q.field("_id"), args._id))
        .collect();
        return doctor;
        },
    });

export const getDoctors = query({
    args: {},
    handler: async (ctx) => {
        const doctors = await ctx.db.query("doctors").collect();
        return doctors;
    },
    });

export const createDoctor = mutation({
    args: { name: v.string(), dateOfBirth: v.string(), email: v.string(), phone: v.string(), hospital: v.string(), specialty: v.string(), registrationNumber: v.string(), identificationNumber: v.string(), yearsOfExperience: v.string(), gender: v.string(), homeAddress: v.string(), status: v.string(), city: v.string(), state: v.string(), country: v.string()},
    handler: async (ctx, args) => {
        const { name, dateOfBirth, email, phone, hospital, specialty, registrationNumber, identificationNumber, yearsOfExperience, gender, homeAddress, status, city, state, country } = args;
        const doctorId = await ctx.db.insert("doctors", {
            name,
            dateOfBirth,
            email,
            phone,
            hospital,
            specialty,
            registrationNumber,
            identificationNumber,
            yearsOfExperience,
            gender,
            homeAddress,
            status,
            city,
            state,
            country,
        });
        return doctorId;
    },
});

export const updateDoctor = mutation({
    args: { id: v.id("doctors"), name: v.string(), dateOfBirth: v.string(), email: v.string(), phone: v.string(), hospital: v.string(), specialty: v.string(), registrationNumber: v.string(), identificationNumber: v.string(), yearsOfExperience: v.string(), gender: v.string(), homeAddress: v.string(), status: v.string(), city: v.string(), state: v.string(), country: v.string() },
    handler: async (ctx, args) => {
        const { id, name, dateOfBirth, email, phone, hospital, specialty, registrationNumber, identificationNumber, yearsOfExperience, gender, homeAddress, status, city, state, country  } = args;
        await ctx.db.patch(id, {
            name,
            dateOfBirth,
            email,
            phone,
            hospital,
            specialty,
            registrationNumber,
            identificationNumber,
            yearsOfExperience,
            gender,
            homeAddress,
            status,
            city,
            state,
            country,
        })
    },
});

export const deleteDoctor = mutation({
    args: { id: v.id("doctors") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
