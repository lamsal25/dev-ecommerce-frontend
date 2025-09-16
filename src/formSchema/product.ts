import { z } from "zod";

export const productFormSchema = z.object({
  id: z.number().optional(),

  // Basic Info
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category_id: z.string().min(1, "Category is required"),

  // Pricing
  originalPrice: z.coerce.number().nonnegative(),
  discountedPrice: z.coerce.number().nonnegative(),
  discountPercentage: z.coerce.number().nonnegative(),

  // stock
  totalStock: z.coerce.number().int().nonnegative(),

  has_sizes: z.boolean(),

  // Flags
  isAvailable: z.boolean(),

  image: z.string().optional().nullable(),
  topImage: z.string().optional().nullable(),
  bottomImage: z.string().optional().nullable(),
  leftImage: z.string().optional().nullable(),
  rightImage: z.string().optional().nullable(),

  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        stock: z.coerce.number().int().nonnegative(),
      })
    )
    .min(1, "Select at least one size"),
});
