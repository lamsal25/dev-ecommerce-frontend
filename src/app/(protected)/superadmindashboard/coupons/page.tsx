"use client";

import React from "react";
import CreateCoupons from "./components/createCoupon";
import { BreadcrumbDemo } from "./components/breadCrumb";
import CouponsTable from "./components/couponsTable";

export default function VendorDashboard() {
  return (
    <div className="w-full container mx-auto py-10 px-6">
      <h2 className="text-3xl text-primary font-medium">
        Cou<span className="text-secondary">pons</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
        <BreadcrumbDemo />
        <div></div>
        <div className="w-fit place-self-center">
          <CreateCoupons />
        </div>
      </div>
      <CouponsTable />
    </div>
  );
}
