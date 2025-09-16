// types/product.ts
export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  parent?: Category | null;
  subcategories?: Category[];
};

export type ProductSize = {
  id: number;
  size: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountPercentage?: number;
  discountedPrice: number;
  image?: string | null | undefined;
  topImage?: string | null;
  bottomImage?: string | null;
  leftImage?: string | null;
  rightImage?: string | null;
  totalStock: number;
  has_sizes: boolean;
  isFeatured: boolean;
  // Fixed: Changed from 'review' to 'reviews' and made it a number for review count
  reviews?: number;
  // Fixed: Made rating optional number (not null)
  rating?: number;
  category: Category;
  sizes: ProductSize[];
  slug: string;
  vendor: {
    id: number;
    name: string;
  }
};

export type ProductFormValues = {
  id?: string;
  name: string;
  description: string;
  category_id: string;
  originalPrice: number;
  discountPercentage: number;
  discountedPrice: number;
  totalStock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  image?: File | string | null;
  topImage?: File | string | null;
  bottomImage?: File | string | null;
  leftImage?: File | string | null;
  rightImage?: File | string | null;
  sizes: {
    size: string;
    stock: number;
  }[];
};