
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ContactSection() {
  return (
    <div className="mt-16">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <h3 className="text-xl font-semibold mb-4">Can't find what you're looking for?</h3>
        <p className="text-gray-600 mb-4">
          We regularly update our inventory. Check back soon or contact us for special requests.
        </p>
        <Link href="/contact">
          <Button className="font-medium">Contact us</Button>
        </Link>
      </div>
    </div>
  );
}