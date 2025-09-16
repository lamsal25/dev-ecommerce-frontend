'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BuyNowButtonProps {
  productId: number;
  quantity?: number;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({ productId, quantity = 1 }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    try {
      setLoading(true);

      await axios.post(
        'http://localhost:8000/api/buy-now/',
        {
          product_id: productId,
          quantity: quantity,
        },
        { withCredentials: true } // to send session cookies
      );

      router.push('/checkout');
    } catch (error) {
      console.error('Buy Now failed:', error);
      alert('Something went wrong while trying to buy the product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      {/* {loading ? 'Processing...' : 'Buy Now'} */}
    </button>
  );
};

export default BuyNowButton;
