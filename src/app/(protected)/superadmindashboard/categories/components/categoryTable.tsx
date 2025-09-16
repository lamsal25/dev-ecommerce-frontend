'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import EditCategory from './editCategory';
import { getActiveCategories } from '../../../actions/category';
import { toast, ToastContainer } from 'react-toastify';
import API from '@/lib/api';

interface Category {
  id: number;
  name: string;
  image: string | null;
  parent: Category | null;
  subcategories: Category[];
}

export default function CategoryTable() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  const toggleExpand = useCallback((categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const columns: ColumnDef<Category>[] = useMemo(() => [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => {
        const category = row.original;
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;
        const isExpanded = expandedCategories[category.id];
        
        return (
          <div className="flex items-center gap-2" style={{ paddingLeft: `${(category.parent ? 1 : 0) * 20}px` }}>
            {hasSubcategories && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(category.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            {!hasSubcategories && <div className="w-6" />}
            <span>{category.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const image = row.original.image;
        return image ? (
          <img src={image} alt={row.original.name} className="w-12 h-12 object-cover rounded" />
        ) : (
          <span className="text-gray-500">No image</span>
        );
      },
    },
    {
      accessorKey: "parent",
      header: "Parent Category",
      cell: ({ row }) => {
        return row.original.parent ? row.original.parent.name : "Top-level";
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(category.id)}
                className="text-red-600"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [expandedCategories, toggleExpand, isDeleting]);

  const flattenedData = useMemo(() => {
    return flattenCategories(data, expandedCategories);
  }, [data, expandedCategories]);

  const table = useReactTable({
    data: flattenedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getActiveCategories();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const response = await API.delete(`/products/deleteCategory/${id}/`);
        if (response.status === 200) {
          toast.success("Category deleted successfully!");
          await fetchCategories();
        } else {
          toast.error("Failed to delete category");
        }
      } catch (error: any) {
        console.error('Error deleting category:', error);
        toast.error(error.response?.data?.error || 'An error occurred while deleting the category');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditSuccess = () => {
    fetchCategories();
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <ToastContainer position="top-right" autoClose={5000} />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-normal break-words max-w-[300px] overflow-hidden">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editingCategory && (
        <EditCategory
          category={editingCategory} 
          isOpen={isEditModalOpen}
          setIsOpen={(isOpen) => {
            setIsEditModalOpen(isOpen);
            if (!isOpen) setEditingCategory(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

function flattenCategories(categories: Category[], expanded: Record<number, boolean>): Category[] {
  return categories.reduce<Category[]>((acc, category) => {
    acc.push(category);
    if (expanded[category.id] && category.subcategories?.length) {
      acc.push(...flattenCategories(category.subcategories, expanded));
    }
    return acc;
  }, []);
}