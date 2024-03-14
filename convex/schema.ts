import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(),
        }).index("by_token", ["tokenIdentifier"]),
  patients: defineTable({
    name: v.string(),
    dateOfBirth: v.string(),
    maritalStatus: v.string(),
    identificationNumber: v.string(),
    gender: v.string(),
    homeAddress: v.string(),
    email: v.string(),
    city: v.string(),
    state: v.string(),
    country: v.string(),
    phone: v.string(),
    guardianName: v.string(),
    relationship: v.string(),
    guardianGender: v.string(),
    guardianHomeAddress: v.string(),
    guardianEmail: v.string(),
    guardianCity: v.string(),
    guardianState: v.string(),
    guardianCountry: v.string(),
    guardianPhone: v.string(),
  }),
  doctors: defineTable({
    name: v.string(),
    dateOfBirth: v.string(),
    hospital: v.string(),
    specialty: v.string(),
    registrationNumber: v.string(),
    identificationNumber: v.string(),
    yearsOfExperience: v.string(),
    gender: v.string(),
    homeAddress: v.string(),
    email: v.string(),
    status: v.string(),
    city: v.string(),
    state: v.string(),
    country: v.string(),
    phone: v.string(),
  }),
  chats: defineTable({
    author: v.string(),
    body: v.string(),
  }),
  allergyDetails: defineTable({
    patientId: v.any(),
    name: v.string(),
    reaction: v.string(),
    severity: v.string(),
    treatment: v.string(),
  }),
  diagnosisDetails: defineTable({
    patientId: v.any(),
    diagnosis: v.string(),
    treatment: v.string(),
  }),
  physicalDetails: defineTable({
    patientId: v.any(),
    weight: v.string(),
    height: v.string(),
    bmi: v.string(),
    genotype: v.string(),
    bloodGroup: v.string(),
    rhesusFactor: v.string(),
  }),
  medicalHistory: defineTable({
    patientId: v.any(),
    medicalCondition: v.string(),
    medication: v.string(),
    status: v.string(),
  }),
  surgeryDetails: defineTable({
    patientId: v.any(),
    surgery: v.string(),
    hospital: v.string(),
    status: v.string(),
  }),
  labTestDetails: defineTable({
    patientId: v.any(),
    test: v.string(),
    hospital: v.string(),
    result: v.string(),
  }),
  immunizationDetails: defineTable({
    patientId: v.any(),
    vaccineName: v.string(),
    vaccineType: v.string(),
    lotNumber: v.string(),
    nextScheduledDate: v.string(),
    hospital: v.string(),
  }),
  cardiologyDetails: defineTable({
    patientId: v.any(),
    testPerformed: v.string(),
    hospital: v.string(),
    testResult: v.string(),
    treatment: v.string(),
    heartCondition: v.string(),
  }),
  vitalSigns: defineTable({
    patientId: v.any(),
    bloodPressure: v.string(),
    temperature: v.string(),
    pulseRate: v.string(),
    respiratoryRate: v.string(),
  }),
});



// appointments: defineTable({
  //   patientId: v.any(),
  //   doctorId: v.string(),
  //   date: v.string(),
  //   time: v.string(),
  //   status: v.string(),
  // }),
  // records: defineTable({
  //   patientId: v.any(),
  //   doctorId: v.string(),
  //   date: v.string(),
  //   time: v.string(),
  //   status: v.string(),
  // }),
  // services: defineTable({
  //   name: v.string(),
  //   description: v.string(),
  //   price: v.string(),
  // }),
  // categories: defineTable({
  //   name: v.string(),
  //   description: v.string(),
  // }),
  // notifications: defineTable({
  //   title: v.string(),
  //   body: v.string(),
  // }),
  // settings: defineTable({
  //   name: v.string(),
  //   value: v.string(),
  // }),
  // payments: defineTable({
  //   patientId: v.string(),
  //   amount: v.string(),
  //   status: v.string(),
  // }),
  // feedbacks: defineTable({
  //   patientId: v.string(),
  //   body: v.string(),
  // }),
  // subscriptions: defineTable({
  //   patientId: v.string(),
  //   plan: v.string(),
  //   status: v.string(),
  // }),
  // prescriptions: defineTable({
  //   patientId: v.string(),
  //   doctorId: v.string(),
  //   date: v.string(),
  //   time: v.string(),
  //   status: v.string(),
  // }),
  // invoices: defineTable({
  //   patientId: v.string(),
  //   amount: v.string(),
  //   status: v.string(),
  // }),
  // reports: defineTable({
  //   patientId: v.string(),
  //   doctorId: v.string(),
  //   date: v.string(),
  //   time: v.string(),
  //   status: v.string(),
  // }),
  // plans: defineTable({
  //   name: v.string(),
  //   description: v.string(),
  //   price: v.string(),
  // }),