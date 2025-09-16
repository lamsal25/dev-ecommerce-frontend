import { z } from "zod";

export const advertisementFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().url("Must be a valid URL"),
  position: z.enum(["homepage_middle","homepage_bottom","productpage_sidebar", "marketplace", "above_navbar"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  description: z.string().min(1, "Description is required"),
  image: z
    .any()
    .refine((files) => files?.length === 1, "Ad image is required"),
});