import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createAllergyDetails = mutation({
    args: { patientId: v.string(), name: v.string(), reaction: v.string(), severity: v.string(), treatment: v.string() },
    handler: async (ctx, args) => {
        const { patientId, name, reaction, severity, treatment } = args;
        const allergyId = await ctx.db.insert("allergyDetails", {
            patientId,
            name,
            reaction,
            severity,
            treatment,
        });
        return allergyId;
    }
});

export const getAllergyDetails = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        const allergyDetails = await ctx.db.query("allergyDetails")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .collect();
        return allergyDetails;
    },
});

export const updateAllergyDetails = mutation({
    args: { id: v.id("allergyDetails"), patientId: v.string(), name: v.string(), reaction: v.string(), severity: v.string(), treatment: v.string() },
    handler: async (ctx, args) => {
        const { id, patientId, name, reaction, severity, treatment } = args;
        await ctx.db.patch(id, {
            patientId,
            name,
            reaction,
            severity,
            treatment,
        });
    },
});

export const deleteAllergyDetails = mutation({
    args: { id: v.id("allergyDetails") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const createDiagnosisDetails = mutation({
    args: { patientId: v.string(), diagnosis: v.string(), treatment: v.string(), date: v.string() },
    handler: async (ctx, args) => {
        const { patientId, diagnosis, treatment, date } = args;
        const diagnosisId = await ctx.db.insert("diagnosisDetails", {
            patientId,
            diagnosis,
            treatment,
            date,
        });
        return diagnosisId;
    }
});

export const getDiagnosisDetails = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        const diagnosisDetails = await ctx.db.query("diagnosisDetails")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .collect();
        return diagnosisDetails;
    },
});

export const updateDiagnosisDetails = mutation({
    args: { id: v.id("diagnosisDetails"), patientId: v.string(), diagnosis: v.string(), treatment: v.string(), date: v.string() },
    handler: async (ctx, args) => {
        const { id, patientId, diagnosis, treatment, date } = args;
        await ctx.db.patch(id, {
            patientId,
            diagnosis,
            treatment,
            date,
        });
    },
});

export const deleteDiagnosisDetails = mutation({
    args: { id: v.id("diagnosisDetails") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const createPhysicalRecord = mutation({
    args: { patientId: v.string(), weight: v.string(), height: v.string(), bmi: v.string(), bloodGroup: v.string(), rhesusFactor: v.string(), genotype: v.string() },
    handler: async (ctx, args) => {
        const { patientId, weight, height, genotype, bloodGroup, rhesusFactor, bmi } = args;
        const physicalRecordId = await ctx.db.insert("physicalRecord", {
            patientId,
            weight,
            height,
            genotype,
            bloodGroup,
            rhesusFactor,
            bmi,

        });
        return physicalRecordId;
    }
});

export const getPhysicalRecord = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        const physicalRecord = await ctx.db.query("physicalRecord")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .collect();
        return physicalRecord;
    },
});

export const updatePhysicalRecord = mutation({
    args: { id: v.id("physicalRecord"), patientId: v.string(),  date: v.string(), weight: v.string(), height: v.string(), bloodPressure: v.string(), temperature: v.string(), bmi: v.string(), bloodGroup: v.string(), rhesusFactor: v.string(), genotype: v.string() },
    handler: async (ctx, args) => {
        const { patientId,  date, weight, height, genotype, bloodGroup, rhesusFactor } = args;
        await ctx.db.patch(id, {
            patientId,
            date,
            weight,
            height,
            genotype,
            bloodGroup,
            rhesusFactor,
        });
    },
});

export const deletePhysicalRecord = mutation({
    args: { id: v.id("physicalRecord") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const createVitalSigns = mutation({
    args: { patientId: v.string(),  pulseRate: v.string(), respiratoryRate: v.string(), height: v.string(), bloodPressure: v.string(), temperature: v.string(), notes: v.string() },
    handler: async (ctx, args) => {
        const { patientId, bloodPressure, temperature, pulseRate, respiratoryRate } = args;
        const vitalSignsId = await ctx.db.insert("vitalSigns", {
            patientId,
            bloodPressure,
            temperature,
            pulseRate,
            respiratoryRate,
        });
        return vitalSignsId;
    }
});

export const getVitalSigns = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        const vitalSigns = await ctx.db.query("vitalSigns")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .collect();
        return vitalSigns;
    },
});

export const updateVitalSigns = mutation({
    args: { id: v.id("vitalSigns"), patientId: v.string(), pulseRate: v.string(), respiratoryRate: v.string(), height: v.string(), bloodPressure: v.string(), temperature: v.string(), notes: v.string() },
    handler: async (ctx, args) => {
        const { id, patientId, bloodPressure, temperature, pulseRate, respiratoryRate } = args;
        await ctx.db.patch(id, {
            patientId,
            bloodPressure,
            temperature,
            pulseRate,
            respiratoryRate,
        });
    },
});

export const deleteVitalSigns = mutation({
    args: { id: v.id("vitalSigns") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const createCardiologyDetails = mutation({
    args: { patientId: v.string(),  date: v.string(), heartCondition: v.string(), treatment: v.string(), testPerformed: v.string(), testResult: v.string(), hospital: v.string() },
    handler: async (ctx, args) => {
        const { patientId,  date, heartCondition, treatment, hospital, testResult, testPerformed } = args;
        const cardiologyDetailsId = await ctx.db.insert("cardiologyDetails", {
            patientId,
            date,
            heartCondition,
            treatment,
            testPerformed,
            testResult,
            hospital
        });
        return cardiologyDetailsId;
    }
});

export const getCardiologyDetails = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        const cardiologyDetails = await ctx.db.query("cardiologyDetails")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .collect();
        return cardiologyDetails;
    },
});

