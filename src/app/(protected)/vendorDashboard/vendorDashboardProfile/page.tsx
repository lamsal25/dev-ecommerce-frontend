"use client";
import React, { useEffect, useState, useTransition } from "react";
import {
  LuUser, LuMail, LuPhone, LuCalendar,
  LuMapPin, LuFlag, LuFileText, LuShield, LuGlobe,
  LuDollarSign
} from "react-icons/lu";
import { getVendorProfile, getVendorTotalSales } from "../../actions/vendor";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorProfileDialog } from "./components/vendorProfileDialog";
export default function VendorProfilePage() {
  const [isPending, startTransition] = useTransition();
  const [vendor, setVendor] = useState<any>();

  useEffect(() => {
    startTransition(async () => {
      const response = await getVendorProfile();
      const data = response.data;
      console.log(data);
      setVendor(data);
    });
  }, []);

  const [totalSales, setTotalSales] = useState(0)

  useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await getVendorTotalSales()
      if (!error && data) {
        setTotalSales(data.total_sales)
      }
    }
    fetchSales()
  }, [])


  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  if (isPending) return <VendorProfileSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Vendor Profile</h1>
          <p className="text-gray-600 mt-1">Manage your business information and account status</p>
        </div>
        <VendorProfileDialog id={vendor?.id} />
      </div>

      {/* Vendor Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <LuUser className="text-5xl text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{vendor?.businessName}</h2>
            <p className="text-gray-500 mt-1">{vendor?.email}</p>

            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-14">
                <div className="flex items-center gap-3">
                  <LuCalendar className="text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Applied At</p>
                    <p className="font-medium">{formatDate(vendor?.appliedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <LuDollarSign className="text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-orange-600">Sales Summary</p>
                    <p className="font-medium text-orange-600"><span className="text-blue-800">NRS</span> {totalSales.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LuPhone className="text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{vendor?.phone || 'N/A'}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Vendor Details */}
        <div className="md:col-span-2 bg-white shadow-sm rounded-lg p-6 border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b pb-2">Business Information</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem icon={<LuUser />} label="Owner Name" value={vendor?.ownerName} />
            <InfoItem icon={<LuFileText />} label="Business Type" value={vendor?.businessType} />
            <InfoItem icon={<LuMail />} label="Email" value={vendor?.email} />
            <InfoItem icon={<LuShield />} label="Approval Status" value={vendor?.isApproved ? 'Approved' : 'Pending'} statusColor={vendor?.isApproved ? 'bg-green-500' : 'bg-orange-500'} />
            <InfoItem icon={<LuFileText />} label="Registration Number" value={vendor?.registrationNumber} />
            <InfoItem icon={<LuGlobe />} label="Website" value={vendor?.website || 'N/A'} />
            <InfoItem icon={<LuFileText />} label="Description" value={vendor?.businessDescription} />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-primary border-b pb-2 flex items-center gap-2">
          <LuMapPin className="text-primary" /> Business Address
        </h3>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <InfoItem icon={<LuMapPin />} label="Address" value={vendor?.address} />
          <InfoItem icon={<LuMapPin />} label="City" value={vendor?.city} />
          <InfoItem icon={<LuFlag />} label="Country" value={vendor?.country} />
        </div>
      </div>
    </div>
  );
}

// Reusable info item component
function InfoItem({ icon, label, value, statusColor }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-primary mt-1">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium flex items-center gap-2">
          {statusColor && <span className={`w-2 h-2 rounded-full ${statusColor}`} />}
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );
}

function VendorProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-64 rounded-lg" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}
