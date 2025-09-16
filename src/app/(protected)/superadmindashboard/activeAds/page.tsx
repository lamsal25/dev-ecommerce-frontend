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
import Image from 'next/image'

type Advertisement = {
  id: number
  title: string
  image: string
  link: string
  position: string
  start_date: string
  end_date: string
  priority: number
  is_active: boolean
  payment_done: boolean
  vendor: number
}

export default function ActiveAdsTable() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await API.get(`advertisements/active-ads/`)
        setAds(res.data)
      } catch (err) {
        toast.error('Failed to load active advertisements.')
      } finally {
        setLoading(false)
      }
    }
    fetchAds()
  }, [])

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
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => new Date(row.getValue("startDate")).toLocaleString(),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => new Date(row.getValue("endDate")).toLocaleString(),
    },
    
  ]

  const table = useReactTable({
    data: ads,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
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
        Active <span className="text-secondary">Advertisements</span>
      </h2>

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
                  No active ads found.
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
