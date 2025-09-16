'use client'

import { useEffect, useState, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
} from '@tanstack/react-table'
import { toast } from 'react-toastify'
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { getAdsByVendor } from '../../actions/vendor'
import { TableSkeleton } from '@/components/skeletons'

type Advertisement = {
    id: number
    title: string
    image: string
    link: string
    position: string
    startDate: string
    endDate: string
    priority: number
    isApproved: boolean
    paymentDone: boolean
    vendor: number
    status: string
}

export default function AdsTableContent() {
    const [ads, setAds] = useState<Advertisement[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [loading, setLoading] = useState(true)
    const [pageCount, setPageCount] = useState(0)
    const [tableState, setTableState] = useState({ pageIndex: 0, pageSize: 5 })

    const columns = useMemo<ColumnDef<Advertisement>[]>(() => [
        { accessorKey: 'title', header: 'Title' },
        {
            accessorKey: 'image',
            header: 'Image',
            cell: ({ row }) => (
                <div className="w-20 h-12 overflow-hidden rounded">
                    <Image
                        src={row.getValue('image')}
                        alt="Ad"
                        width={80}
                        height={48}
                        className="object-cover"
                        unoptimized
                    />
                </div>
            ),
        },
        {
            accessorKey: 'link',
            header: 'Link',
            cell: ({ row }) => (
                <a href={row.getValue('link')} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                    Visit
                </a>
            ),
        },
        { accessorKey: 'position', header: 'Position' },
        {
            accessorKey: 'startDate',
            header: 'Start Date',
            cell: ({ row }) => new Date(row.getValue('startDate')).toLocaleString(),
        },
        {
            accessorKey: 'endDate',
            header: 'End Date',
            cell: ({ row }) => new Date(row.getValue('endDate')).toLocaleString(),
        },
        {
            accessorKey: 'isApproved',
            header: 'Approved',
            cell: ({ row }) => {
                const v = row.getValue('isApproved')
                return <span className={`text-sm font-semibold ${v ? 'text-green-600' : 'text-red-500'}`}>{v ? 'Yes' : 'No'}</span>
            },
        },
        {
            accessorKey: 'paymentDone',
            header: 'Paid',
            cell: ({ row }) => {
                const v = row.getValue('paymentDone')
                return <span className={`text-sm font-semibold ${v ? 'text-green-600' : 'text-red-500'}`}>{v ? 'Yes' : 'No'}</span>
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const s = row.getValue('status') as string
                let color = 'text-gray-600'
                if (s === 'active') color = 'text-green-600'
                else if (s === 'pending') color = 'text-yellow-600'
                else if (s === 'closed') color = 'text-red-600'
                else if (s === 'scheduled') color = 'text-blue-600'
                return <span className={`text-sm font-semibold ${color}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            },
        },
    ], [])

    const table = useReactTable({
        data: ads,
        columns,
        state: { sorting, pagination: tableState },
        manualPagination: true,
        pageCount,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setTableState,
    })

    useEffect(() => {
        const fetchAds = async () => {
            setLoading(true)
            try {
                const { data, error } = await getAdsByVendor(tableState.pageIndex + 1, tableState.pageSize)
                if (error || !data) {
                    toast.error('Error loading ads')
                } else {
                    const mapped = data.results.map((ad: any) => ({
                        ...ad,
                        isApproved: ad.isActive,
                        paymentDone: ad.paymentDone,
                        status: ad.status || 'pending',
                    }))
                    setAds(mapped)
                    setPageCount(Math.ceil(data.count / tableState.pageSize))
                }
            } catch {
                toast.error('Failed to load ads.')
            } finally {
                setLoading(false)
            }
        }

        fetchAds()
    }, [tableState.pageIndex, tableState.pageSize])

    if (loading) {
        return (
             <TableSkeleton/>
        )
    }

    return (
        <>
            <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[800px] w-full">
                    <TableHeader className="bg-gray-100">
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(h => (
                                    <TableHead key={h.id}>
                                        {flexRender(h.column.columnDef.header, h.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">No ads found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end flex-wrap gap-2 py-4">

                <div className="flex gap-2 ">
                    <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of {pageCount}
                    </div>
                    <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    )
}
