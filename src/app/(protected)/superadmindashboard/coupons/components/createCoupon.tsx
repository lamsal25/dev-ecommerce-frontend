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
import { couponSchema } from "@/formSchema/coupon";
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

type CouponFormValues = z.infer<typeof couponSchema>;

export default function CreateCoupons() {
  //   const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discount_type: "percent",
      discount_value: 0,
      usage_limit: 1,
      expiry_date: "",
    },
  });

  // Fetch the categories
  //   useEffect(() => {
  //     const fetchCoupons = async () => {
  //       try {
  //         const res = await getActiveCategories();
  //         setCategories(res.data);
  //       } catch (error) {
  //         console.error("Error fetching categories", error);
  //       }
  //     };
  //     fetchCategories();
  //   }, []);

  const onSubmit = async (formData: CouponFormValues) => {
    try {
      console.log(formData);
      const response = await API.post(`/coupons/createCoupon/`, formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success("Coupons created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        form.reset();
        setIsOpen(false);
      } else {
        toast.error("Failed to Create Coupon", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating coupon", error);
      alert(error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl px-6 py-2 font-medium bg-secondary text-white hover:bg-secondary/90 "
        >
          + Add Coupons
        </Button>
      </SheetTrigger>

      <SheetContent className="w-fit max-w-md sm:max-w-lg px-6 overflow-y-auto">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Logo" width={120} height={120} />
        </div>
        <SheetHeader>
          <SheetTitle className="text-2xl text-center font-semibold text-primary">
            Create <span className="text-secondary underline">Coupon</span>
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Coupon Code</FormLabel>
                  <FormControl>
                    <Input
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
              name="discount_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      {...field}
                      placeholder="e.g. 10 or 100"
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? "" : parseFloat(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usage_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? "" : parseFloat(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 hover:cursor-pointer text-white font-semibold py-2 rounded-xl transition-all duration-150"
            >
              Create Coupon
            </Button>
          </form>
        </Form>

        <SheetFooter className="mt-6" />
      </SheetContent>
    </Sheet>
  );
}
