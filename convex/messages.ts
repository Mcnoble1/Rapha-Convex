import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";


export const fetchDoctor = query({
    args: {},
    handler: async (ctx) => {
        const doctor = await ctx.db.query("doctor").collect();
        return doctor;
    },
    });

export const fetchDoctors = query({
    args: {},
    handler: async (ctx) => {
        const doctors = await ctx.db.query("doctors").collect();
        return doctors;
    },
    });

export const fetchPatient = query({
    args: {},
    handler: async (ctx) => {
        const patient = await ctx.db.query("patient").collect();
        return patient;
    },
    });

export const fetchPatients = query({
    args: {},
    handler: async (ctx) => {
        const patients = await ctx.db.query("patients").collect();
        return patients;
    },
    });
    
export const fetchAppointments = query({
    args: {},
    handler: async (ctx) => {
        const appointments = await ctx.db.query("appointments").collect();
        return appointments;
    },
    });

export const fetchPrescriptions = query({
    args: {},
    handler: async (ctx) => {
        const prescriptions = await ctx.db.query("prescriptions").collect();
        return prescriptions;
    },
    });

export const fetchMessages = query({
    args: {},
    handler: async (ctx) => {
        const messages = await ctx.db.query("messages").collect();
        return messages;
    },
    });

export const send = mutation({
    args: { body: v.string(), author: v.string() },
    handler: async (ctx, args) => {
        const { body, author } = args;
        await ctx.db.insert("chats", { body, author });
    },
});

export const createDoctor = mutation({
    args: { name: v.string(), dateOfBirth: v.string(), email: v.string(), phone: v.string(), hospital: v.string(), specialty: v.string(), registrationNumber: v.string(), identificationNumber: v.string(), yearsOfExperience: v.string(), gender: v.string(), homeAddress: v.string(), status: v.string(), city: v.string(), state: v.string(), country: v.string()},
    handler: async (ctx, args) => {
        const { name, dateOfBirth, email, phone, hospital, specialty, registrationNumber, identificationNumber, yearsOfExperience, gender, homeAddress, status, city, state, country } = args;
        await ctx.db.insert("doctor", {
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
    },
});

export const createPatient = mutation({
    args: { name: v.string(), dateOfBirth: v.string(), email: v.string(), phone: v.number(), maritalStatus: v.string(), identificationNumber: v.string(), gender: v.string(), homeAddress: v.string(), city: v.string(), state: v.string(), country: v.string(), guardianName: v.string(), relationship: v.string(), guardianGender: v.string(), guardianHomeAddress: v.string(), guardianEmail: v.string(), guardianCity: v.string(), guardianState: v.string(), guardianCountry: v.string(), guardianPhone: v.number()},
    handler: async (ctx, args) => {
        const { name, dateOfBirth, email, phone, maritalStatus, identificationNumber, gender, homeAddress, city, state, country, guardianName, relationship, guardianGender, guardianHomeAddress, guardianEmail, guardianCity, guardianState, guardianCountry, guardianPhone } = args;
        await ctx.db.insert("patient", {
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
    },
});

export const createAppointment = mutation({
    args: { doctorId: v.id("doctors"), patientId: v.id("patients"), date: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("appointments", {
            doctorId: args.doctorId,
            patientId: args.patientId,
            date: args.date,
        });
    },
});

export const createPrescription = mutation({
    args: { doctorId: v.id("doctors"), patientId: v.id("patients"), medicine: v.string(), dosage: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("prescriptions", {
            doctorId: args.doctorId,
            patientId: args.patientId,
            medicine: args.medicine,
            dosage: args.dosage,
        });
    },
});

export const deleteDoctor = mutation({
    args: { id: v.id("doctors") },
    handler: async (ctx, args) => {
        await ctx.db.delete("doctors", args.id);
    },
});

export const deletePatient = mutation({
    args: { id: v.id("patients") },
    handler: async (ctx, args) => {
        await ctx.db.delete("patients", args.id);
    },
});

export const deleteAppointment = mutation({
    args: { id: v.id("appointments") },
    handler: async (ctx, args) => {
        await ctx.db.delete("appointments", args.id);
    },
});

export const deletePrescription = mutation({
    args: { id: v.id("prescriptions") },
    handler: async (ctx, args) => {
        await ctx.db.delete("prescriptions", args.id);
    },
});

export const deleteMessage = mutation({
    args: { id: v.id("messages") },
    handler: async (ctx, args) => {
        await ctx.db.delete("messages", args.id);
    },
});

export const updateDoctor = mutation({
    args: { id: v.id("doctors"), name: v.string(), email: v.string(), phone: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.update("doctors", args.id, {
            name: args.name,
            email: args.email,
            phone: args.phone,
        });
    },
});

export const updatePatient = mutation({
    args: { id: v.id("patients"), name: v.string(), email: v.string(), phone: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.update("patients", args.id, {
            name: args.name,
            email: args.email,
            phone: args.phone,
        });
    },
});

export const updateAppointment = mutation({
    args: { id: v.id("appointments"), doctorId: v.id("doctors"), patientId: v.id("patients"), date: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.update("appointments", args.id, {
            doctorId: args.doctorId,
            patientId: args.patientId,
            date: args.date,
        });
    },
});

export const updatePrescription = mutation({
    args: { id: v.id("prescriptions"), doctorId: v.id("doctors"), patientId: v.id("patients"), medicine: v.string(), dosage: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.update("prescriptions", args.id, {
            doctorId: args.doctorId,
            patientId: args.patientId,
            medicine: args.medicine,
            dosage: args.dosage,
        });
    },
});