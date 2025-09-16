import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters."),
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits."),
  address: z
    .string()
    .min(2, "Please enter a valid address.")
    .max(200, "Address cannot exceed 200 characters."),
  city: z
    .string()
    .min(1, "City is required.")
    .max(50, "City name cannot exceed 50 characters."),
});
