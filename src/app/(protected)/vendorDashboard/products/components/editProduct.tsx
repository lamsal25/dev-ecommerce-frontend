"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Save, X, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { getActiveCategories } from "@/app/(protected)/actions/category";
import { productFormSchema } from "@/formSchema/product";
import API from "@/lib/api";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/RichTextEditor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

const MemoizedRichTextEditor = React.memo(RichTextEditor);

type RichTextEditorHandle = {
  getContent: () => string;
};

type Category = {
  id: number;
  name: string;
  parent: Category | null;
  subcategories: Category[];
};

type Product = {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage?: number;
  totalStock: number;
  isAvailable: boolean;
  image?: string;
  topImage?: string;
  bottomImage?: string;
  leftImage?: string;
  rightImage?: string;
  sizes?: { size: string; stock: number }[];
  has_sizes?: boolean; // Add this field
  category: Category;
};

type ProductFormValues = z.infer<typeof productFormSchema>;

interface EditProductProps {
  product: Product;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess: () => Promise<void>;
}

export default function EditProduct({
  product,
  isOpen,
  setIsOpen,
  onSuccess,
}: EditProductProps) {
  const [isPending, setIsPending] = useState(false);
  const descriptionEditorRef = useRef<RichTextEditorHandle>(null);

  const [imageFields, setImageFields] = useState<{
    [key: string]: File | null;
  }>({
    image: null,
    topImage: null,
    bottomImage: null,
    leftImage: null,
    rightImage: null,
  });

  const [previewUrls, setPreviewUrls] = useState<{
    [key: string]: string | null;
  }>({
    image: product.image || null,
    topImage: product.topImage || null,
    bottomImage: product.bottomImage || null,
    leftImage: product.leftImage || null,
    rightImage: product.rightImage || null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Calculate discount percentage from prices
  const calculateDiscountPercentage = useCallback((originalPrice: number, discountedPrice: number) => {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }, []);

  // Determine if product has sizes based on existing sizes array
  const productHasSizes = (product.sizes && product.sizes.length > 0) || product.has_sizes || false;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      category_id: String(product.category.id),
      originalPrice: product.originalPrice,
      discountPercentage: calculateDiscountPercentage(product.originalPrice, product.discountedPrice),
      discountedPrice: product.discountedPrice,
      isAvailable: product.isAvailable,
      totalStock: Math.max(1, product.totalStock), // Ensure minimum value of 1
      has_sizes: productHasSizes,
      sizes: product.sizes || [],
    },
  });

  // Watch has_sizes to conditionally render sections
  const hasSizes = form.watch("has_sizes");

  // Memoized reset function
  const resetForm = useCallback(() => {
    const existingSizes = product.sizes || [];
    const hasExistingSizes = (existingSizes.length > 0) || product.has_sizes || false;

    form.reset({
      name: product.name,
      description: product.description,
      category_id: String(product.category.id),
      originalPrice: product.originalPrice,
      discountPercentage: calculateDiscountPercentage(product.originalPrice, product.discountedPrice),
      discountedPrice: product.discountedPrice,
      isAvailable: product.isAvailable,
      totalStock: Math.max(1, product.totalStock), // Ensure minimum value of 1
      has_sizes: hasExistingSizes,
      sizes: existingSizes,
    });

    // Reset images
    setImageFields({
      image: null,
      topImage: null,
      bottomImage: null,
      leftImage: null,
      rightImage: null,
    });
    setPreviewUrls({
      image: product.image || null,
      topImage: product.topImage || null,
      bottomImage: product.bottomImage || null,
      leftImage: product.leftImage || null,
      rightImage: product.rightImage || null,
    });
  }, [form, product, calculateDiscountPercentage]);

  // Reset form when product changes or modal opens
  useEffect(() => {
    if (isOpen && product) {
      resetForm();
    }
  }, [isOpen, product, resetForm]);

  // Fetch Categories with loading state
  useEffect(() => {
    const fetchCategories = async () => {
      if (categories.length > 0) return; // Avoid refetching
      
      setIsLoadingCategories(true);
      try {
        const response = await getActiveCategories();
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          toast.error("Invalid category data received");
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, categories.length]);

  // Improved image change handler with validation
  const handleImageChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFields((prev) => ({ ...prev, [key]: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrls((prev) => ({ ...prev, [key]: reader.result as string }));
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  }, []);

  // Remove image handler
  const removeImage = useCallback((key: string) => {
    setImageFields((prev) => ({ ...prev, [key]: null }));
    // Reset to original image if available, otherwise null
    const originalImageKey = key as keyof typeof product;
    setPreviewUrls((prev) => ({ 
      ...prev, 
      [key]: product[originalImageKey] as string || null 
    }));
  }, [product]);

  // Calculate total stock from sizes
  const calculateTotalStock = useCallback((sizes: { size: string; stock: number }[]) => {
    return sizes.reduce((total, sizeData) => total + sizeData.stock, 0);
  }, []);

  // Custom validation function
  const validateForm = useCallback((values: ProductFormValues) => {
    // Check required fields
    if (!values.name || values.name.trim() === "") {
      toast.error("Product name is required");
      return false;
    }

    if (!values.description || values.description.trim() === "") {
      toast.error("Product description is required");
      return false;
    }

    if (!values.category_id || values.category_id === "") {
      toast.error("Please select a category");
      return false;
    }

    if (!values.originalPrice || values.originalPrice <= 0) {
      toast.error("Please enter a valid original price");
      return false;
    }

    // Stock validation based on has_sizes
    if (values.has_sizes) {
      if (!values.sizes || values.sizes.length === 0) {
        toast.error("Please select at least one size for this product");
        return false;
      }
      
      const totalSizeStock = calculateTotalStock(values.sizes);
      if (totalSizeStock <= 0) {
        toast.error("Please enter valid stock quantities for selected sizes");
        return false;
      }
    } else {
      // For products without sizes, check totalStock
      if (!values.totalStock || values.totalStock <= 0) {
        toast.error("Please enter a valid stock quantity (must be greater than 0)");
        return false;
      }
    }

    return true;
  }, [calculateTotalStock]);

  const onSubmit = async (values: ProductFormValues) => {
    console.log("Form submitted with values:", values);
    
    // Custom validation
    if (!validateForm(values)) {
      return;
    }

    // Calculate total stock from sizes if product has sizes
    const totalStock = values.has_sizes 
      ? calculateTotalStock(values.sizes)
      : values.totalStock;

    try {
      setIsPending(true);
      console.log("Starting product update...");
      
      const formData = new FormData();

      // Add all fields including has_sizes
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'totalStock') {
          // Use calculated or provided total stock
          formData.append(key, totalStock.toString());
        } else if (key === 'has_sizes') {
          // Convert boolean to string
          formData.append(key, (value as boolean).toString());
        } else if (key === 'sizes') {
          // Only add sizes if has_sizes is true
          if (values.has_sizes && Array.isArray(value)) {
            value.forEach((v) => {
              formData.append('sizes[]', JSON.stringify(v));
            });
          }
        } else if (Array.isArray(value)) {
          value.forEach((v) => {
            if (typeof v === "object") {
              formData.append(`${key}[]`, JSON.stringify(v));
            } else {
              formData.append(`${key}[]`, v);
            }
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Add image files only if they were changed
      Object.entries(imageFields).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      console.log("Sending request to API...");
      
      // Debug: Log formData contents
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await API.put(`/products/updateProduct/${product.id}/`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Product updated successfully!");
        setIsOpen(false);
        await onSuccess();
      } else {
        toast.error("Failed to update product");
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      if (error.response) {
        const message = error.response.data?.message || error.response.data?.error || "Server error occurred";
        toast.error(message);
        console.log("Server response:", error.response.data);
      } else {
        toast.error("Error connecting to the server");
      }
    } finally {
      setIsPending(false);
    }
  };

  const imageConfigs = [
    { key: "image", label: "Main Product Image", required: false },
    { key: "topImage", label: "Top Image", required: false },
    { key: "bottomImage", label: "Bottom Image", required: false },
    { key: "leftImage", label: "Left Image", required: false },
    { key: "rightImage", label: "Right Image", required: false },
  ];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-auto w-full max-w-md sm:max-w-lg px-6 pb-8">
        <SheetHeader>
          <div className="flex justify-center">
            <Image src={"/logo.png"} alt="logo" height={120} width={120} />
          </div>
          <SheetTitle className="text-2xl font-semibold text-center">
            Edit <span className="text-secondary underline">Product</span>
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <div className="space-y-6">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter product name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                const onChangeRef = useRef(field.onChange);
                onChangeRef.current = field.onChange;

                return (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <div className="min-h-[200px] border rounded-md">
                      <MemoizedRichTextEditor
                        key={`edit-description-editor-${product.id}`}
                        ref={descriptionEditorRef}
                        initialContent={field.value || ""}
                        onChange={(content) => {
                          onChangeRef.current(content);
                        }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending || isLoadingCategories}
                  >
                    <SelectTrigger>
                      <SelectValue 
                        placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Has Sizes Toggle */}
            <FormField
              control={form.control}
              name="has_sizes"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border rounded-xl px-4 py-3">
                  <div>
                    <FormLabel className="text-sm font-medium">
                      This product has different sizes
                    </FormLabel>
                    <p className="text-xs text-gray-500 mt-1">
                      Enable if your product comes in different sizes (S, M, L, etc.)
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        // Clear sizes if has_sizes is disabled
                        if (!checked) {
                          form.setValue("sizes", []);
                          // Reset totalStock to 1 when switching to non-sized
                          if (form.watch("totalStock") === 0) {
                            form.setValue("totalStock", 1);
                          }
                        } else {
                          // When enabling sizes, set totalStock to 0 since it will be calculated
                          form.setValue("totalStock", 0);
                        }
                      }}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Conditional Sizes Section */}
            {hasSizes && (
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Sizes & Stock *</FormLabel>
                    <div className="space-y-3">
                      {sizeOptions.map((size) => {
                        const sizeData = field.value.find((s) => s.size === size);
                        const isChecked = !!sizeData;

                        return (
                          <div key={size} className="flex items-center gap-3">
                            <label
                              className={`flex items-center gap-3 cursor-pointer px-3 py-2 border rounded-lg transition-colors ${
                                isChecked
                                  ? "bg-secondary/10 border-secondary"
                                  : "bg-white hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...field.value,
                                      { size, stock: 1 }, // Changed from 0 to 1
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((s) => s.size !== size)
                                    );
                                  }
                                }}
                                className="hidden"
                              />
                              <span
                                className={`w-8 text-center font-medium ${
                                  isChecked ? "text-secondary" : "text-gray-500"
                                }`}
                              >
                                {size}
                              </span>

                              {isChecked && (
                                <Input
                                  type="number"
                                  min="1" // Changed from 0 to 1
                                  value={sizeData?.stock || 1} // Changed from 0 to 1
                                  onChange={(e) => {
                                    const newStock = Math.max(1, parseInt(e.target.value) || 1); // Changed from 0 to 1
                                    field.onChange(
                                      field.value.map((item) =>
                                        item.size === size
                                          ? { ...item, stock: newStock }
                                          : item
                                      )
                                    );
                                  }}
                                  className="w-20"
                                  placeholder="Qty"
                                  disabled={isPending}
                                />
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Stock: {calculateTotalStock(field.value)}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Total Stock for Non-Sized Products */}
            {!hasSizes && (
              <FormField
                control={form.control}
                name="totalStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Stock *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1" // Changed from 0 to 1
                        {...field}
                        value={Number(field.value) || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          field.onChange(Math.max(1, value)); // Ensure minimum value is 1
                        }}
                        placeholder="Enter total stock quantity (minimum 1)"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Stock must be at least 1
                    </p>
                  </FormItem>
                )}
              />
            )}

            {/* Price Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        value={Number(field.value) || ""}
                        onChange={(e) => {
                          const originalPrice = parseFloat(e.target.value) || 0;
                          field.onChange(originalPrice);
                          
                          // Calculate and update discounted price
                          const discountPercentage = form.getValues("discountPercentage") || 0;
                          const discountedPrice = originalPrice * (1 - discountPercentage / 100);
                          form.setValue("discountedPrice", discountedPrice);
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        {...field}
                        value={Number(field.value) || ""}
                        onChange={(e) => {
                          const discountPercentage = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                          field.onChange(discountPercentage);
                          
                          // Calculate and update discounted price
                          const originalPrice = form.getValues("originalPrice") || 0;
                          const discountedPrice = originalPrice * (1 - discountPercentage / 100);
                          form.setValue("discountedPrice", discountedPrice);
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Show calculated discounted price */}
            <div className="text-sm text-gray-600">
              Discounted Price: ${((form.watch("originalPrice") || 0) * (1 - (form.watch("discountPercentage") || 0) / 100)).toFixed(2)}
            </div>

            {/* Image Uploads */}
            {imageConfigs.map(({ key, label, required }) => (
              <div key={key}>
                <FormLabel>
                  {label} {required && "*"}
                </FormLabel>
                <div className="mt-2 space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, key)}
                    disabled={isPending}
                  />
                  {previewUrls[key] && (
                    <div className="relative inline-block">
                      <img
                        src={previewUrls[key]!}
                        alt="preview"
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(key)}
                        disabled={isPending}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Availability Toggle */}
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border rounded-xl px-4 py-2">
                  <FormLabel className="text-sm font-medium">
                    Available for Purchase
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="button"
              disabled={isPending}
              className="w-full mt-6 rounded-xl bg-secondary hover:bg-secondary/90"
              onClick={async (e) => {
                e.preventDefault();
                
                try {
                  const formValues = form.getValues();
                  console.log("Form values:", formValues);
                  
                  await onSubmit(formValues);
                } catch (error) {
                  console.error("Direct submission error:", error);
                  toast.error("An error occurred while submitting the form");
                }
              }}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Updating Product...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Update Product
                </>
              )}
            </Button>
            
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
                <p><strong>Debug Info:</strong></p>
                <p>Has Sizes: {hasSizes ? "Yes" : "No"}</p>
                <p>Sizes Count: {form.watch("sizes").length}</p>
                <p>Total Stock: {hasSizes ? calculateTotalStock(form.watch("sizes")) : form.watch("totalStock")}</p>
                <p>Form Errors: {Object.keys(form.formState.errors).length}</p>
                <p>Is Pending: {isPending ? "Yes" : "No"}</p>
                <p>Product Sizes: {JSON.stringify(product.sizes)}</p>
                <p>Product Name: {form.watch("name")}</p>
                <p>Category ID: {form.watch("category_id")}</p>
                <p>Original Price: {form.watch("originalPrice")}</p>
                {Object.keys(form.formState.errors).length > 0 && (
                  <pre className="mt-2 text-xs">
                    {JSON.stringify(form.formState.errors, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
}