 'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import API from '@/lib/api';
import { toast } from 'react-toastify';

interface CategoryDeleteProps {
  id: number;
  onSuccess: () => void;
}

export function CategoryDelete({ id, onSuccess }: CategoryDeleteProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setIsLoading(true);
      
      try {
        const response = await API.delete(`/products/deleteCategory/${id}/`);

        if (response.status === 200) {
          toast.success("Category deleted successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            }); 
          onSuccess();
        }
        else {
            toast.error("Failed to delete category", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
            }
        
      } catch (error) {
            console.error("Error creating category", error);
            alert(error);
        }
        finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-red-600 hover:text-red-700"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
}