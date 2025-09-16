import { z } from "zod"

export const vendorFormSchema = z.object({
  ownerName: z.string().min(3, "Owner name is required"),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(2, "Business type is required"),
  businessDescription: z.string().optional(),
  registrationNumber: z.string().optional(),
  registrationDocument: z
    .any()
    .refine(
      (files) => files && files?.length > 0,
      { message: "Registration document is required" }
    ),
  address: z.string().optional(),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
})