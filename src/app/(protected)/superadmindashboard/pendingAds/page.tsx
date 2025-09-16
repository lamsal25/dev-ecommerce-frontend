'use client'

import { useEffect, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'react-toastify'
import API from '@/lib/api'
import { Input } from "@/components/ui/input"
import { getPendingAds } from '../../actions/advertisement'

type Advertisement = {
  id: number
  title: string
  image: string
  link: string
  position: string
  startDate: string
  endDate: string
  isActive: boolean
  paymentDone: boolean
  vendor: number
}

export default function PendingAdsTable() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [loading, setLoading] = useState(true)

  const fetchAds = async () => {
    setLoading(true)
    try {
      const res = await getPendingAds();
      setAds(res.data)
      console.log(res.data)
    } catch (err) {
      toast.error('Failed to load pending advertisements.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchAds()
  }, [])


  const handleApprove = async (id: number) => {
    try {
      await API.patch(`advertisements/approve/${id}/`)
      toast.success('Advertisement approved successfully.')
      setAds(prev => prev.filter(ad => ad.id !== id))
    } catch (err) {
      toast.error('Failed to approve the advertisement.')
    }
  }

  const handleReject = async (id: number) => {
    if (window.confirm('Are you sure you want to reject this advertisement?')) {
      try {
        await API.delete(`advertisements/reject/${id}/`)
        toast.success('Advertisement rejected successfully.')
        setAds(prev => prev.filter(ad => ad.id !== id))
      } catch (err) {
        toast.error('Failed to reject the advertisement.')
      }
    }
  }

  const handlePaymentUpdate = async (id: number) => {
    if (window.confirm('Are you sure the payment is completed?')) {
      try {
        await API.patch(`advertisements/updatePaymentStatus/${id}/`)
        toast.success(`Payment marked as received`)
        await fetchAds() // reload data
      } catch (err) {
        toast.error("Failed to update payment status.")
      }
    }
  }


  const columns: ColumnDef<Advertisement>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-20 h-12 overflow-hidden rounded">
          <img
            src={row.getValue("image")}
            alt="Ad"
            className="object-cover w-full h-full"
          />
        </div>
      ),
    },
    {
      accessorKey: "link",
      header: "Link",
      cell: ({ row }) => (
        <a href={row.getValue("link")} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
          Visit
        </a>
      ),
    },
    {
      accessorKey: "vendorName",
      header: "Vendor Name",
      cell: ({ row }) => (
        <div>{row.getValue("vendorName")}</div>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => new Date(row.getValue("startDate")).toLocaleDateString(),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => new Date(row.getValue("endDate")).toLocaleDateString(),
    },
    {
      accessorKey: "paymentDone",
      header: "Payment",
      cell: ({ row }) => {
        const ad = row.original;

        // If payment is done, show 'Completed'
        if (ad.paymentDone) {
          return (
            <span className="text-green-600 font-medium text-sm">Completed</span>
          );
        }

        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="text-xs px-2 py-1"
              onClick={() => handlePaymentUpdate(ad.id)}
            >
              Mark Received
            </Button>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const ad = row.original
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprove(ad.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
            >
              Approve
            </Button>
            <Button
              onClick={() => handleReject(ad.id)}
              variant="destructive"
              className="px-3 py-1 text-sm"
            >
              Reject
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: ads,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        Pending <span className="text-secondary">Advertisements</span>
      </h2>

      {/* Search Filter */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter ads by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      {/* Table */}
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
                  No pending ads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
