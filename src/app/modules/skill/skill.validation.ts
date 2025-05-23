import { z } from "zod";

export const CreateSkillValidationSchema = z
  .object({
    name: z
      .string({ required_error: "Skill name is required" })
      .nonempty({ message: "Skill name cant be empty" }),
  })
  .strict();

export const UpdateSkillValidationSchema = z
  .object({
    name: z.string().optional(),
  })
  .strict();
