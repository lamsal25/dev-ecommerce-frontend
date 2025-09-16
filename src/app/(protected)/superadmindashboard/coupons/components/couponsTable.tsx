"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronDown, ChevronRight } from "lucide-react";
// import EditCategory from "./editCategory";
import { toast, ToastContainer } from "react-toastify";
import API from "@/lib/api";
import { getCoupons } from "@/app/(protected)/actions/coupons";
import EditCoupon from "./editCoupons";
interface Coupon {
  id: number;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  usage_limit: number;
  used_count: number;
  expiry_date: string;
}

export default function CategoryTable() {
  const [data, setData] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns: ColumnDef<Coupon>[] = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Coupon Code",
      },
      {
        accessorKey: "discount_type",
        header: "Discount Type",
      },
      {
        accessorKey: "discount_value",
        header: "Discount Value",
        cell: ({ row }) => {
          const type = row.original.discount_type;
          const value = row.original.discount_value;
          return type === "percent" ? `${value} %` : `Rs. ${value}`;
        },
      },
      {
        accessorKey: "usage_limit",
        header: "Usage Limit",
      },
      {
        accessorKey: "used_count",
        header: "Used Count",
      },
      {
        accessorKey: "expiry_date",
        header: "Expires At",
        cell: ({ row }) => new Date(row.original.expiry_date).toLocaleString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const coupon = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(coupon)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(coupon.id)}
                  className="text-red-600"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [isDeleting]
  );

  const table = useReactTable({
    data: data ?? [], // fallback in case data is undefined
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await getCoupons();
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleEditSuccess = () => {
    fetchCoupons();
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this coupon? This action cannot be undone."
      )
    ) {
      try {
        setIsDeleting(true);
        console.log("Deleting coupon id:", id);
        const response = await API.delete(`coupons/deleteCoupon/${id}/`);
        if (response.status === 200) {
          toast.success("Coupons Deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          setTimeout(async () => {
            await fetchCoupons();
          }, 1000);
        } else {
          toast.error("Failed to delete coupon", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        }
      } catch (error: any) {
        console.error("Error deleting coupon:", error);
        toast.error(
          error.response?.data?.error ||
            "An error occurred while deleting the coupon",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      } finally {
        setIsDeleting(false);
      }
    }
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
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table?.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="whitespace-normal break-words max-w-[300px] overflow-hidden"
                  >
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

      {editingCoupon && (
        <EditCoupon
          coupon={editingCoupon}
          isOpen={isEditModalOpen}
          setIsOpen={(isOpen) => {
            setIsEditModalOpen(isOpen);
            if (!isOpen) setEditingCoupon(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
