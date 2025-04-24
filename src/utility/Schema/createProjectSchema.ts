import { z } from "zod";
import { Service, ServiceEnum, Skill, SkillEnum } from "../contants";

export const createProjectSchema = z.object({
    title: z
        .string({ required_error: "Project title is required" })
        .min(3, { message: "Project title must be at least 3 characters" }),


    description: z
        .string({ required_error: "Description is required" })
        .min(10, { message: "Description must be at least 10 characters" }),

    pricing: z.object({
        currency: z.enum(["USD", "INR", "EUR"], {
            errorMap: () => ({ message: "Select a valid currency (USD, INR, EUR)" }),
        }),
        amount: z
            .number({ invalid_type_error: "Budget amount must be a number" })
            .positive({ message: "Budget must be greater than 0" }),
    }),


    serviceType: z
        .array(
            z.enum(
                Object.values(ServiceEnum) as [Service, ...Service[]]
            ),
        )
        .min(1, { message: "Select at least one service type" }),


    requiredSkills: z
        .array(
            z.enum(Object.values(SkillEnum) as [Skill, ...Skill[]]),
        )
        .min(1, { message: "Select at least one skill" }),


    requirements: z.array(z.string().min(1)).optional(),


    deadline: z.preprocess(
        (val) =>
            typeof val === "string" || val instanceof Date ? new Date(val) : val,
        z.date({ required_error: "Deadline is required" }).refine(
            (date) => date > new Date(),
            { message: "Deadline must be in the future" },
        ),
    ),


    projectImage: z.string().url().optional(),


    projectIds: z.array(z.string()).optional(),
});