export const updateCardiologyDetails = mutation({
    args: { id: v.id("cardiologyDetails"), patientId: v.string(),  date: v.string(), heartCondition: v.string(), treatment: v.string(), testPerformed: v.string(), testResult: v.string(), hospital: v.string()},
    handler: async (ctx, args) => {
        const { id, patientId,  date, heartCondition, hospital, testResult, treatment, testPerformed } = args;
        await ctx.db.patch(id, {
            patientId,
            date,
            heartCondition,
            treatment,
            testPerformed,
            hospital,
            testResult,
        });
    },
});

export const deleteCardiologyDetails = mutation({
    args: { id: v.id("cardiologyDetails") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const createImmunizationDetails = mutation({
    args: { patientId: v.string(),  date: v.string(), vaccineName: v.string(), hospital: v.string(), vaccineType: v.string(), lotNumber: v.string(), nextScheduledDate: v.string() },
    handler: async (ctx, args) => {
        const { patientId,  date, hospital, vaccineName, vaccineType, lotNumber, nextScheduledDate } = args;
        const immunizationDetailsId = await ctx.db.insert("immunizationDetails", {
            patientId,
            date,
            vaccineName,
            vaccineType,
            lotNumber,
            nextScheduledDate,
            hospital,
        });
        return immunizationDetailsId;
    }
});

export const getImmunizationDetails = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        const immunizationDetails = await ctx.db.query("immunizationDetails")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .collect();
        return immunizationDetails;
    },
});

export const updateImmunizationDetails = mutation({
    args: { id: v.id("immunizationDetails"), patientId: v.string(),  date: v.string(), vaccineName: v.string(), hospital: v.string(), vaccineType: v.string(), lotNumber: v.string(), nextScheduledDate: v.string() },
    handler: async (ctx, args) => {
        const { id, patientId,  date, vaccineName, hospital, vaccineType, lotNumber, nextScheduledDate } = args;
        await ctx.db.patch(id, {
            patientId,
            date,
            vaccineName,
            vaccineType,
            lotNumber,
            nextScheduledDate,
            hospital,
        });
    },
});

export const deleteImmunizationDetails = mutation({
    args: { id: v.id("immunizationDetails") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const createLabTestDetails = mutation({
    args: { patientId: v.string(),  date: v.string(), test: v.string(), result: v.string(), hospital: v.string() },
    handler: async (ctx, args) => {
        const { patientId,  date, test, result, hospital } = args;
        const labTestDetailsId = await ctx.db.insert("labTestDetails", {
            patientId,    
            date,
            test,
            result,
            hospital,
        });
        return labTestDetailsId;
    }
});

export const getLabTestDetails = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        const labTestDetails = await ctx.db.query("labTestDetails")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .collect();
        return labTestDetails;
    },
});

export const updateLabTestDetails = mutation({
    args: { id: v.id("labTestDetails"), hospital: v.string(), patientId: v.string(),  date: v.string(), test: v.string(), result: v.string(), },
    handler: async (ctx, args) => {
        const { id, patientId,  date, hospital, test, result,} = args;
        await ctx.db.patch(id, {
            patientId,
            date,
            test,
            hospital,
            result,
        });
    },
});

export const deleteLabTestDetails = mutation({
    args: { id: v.id("labTestDetails") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const createMedicalHistory = mutation({
    args: { patientId: v.string(),  date: v.string(), medicalCondition: v.string(), status: v.string(), medication: v.string() },
    handler: async (ctx, args) => {
        const { patientId,  date, medicalCondition, medication, status } = args;
        const medicalHistoryId = await ctx.db.insert("medicalHistory", {
            patientId,
            date,
            medication,
            medicalCondition,
            status,
        });
        return medicalHistoryId;
    }
});

export const getMedicalHistory = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        const medicalHistory = await ctx.db.query("medicalHistory")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .collect();
        return medicalHistory;
    },
});

export const updateMedicalHistory = mutation({
    args: { id: v.id("medicalHistory"), patientId: v.string(),  date: v.string(), medicalCondition: v.string(), status: v.string(), medication: v.string() },
    handler: async (ctx, args) => {
        const { id, patientId,  date, medicalCondition, medication, status } = args;
        await ctx.db.patch(id, {
            patientId,
            date,
            medication,
            medicalCondition,
            status,
        });
    },
});

export const deleteMedicalHistory = mutation({
    args: { id: v.id("medicalHistory") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const createSurgeryDetails = mutation({
    args: { patientId: v.string(), hospital: v.string(), date: v.string(), surgery: v.string(), status: v.string() },
    handler: async (ctx, args) => {
        const { patientId,  date, surgery, hospital, status } = args;
        const surgeryDetailsId = await ctx.db.insert("surgeryDetails", {
            patientId,
            hospital,
            date,
            surgery,
            status,
        });
        return surgeryDetailsId;
    }
});

export const getSurgeryDetails = query({
    args: { patientId: v.string() },
    handler: async (ctx, args) => {
        const surgeryDetails = await ctx.db.query("surgeryDetails")
            .filter((q) => q.eq(q.field("patientId"), args.patientId))
            .collect();
        return surgeryDetails;
    },
});

export const updateSurgeryDetails = mutation({
    args: { id: v.id("surgeryDetails"), hospital: v.string(), patientId: v.string(),  date: v.string(), surgery: v.string(), status: v.string() },
    handler: async (ctx, args) => {
        const { id, patientId, hospital, date, surgery, status } = args;
        await ctx.db.patch(id, {
            patientId,
            date,
            surgery,
            hospital,
            status,
        });
    },
});

export const deleteSurgeryDetails = mutation({
    args: { id: v.id("surgeryDetails") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});


