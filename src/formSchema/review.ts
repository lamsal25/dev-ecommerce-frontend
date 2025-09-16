import { z } from "zod";

export const reviewFormSchema = z.object({
  text: z
    .string({ required_error: "Please enter a review" })
    .min(1, "Please enter a review"),
  rating: z
    .number({ required_error: "Please select a rating" })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});
