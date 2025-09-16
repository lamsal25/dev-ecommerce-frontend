'use client';

import React from 'react';
import CreateCategory from './components/createCategory';
import { BreadcrumbDemo } from './components/breadCrumb';
import CategoryTable from './components/categoryTable';

export default function VendorDashboard() {
  return (
    <div className="w-full container mx-auto py-10 px-6">
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6'>
        {/* <BreadcrumbDemo /> */}
       <div className='text-xl text-secondary'> Manage Categories <span className='text-primary'> Here. </span></div>
        <div></div>
        <div className='w-fit place-self-center'>
          <CreateCategory />
        </div>
      </div>
      <CategoryTable />
    </div>
  );
}
