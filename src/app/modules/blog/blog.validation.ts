import { z } from "zod";

export const CreateBlogValidation = z
  .object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      required_error: "Content is required",
    }),
    isPublished: z.boolean().optional(),
  })
  .strict();

export const UpdateBlogValidation = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    isPublished: z.boolean().optional(),
  })
  .strict();
