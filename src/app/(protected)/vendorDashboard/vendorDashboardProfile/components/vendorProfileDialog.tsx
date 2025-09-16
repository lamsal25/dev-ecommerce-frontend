"use client";
import {LuUser,LuMapPin} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransition, useState, useEffect } from "react";
import { getVendorProfile, updateVendorProfile } from "@/app/(protected)/actions/vendor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { vendorSchema } from "@/formSchema/vendor";

export function VendorProfileDialog({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      ownerName: "",
      email: "",
      phone: "",
      businessName: "",
      businessType: "",
      businessDescription: "",
      registrationNumber: "",
      address: "",
      city: "",
      country: "",
      website: "",
    }
  });

  useEffect(() => {
    if (open && id) {
      const fetchVendorData = async () => {
        setIsLoading(true);
        try {
          const response = await getVendorProfile();
          if (response.data) {
            const vendorData = response.data;
            form.reset({
              ownerName: vendorData.ownerName || "",
              email: vendorData.email || "",
              phone: vendorData.phone || "",
              businessName: vendorData.businessName || "",
              businessType: vendorData.businessType || "",
              businessDescription: vendorData.businessDescription || "",
              registrationNumber: vendorData.registrationNumber || "",
              address: vendorData.address || "",
              city: vendorData.city || "",
              country: vendorData.country || "",
              website: vendorData.website || "",
            });
          }
        } catch (error) {
          console.error("Error fetching vendor data:", error);
          toast.error("Failed to load vendor data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchVendorData();
    }
  }, [id, form, open]);

  const onSubmit = (data: z.infer<typeof vendorSchema>) => {
    startTransition(async () => {
      try {
        const response = await updateVendorProfile(data);
        if (response.status === 200) {
          toast.success("Vendor profile updated successfully!");
          setOpen(false);
        } else {
          toast.error(response.error || "Failed to update vendor profile");
        }
      } catch (error) {
        console.error("Error updating vendor profile:", error);
        toast.error("Failed to update vendor profile");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
          Edit Vendor Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl font-bold">
            Edit Vendor Profile
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="flex-grow pr-4 overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
              {/* Vendor Info Section */}
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 flex items-center gap-2">
                  <LuUser className="text-primary" /> Vendor Information
                </h3>

                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <InputField form={form} name="ownerName" label="Owner Name *" placeholder="Owner Name" />
                  <InputField form={form} name="email" label="Email *" placeholder="Email" />
                  <InputField form={form} name="phone" label="Phone" placeholder="Phone" />
                  <InputField form={form} name="businessName" label="Business Name *" placeholder="Business Name" />
                  <InputField form={form} name="businessType" label="Business Type *" placeholder="Business Type" />
                  <InputField form={form} name="registrationNumber" label="Registration Number" placeholder="Registration Number" />
                  <InputField form={form} name="website" label="Website" placeholder="Website" />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Business Description</label>
                  <Textarea
                    placeholder="Business Description"
                    {...form.register("businessDescription")}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 flex items-center gap-2">
                  <LuMapPin className="text-primary" /> Address Information
                </h3>

                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <InputField form={form} name="address" label="Address" placeholder="Address" />
                  <InputField form={form} name="city" label="City" placeholder="City" />
                  <InputField form={form} name="country" label="Country" placeholder="Country" />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-background pb-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
                  {isPending ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <span className="animate-spin">↻</span>
                    </>
                  ) : "Save Changes"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Reusable input field with validation error display
function InputField({ form, name, label, placeholder }: any) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Input
        placeholder={placeholder}
        {...form.register(name)}
        className={form.formState.errors[name] ? "border-red-500" : ""}
      />
      {form.formState.errors[name] && (
        <p className="text-red-500 text-xs mt-1">{form.formState.errors[name].message}</p>
      )}
    </div>
  );
}
