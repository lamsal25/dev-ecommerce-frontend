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
    SheetTrigger,
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

// Type Definitions
type Category = {
    id: number;
    name: string;
    parent: Category | null;
    subcategories: Category[];
};

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CreateCategory() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            parent: "",
        },
    });

    // Fetch the categories  
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getActiveCategories();
                setCategories(Array.isArray(res?.data) ? res.data : []); // ✅ always array
            } catch (error) {
                console.error("Error fetching categories", error);
                setCategories([]); // ✅ fallback to empty
            }
        };
        fetchCategories();
    }, []);

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
            const formData = new FormData();
            formData.append("name", values.name);
            if (values.parent) formData.append("parent", values.parent);
            if (image) formData.append("image", image);

            const response = await API.post(`/products/createCategory/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201 || response.status === 200) {
                toast.success("Category created successfully!", {
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
            } else {
                toast.error("Failed to create Category", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error("Error creating category", error);
            alert("Error creating category");
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="rounded-xl px-6 py-2 font-medium bg-secondary text-white hover:bg-secondary/90 ">
                    + Add Category
                </Button>
            </SheetTrigger>

            <SheetContent className="w-fit max-w-md sm:max-w-lg px-6 overflow-y-auto">
                <div className="flex flex-col items-center">
                    <Image src="/logo.png" alt="Logo" width={120} height={120} />
                </div>
                <SheetHeader>
                    <SheetTitle className="text-2xl text-center font-semibold text-primary">
                        Create <span className="text-secondary underline">Category</span>
                    </SheetTitle>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
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
                                            <SelectValue placeholder="None (Top-level)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.length > 0 ? (
                                                categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 px-2 py-1 text-sm">
                                                    No categories available
                                                </span>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel className="font-medium">Category Image</FormLabel>
                            <div className="mt-2 flex items-center gap-4">
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="rounded-xl"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-20 w-20 object-cover rounded-lg border"
                                    />
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-secondary hover:bg-secondary/90 hover:cursor-pointer text-white font-semibold py-2 rounded-xl transition-all duration-150"
                        >
                            Create Category
                        </Button>
                    </form>
                </Form>

                <SheetFooter className="mt-6" />
            </SheetContent>
        </Sheet>
    );
}
