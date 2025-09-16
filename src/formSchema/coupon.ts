import { z } from "zod";

export const couponSchema = z.object({
  code: z.string({required_error: "Coupon code is required"}).length(6,"Coupon code must be exactly 6 characters"),
  discount_type: z.enum(["percent", "fixed"]),
  discount_value: z.number().min(0.01, "Must be greater than 0"),
  usage_limit: z.number().min(1, "Must be at least 1"),
  expiry_date: z.string(), 
});