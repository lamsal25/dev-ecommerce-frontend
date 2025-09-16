import { z } from "zod";
// Define vendor schema
export const vendorSchema = z.object({
  ownerName: z.string().min(1, "Owner Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  businessName: z.string().min(1, "Business Name is required"),
  businessType: z.string().min(1, "Business Type is required"),
  businessDescription: z.string().optional(),
  registrationNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website: z.string().optional(),
});