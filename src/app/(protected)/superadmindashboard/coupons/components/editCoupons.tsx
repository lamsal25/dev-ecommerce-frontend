"use client";
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
import { toast } from "react-toastify";

// Type Definitions
type Coupon = {
  id: number;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  usage_limit: number;
  used_count: number;
  expiry_date: string;
};

type CouponFormValues = z.infer<typeof couponSchema>;

export default function EditCoupon({
  coupon,
  isOpen,
  setIsOpen,
  onSuccess,
}: {
  coupon: Coupon;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      usage_limit: coupon.usage_limit,
      expiry_date: coupon.expiry_date.slice(0, 16), // For datetime-local input
    },
  });

  const onSubmit = async (values: CouponFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await API.put(
        `/coupons/updateCoupon/${coupon.id}/`,
        values
      );

      if (response.status === 200) {
        toast.success("Coupon updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        form.reset();
        setIsOpen(false);
        onSuccess();
      } else {
        toast.error("Failed to update coupon", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      console.error("Error updating coupon", error);
      alert(error.response?.data?.error || "Failed to update coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-fit max-w-md sm:max-w-lg px-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl text-center font-semibold text-primary">
            Edit <span className="text-secondary underline">Coupon</span>
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value)
                        )
                      }
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : parseInt(e.target.value)
                        )
                      }
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
              disabled={isSubmitting}
              className="w-full bg-secondary hover:bg-secondary/90 text-white py-2 rounded-xl"
            >
              {isSubmitting ? "Updating..." : "Update Coupon"}
            </Button>
          </form>
        </Form>

        <SheetFooter className="mt-6" />
      </SheetContent>
    </Sheet>
  );
}
