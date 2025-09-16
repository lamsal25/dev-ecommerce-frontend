import { z } from "zod";

export const userFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(100, { message: "First name must be at most 100 characters." }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(100, { message: "Last name must be at most 100 characters." }),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),

  email: z
    .string()
    .email({ message: "Please enter a valid email" }),

  mobile: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile number must be 10 digits" }),

  dateOfBirth: z.date().optional().nullable(),
  
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),

  confirmPassword: z.string(),

  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions to register"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});