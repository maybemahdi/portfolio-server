import { z } from "zod";

export const CreateExperienceValidationSchema = z
  .object({
    companyName: z.string({
      required_error: "Company name is required",
    }),
    position: z.string({
      required_error: "Position is required",
    }),
    startDate: z.string({
      required_error: "Start date is required",
    }),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })
  .strict();

export const UpdateExperienceValidationSchema = z
  .object({
    companyName: z.string().optional(),
    position: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })
  .strict();
