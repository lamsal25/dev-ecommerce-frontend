"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { marketProductFormSchema } from "@/formSchema/marketproductform";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePenLine, LoaderCircle, Save } from "lucide-react";
import { useEffect, useRef, useState, useTransition, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMarketplaceProductsById, updateMarketPlaceProduct } from "@/app/(protected)/actions/product";
import { getActiveCategories } from "@/app/(protected)/actions/category";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/RichTextEditor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    ),
  }
);

// Define the RichTextEditorHandle type
type RichTextEditorHandle = {
  getContent: () => string;
};

// Image upload component to reduce repetition
const ImageUpload = ({ 
  label, 
  preview, 
  onChange 
}: { 
  label: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <div className="mt-1 flex items-center gap-4">
      <label className="cursor-pointer flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-8 h-8 mb-2 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, JPEG (MAX. 5MB each)
          </p>
        </div>
        <Input
          type="file"
          onChange={onChange}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
        />
      </label>
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  </div>
);

export default function MarketPlaceEdit({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const descriptionEditorRef = useRef<RichTextEditorHandle>(null);
  
  // Image states
  const [images, setImages] = useState({
    image: { file: null as File | null, preview: null as string | null },
    topImage: { file: null as File | null, preview: null as string | null },
    bottomImage: { file: null as File | null, preview: null as string | null },
    leftImage: { file: null as File | null, preview: null as string | null },
    rightImage: { file: null as File | null, preview: null as string | null },
  });
  
  const [categories, setCategories] = useState<any[]>([]);
  const [descriptionEditorInitialValue, setDescriptionEditorInitialValue] = useState("");
  const [productData, setProductData] = useState<any>(null);

  const form = useForm<z.infer<typeof marketProductFormSchema>>({
    resolver: zodResolver(marketProductFormSchema),
    defaultValues: {
      category: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      isAvailable: true,
      image: "",
      topImage: "",
      bottomImage: "",
      leftImage: "",
      rightImage: "",
    },
  });

  // Memoize categories to prevent unnecessary re-renders
  const categoriesOptions = useMemo(() => 
    categories.map((category) => ({
      id: category.id,
      name: category.name,
      value: category.id.toString()
    })), [categories]
  );

  // Optimized image handler factory
  const createImageHandler = useCallback((imageType: keyof typeof images) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => ({
            ...prev,
            [imageType]: {
              file,
              preview: reader.result as string
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  // Memoized image handlers
  const imageHandlers = useMemo(() => ({
    image: createImageHandler('image'),
    topImage: createImageHandler('topImage'),
    bottomImage: createImageHandler('bottomImage'),
    leftImage: createImageHandler('leftImage'),
    rightImage: createImageHandler('rightImage'),
  }), [createImageHandler]);

  // Fetch categories only once and cache them
  useEffect(() => {
    const fetchCategories = async () => {
      if (categories.length > 0) return; // Don't fetch if already cached
      
      try {
        const response = await getActiveCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array - fetch only once

  // Fetch product data when sheet opens
  useEffect(() => {
    const fetchMarketPlaceProduct = async () => {
      if (!isOpen || productData) return; // Don't fetch if already cached

      setIsLoading(true);
      try {
        const response = await getMarketplaceProductsById(id);
        console.log("Product Data:", response);
        if (response.data) {
          const data = response.data;
          setProductData(data);
          console.log(data)
          
          // Set image previews
          setImages({
            image: { file: null, preview: data.image },
            topImage: { file: null, preview: data.topImage },
            bottomImage: { file: null, preview: data.bottomImage },
            leftImage: { file: null, preview: data.leftImage },
            rightImage: { file: null, preview: data.rightImage },
          });

          // Set form data
          setDescriptionEditorInitialValue(data.description || "");
          form.reset({
            name: data.name,
            description: data.description,
            category: data.category.id.toString(),
            price: data.price,
            isAvailable: data.isAvailable,
            stock: data.stock,
            image: data.image,
            topImage: data.topImage,
            bottomImage: data.bottomImage,
            leftImage: data.leftImage,
            rightImage: data.rightImage,
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketPlaceProduct();
  }, [id, isOpen, productData, form]);

  const onSubmit = useCallback(async (values: z.infer<typeof marketProductFormSchema>) => {
  startTransition(async () => {
    try {
      const formData = new FormData();
      const descriptionFromEditor = descriptionEditorRef.current?.getContent() || "";
      const descriptionString = Array.isArray(descriptionFromEditor) 
        ? descriptionFromEditor.join("") 
        : descriptionFromEditor;

      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      formData.append("isAvailable", values.isAvailable.toString());
      formData.append("description", descriptionString);

      Object.entries(images).forEach(([key, { file }]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await updateMarketPlaceProduct(id, formData);

      // ✅ Check response here safely
      if (response?.status === 200 || response?.data?.success) {
        toast.success('Product updated successfully!');
        form.reset();
        setImages({
          image: { file: null, preview: null },
          topImage: { file: null, preview: null },
          bottomImage: { file: null, preview: null },
          leftImage: { file: null, preview: null },
          rightImage: { file: null, preview: null },
        });
        setIsOpen(false);
        setProductData(null);
      } else {
        toast.error('Update failed. Please try again.');
      }

    } catch (err: any) {
      console.log("❌ Error caught in onSubmit", err);
      toast.error('An error occurred while updating the product');
    }
  });
}, [id, images, form]);



  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <span className="flex cursor-default select-none items-center gap-1 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <FilePenLine size={16} />
          <p>Update</p>
        </span>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <ToastContainer />
        <SheetHeader>
          <SheetTitle>Update Your Product</SheetTitle>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoaderCircle className="animate-spin" size={32} />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-5">
              <div className="space-y-4 mb-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter product price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image uploads using the reusable component */}
                <ImageUpload 
                  label="Image" 
                  preview={images.image.preview} 
                  onChange={imageHandlers.image} 
                />
                
                <ImageUpload 
                  label="Top Image" 
                  preview={images.topImage.preview} 
                  onChange={imageHandlers.topImage} 
                />
                
                <ImageUpload 
                  label="Bottom Image" 
                  preview={images.bottomImage.preview} 
                  onChange={imageHandlers.bottomImage} 
                />
                
                <ImageUpload 
                  label="Left Image" 
                  preview={images.leftImage.preview} 
                  onChange={imageHandlers.leftImage} 
                />
                
                <ImageUpload 
                  label="Right Image" 
                  preview={images.rightImage.preview} 
                  onChange={imageHandlers.rightImage} 
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <div className="min-h-[200px] border rounded-md">
                        <RichTextEditor
                          key={productData?.id || 'new'}
                          ref={descriptionEditorRef}
                          initialContent={descriptionEditorInitialValue}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesOptions.map((category) => (
                            <SelectItem key={category.id} value={category.value}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter stock"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button size={"sm"} disabled={isPending || isLoading} type="submit">
                {isPending ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Update Product
              </Button>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}