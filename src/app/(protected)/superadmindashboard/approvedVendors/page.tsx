'use client'

import { useEffect, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcApprove } from 'react-icons/fc'
import { FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import API from '@/lib/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Vendor = {
  id: number
  businessName: string
  ownerName: string
  email: string
  phone: string
  address: string
}

export default function ApprovedVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [loading, setLoading] = useState(true)

  const fetchVendors = async () => {
    try {
      const res = await API.get(`/vendors/approved/`)
      setVendors(res.data)
    } catch (err) {
      toast.error('Failed to load vendors.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const handleDeleteVendor = async (vendorId: number) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await API.delete(`vendors/deleteVendor/${vendorId}/`)
        toast.success("Vendor deleted successfully.")
        setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId))
      } catch (err) {
        toast.error("Failed to delete vendor.")
      }
    }
  }

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "businessName",
      header: "Business Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("businessName")}</div>
      ),
    },
    {
      accessorKey: "ownerName",
      header: "Owner Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("address")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => (
        <div className="flex items-center justify-center gap-1 text-green-600">
          <span>Verified</span>
          <FcApprove className="h-5 w-5" />
        </div>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleDeleteVendor(row.original.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete Vendor"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: vendors,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl text-primary my-6 font-medium">
        Verified <span className="text-secondary">Vendors</span>
      </h2>

      <div className="flex items-center py-4 ">
        <Input
          placeholder="Filter vendors..."
          value={(table.getColumn("businessName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("businessName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
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
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No approved vendors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
