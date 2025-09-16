"use client";

import React, { useState, useEffect } from "react";
import { BreadcrumbDemo } from "./components/breadCrumb";
import CreateProduct from "./components/createProduct";
import EditProduct from "./components/editProduct";
import API from "@/lib/api";
import {getProductsByVendor } from "../../actions/product";
import { toast, ToastContainer } from "react-toastify";
import { ProductDataTable } from "./components/productDataTable";

export default function ProductDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductsByVendor();
      setData(
        response.data.map((product: any) => ({
          ...product,
          originalPrice: Number(product.originalPrice),
          discountedPrice: Number(product.discountedPrice),
          initialStock: Number(product.initialStock),
          totalStock: Number(product.totalStock),
          isAvailable: Boolean(product.isAvailable),
          isFeatured: Boolean(product.isFeatured),
          category: product.category || { id: 0, name: "Uncategorized" },
        }))
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setIsDeleting(true);
        const response = await API.delete(`/products/deleteProduct/${id}/`);
        if (response.status === 200) {
          toast.success("Product deleted successfully!");
          fetchProducts();
        } else {
          toast.error("Failed to delete product");
        }
      } catch (error: any) {
        console.error("Error deleting product:", error);
        toast.error(error.response?.data?.error || "An error occurred");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditSuccess = () => {
    fetchProducts();
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto py-10 px-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <BreadcrumbDemo />
        <CreateProduct onSuccess={fetchProducts} />
      </div>

      <ProductDataTable 
        data={data} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {editingProduct && (
        <EditProduct
          product={editingProduct}
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}