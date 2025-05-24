import { z } from "zod";

export const CreateProjectValidationSchema = z
  .object({
    title: z.string({
      required_error: "Title is required",
    }),
    shortDescription: z.string({
      required_error: "Short description is required",
    }),
    longDescription: z.string({
      required_error: "Long description is required",
    }),
    liveLink: z.string({
      required_error: "Live link is required",
    }),
    technologies: z.array(z.string(), {
      required_error: "Technologies are required",
    }),
  })
  .strict();

export const UpdateProjectValidationSchema = z.object({
  title: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  liveLink: z.string().optional(),
  technologies: z.array(z.string()).optional(),
});
