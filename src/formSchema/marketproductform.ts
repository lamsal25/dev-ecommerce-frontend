import { z } from "zod";

export const marketProductFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock quantity is required"),
  isAvailable: z.boolean(),
  
  image: z
    .any()
    .refine((file) => file?.[0], "Main image is required"),
  topImage: z
    .any()
    .refine((file) => file?.[0], "Top view image is required"),
  bottomImage: z
    .any()
    .refine((file) => file?.[0], "Bottom view image is required"),
  leftImage: z
    .any()
    .refine((file) => file?.[0], "Left view image is required"),
  rightImage: z
    .any()
    .refine((file) => file?.[0], "Right view image is required"),

});
