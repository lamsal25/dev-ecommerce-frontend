"use client";
import { 
  LuUser, LuMail, LuPhone, LuCalendar, 
  LuMapPin, LuFlag, LuFileText, LuShield 
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransition, useState, useEffect } from "react";
import { getUser,updateUser} from "@/app/(protected)/actions/user";
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  mobile: z.string().optional(),
  dateOfBirth: z.string().optional(),
  
  // Address Information
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

export function UserProfileDialog({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      mobile: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    }
  });

  useEffect(() => {
    if (open && id) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const response = await getUser();
        
          if (response.data) {
            const userData = response.data;
            form.reset({
              firstName: userData.profile?.firstName || "",
              lastName: userData.profile?.lastName || "",
              email: userData.email || "",
              username: userData.username || "",
              mobile: userData.profile?.mobile || "",
              dateOfBirth: userData.profile?.dateOfBirth || "",
              address: userData.profile?.address || "",
              city: userData.profile?.city || "",
              state: userData.profile?.state || "",
              country: userData.profile?.country || "",
              postalCode: userData.profile?.postalCode || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load your profile data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [id, form, open]);

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    startTransition(async () => {
      try {
        const response = await updateUser(data, id);
        if (response.status === 200) {
          toast.success("Profile updated successfully!");
          console.log(response)
          setOpen(false);
        } else {
          toast.error(response.error || "Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl font-bold">
            Edit Your Profile
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="flex-grow pr-4 overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
              {/* Personal Information Section */}
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 flex items-center gap-2">
                  <LuUser className="text-primary" /> Personal Information
                </h3>
                
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <Input
                      placeholder="First Name"
                      {...form.register("firstName")}
                      className={form.formState.errors.firstName ? "border-red-500" : ""}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <Input
                      placeholder="Last Name"
                      {...form.register("lastName")}
                      className={form.formState.errors.lastName ? "border-red-500" : ""}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <Input
                      placeholder="Email"
                      {...form.register("email")}
                      className={form.formState.errors.email ? "border-red-500" : ""}
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Username *</label>
                    <Input
                      placeholder="Username"
                      {...form.register("username")}
                      className={form.formState.errors.username ? "border-red-500" : ""}
                    />
                    {form.formState.errors.username && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                    <Input
                      placeholder="Mobile"
                      {...form.register("mobile")}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <Input
                      type="date"
                      {...form.register("dateOfBirth")}
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 flex items-center gap-2">
                  <LuMapPin className="text-primary" /> Address Information
                </h3>
                
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <Textarea
                      placeholder="Address"
                      {...form.register("address")}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <Input
                      placeholder="City"
                      {...form.register("city")}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">State/Province</label>
                    <Input
                      placeholder="State/Province"
                      {...form.register("state")}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <Input
                      placeholder="Country"
                      {...form.register("country")}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <Input
                      placeholder="Postal Code"
                      {...form.register("postalCode")}
                    />
                  </div>
                </div>
              </div>

              {/* Form Submission */}
              <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-background pb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary hover:bg-primary/90"
                >
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