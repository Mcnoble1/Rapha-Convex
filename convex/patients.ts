import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPatient = query({
    args: { _id: v.any() },
    handler: async (ctx, args) => {
        const patient = await ctx.db.query("patients")
        .filter((q) => q.eq(q.field("_id"), args._id))
        .collect();
        return patient;
        },
    });

export const getPatients = query({
    args: {},
    handler: async (ctx) => {
        const patients = await ctx.db.query("patients").collect();
        return patients;
    },
    });

export const createPatient = mutation({
    args: { name: v.string(), dateOfBirth: v.string(), email: v.string(), phone: v.string(), maritalStatus: v.string(), identificationNumber: v.string(), gender: v.string(), homeAddress: v.string(), city: v.string(), state: v.string(), country: v.string(), guardianName: v.string(), relationship: v.string(), guardianGender: v.string(), guardianHomeAddress: v.string(), guardianEmail: v.string(), guardianCity: v.string(), guardianState: v.string(), guardianCountry: v.string(), guardianPhone: v.string(), },
    handler: async (ctx, args) => {
        const { name, dateOfBirth, email, phone, maritalStatus, identificationNumber, gender, homeAddress, city, state, country, guardianName, relationship, guardianGender, guardianHomeAddress, guardianEmail, guardianCity, guardianState, guardianCountry, guardianPhone } = args;
        const patientId = await ctx.db.insert("patients", {
            name,
            dateOfBirth,
            email,
            phone,
            maritalStatus,
            identificationNumber,
            gender,
            homeAddress,
            city,
            state,
            country,
            guardianName,
            relationship,
            guardianGender,
            guardianHomeAddress,
            guardianEmail,
            guardianCity,
            guardianState,
            guardianCountry,
            guardianPhone,
        });
        return patientId;
    },
});

export const updatePatient = mutation({
    args: { id: v.id("patients"), name: v.string(), dateOfBirth: v.string(), email: v.string(), phone: v.string(), maritalStatus: v.string(), identificationNumber: v.string(), gender: v.string(), homeAddress: v.string(), city: v.string(), state: v.string(), country: v.string(), guardianName: v.string(), relationship: v.string(), guardianGender: v.string(), guardianHomeAddress: v.string(), guardianEmail: v.string(), guardianCity: v.string(), guardianState: v.string(), guardianCountry: v.string(), guardianPhone: v.string()},
    handler: async (ctx, args) => {
        const { id, name, dateOfBirth, email, phone, maritalStatus, identificationNumber, gender, homeAddress, city, state, country, guardianName, relationship, guardianGender, guardianHomeAddress, guardianEmail, guardianCity, guardianState, guardianCountry, guardianPhone } = args;
        await ctx.db.patch(id, {
            name,
            dateOfBirth,
            email,
            phone,
            maritalStatus,
            identificationNumber,
            gender,
            homeAddress,
            city,
            state,
            country,
            guardianName,
            relationship,
            guardianGender,
            guardianHomeAddress,
            guardianEmail,
            guardianCity,
            guardianState,
            guardianCountry,
            guardianPhone,
        })
    }
});

export const deletePatient = mutation({
    args: { id: v.id("patients") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
