"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetFooter,
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/formSchema/category";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import API from "@/lib/api";
import { getActiveCategories } from "@/app/(protected)/actions/category";
import { toast } from "react-toastify";
import { revalidateCategoryPage } from "@/app/(protected)/actions/categoryRevalidate";
 
// Type Definitions
type Category = {
    id: number;
    name: string;
    parent: Category | null;
    image: string;
    subcategories: Category[];
};

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function EditCategory({
    category,
    isOpen,
    setIsOpen,
    onSuccess
}: {
    category: Category,
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    onSuccess: () => void
}) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(category.image || null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category.name,
            // Use "0" instead of empty string to represent "None" (no parent)
            parent: category.parent ? String(category.parent.id) : "0",
        },
    });


    const fetchCategories = async () => {
        try {
            const res = await getActiveCategories();
            // Filter out the current category and its subcategories to prevent circular references
            const filteredCategories = res.data.filter((cat: Category) => cat.id !== category.id);
            setCategories(filteredCategories);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }
        , []);

    

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: CategoryFormValues) => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("name", values.name);
    
            if (values.parent && values.parent !== "0") {
                formData.append("parent", values.parent);
            } else {
                formData.append("parent", "");
            }
    
            if (image) formData.append("image", image);
    
            const response = await API.put(`/products/updateCategory/${category.id}/`, formData);
    
            if (response.status === 200) {    
               // revalidateCategoryPage();
                toast.success("Category updated successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
    
                form.reset();
                setImage(null);
                setImagePreview(null);
                setIsOpen(false);
                onSuccess();
                //  if (onSuccess) onSuccess();
            } else {
                toast.error("Failed to update category", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
                setIsOpen(false);
            }
        } catch (error: any) {
            console.error("Error updating category", error);
            alert(error.response?.data?.error || "Failed to update category");
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-fit max-w-md sm:max-w-lg px-6 overflow-y-auto">
                <div className="flex flex-col items-center">
                    <Image src="/logo.png" alt="Logo" width={120} height={120} />
                </div>
                <SheetHeader>
                    <SheetTitle className="text-2xl text-center font-semibold text-primary">
                        Edit <span className="text-secondary underline">Category</span>
                    </SheetTitle>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">Category Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Smartphone"
                                            {...field}
                                            className="rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">Parent Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary">
                                            <SelectValue placeholder="Select a parent category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Use "0" as the value for "None" option instead of empty string */}
                                            <SelectItem value="0">None (Top-level)</SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel className="font-medium">Category Image</FormLabel>
                            <div className="mt-2 flex flex-col gap-4">
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="rounded-xl"
                                />
                                {imagePreview && (
                                    <div className="flex justify-center">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-secondary hover:bg-secondary/90 hover:cursor-pointer text-white font-semibold py-2 rounded-xl transition-all duration-150"
                        >
                            {isSubmitting ? "Updating..." : "Update Category"}
                        </Button>
                    </form>
                </Form>

                <SheetFooter className="mt-6" />
            </SheetContent>
        </Sheet>
    );
}