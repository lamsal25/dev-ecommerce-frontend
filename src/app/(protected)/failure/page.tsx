import Link from 'next/link';
import Head from 'next/head';
import { XCircle } from 'lucide-react';

export default function Failure() {
  return (
    <>
      <Head>
        <title>Payment Failed</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
          <div className="flex justify-center mb-4">
            <XCircle className="text-red-500 w-16 h-16" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            Something went wrong. Please try again or use a different payment method.
          </p>
          <Link href="/checkout" className="inline-block bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition">
            Try Again
          </Link>
        </div>
      </div>
    </>
  );
}
